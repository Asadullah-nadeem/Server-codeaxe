<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DmsController extends Controller
{
    // ─── Helper: resolve provider credentials from DB ─────
    private function getProviderKey(string $provider, string $keyName): ?string
    {
        $row = DB::table('dms_provider_keys')
            ->where('provider', $provider)
            ->where('key_name', $keyName)
            ->first();
        return $row ? $row->key_value : null;
    }

    // ─── Helper: stream a media file back to browser ──────
    private function streamMedia(Media $media): \Illuminate\Http\Response
    {
        if ($media->provider === 's3') {
            try {
                $url = Storage::disk('s3')->temporaryUrl($media->url, now()->addMinutes(30));
            } catch (\Exception $e) {
                abort(404, 'S3 URL generation failed.');
            }
        } else {
            $url = $media->url; // ImageKit public URL
        }

        $response = Http::get($url);
        if ($response->failed()) {
            abort(404, 'Media not found at provider.');
        }

        return response($response->body())
            ->header('Content-Type', $response->header('Content-Type'))
            ->header('Cache-Control', 'public, max-age=3600');
    }

    // ─── GET /api/dms/media/{slug}/{id} – public proxy ───
    public function showImage(string $slug, int $id)
    {
        $media = Media::where('slug', $slug)
            ->where('id', $id)
            ->where('status', 1)
            ->firstOrFail();

        return $this->streamMedia($media);
    }

    private function getMediaBaseUrl()
    {
        $setting = DB::table('site_settings')->where('setting_key', 'image_base_url')->first();
        return $setting ? $setting->setting_value : url('/api/dms/media');
    }

    private function isProxyEnabled()
    {
        $setting = DB::table('site_settings')->where('setting_key', 'image_proxy_enabled')->first();
        return $setting ? ($setting->setting_value === '1' || $setting->setting_value === 'true') : true;
    }

    // ─── GET /api/dms/media – list active media ───────────
    public function index()
    {
        $baseUrl = $this->getMediaBaseUrl();
        $proxyEnabled = $this->isProxyEnabled();
        $images = Media::where('status', 1)
            ->orderByDesc('uploaded_at')
            ->get();

        foreach ($images as $img) {
            $img->path = $proxyEnabled ? $baseUrl . "/{$img->slug}/{$img->id}" : $img->url;
        }

        return response()->json(['success' => true, 'data' => $images]);
    }

    // ─── GET /api/dms/media/all – list including trashed ──
    public function all()
    {
        $baseUrl = $this->getMediaBaseUrl();
        $proxyEnabled = $this->isProxyEnabled();
        $images = Media::orderByDesc('uploaded_at')->get();

        foreach ($images as $img) {
            $img->path = $proxyEnabled ? $baseUrl . "/{$img->slug}/{$img->id}" : $img->url;
        }

        return response()->json(['success' => true, 'data' => $images]);
    }

    // ─── POST /api/dms/media – upload new file ────────────
    public function store(Request $request)
    {
        // Debugging logs for the "Failed to upload" error
        if (!$request->hasFile('photo')) {
            $errCode = $_FILES['photo']['error'] ?? 'NONE_IN_FILES';
            Log::error("Media Upload Debug: 'photo' field missing or has error. Error Code: " . $errCode);
            if ($errCode == 1 || $errCode == 2) {
                return response()->json(['success' => false, 'message' => 'The file is too LARGE for your PHP settings. Increase upload_max_filesize in php.ini.'], 422);
            }
        }

        $request->validate([
            'photo'            => 'required|file|mimes:jpeg,png,jpg,gif,svg,mp4,mov,avi,wmv,webp,pdf,zip,ico,mpeg,webm,avif|max:51200', // 50 MB max
            'storage_provider' => 'required|in:imagekit,s3',
            'username'         => 'required|string|max:50',
        ], [
            'photo.mimes' => 'The file type you selected is not supported. Please use images, videos (MP4, MOV, etc), PDF, or ZIP.',
            'photo.max'   => 'The file is too large! Maximum allowed size is 50MB.',
        ]);


        $provider   = $request->input('storage_provider') ?? $request->attributes->get('dms_key_provider') ?? 's3';
        $file       = $request->file('photo');
        $username   = Str::slug($request->input('username'));
        $origName   = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension  = $file->getClientOriginalExtension();
        $randomName = Str::slug($origName) . '_' . uniqid() . '.' . $extension;
        $slug       = Str::random(6);
        $folder     = 'data-dms-api/' . $username;

        try {
            if ($provider === 'imagekit') {
                // Load ImageKit credentials (DB first, then .env fallback)
                $pubKey      = $this->getProviderKey('imagekit', 'public_key')   ?? env('IMAGEKIT_PUBLIC_KEY');
                $privKey     = $this->getProviderKey('imagekit', 'private_key')  ?? env('IMAGEKIT_PRIVATE_KEY');
                $urlEndpoint = $this->getProviderKey('imagekit', 'url_endpoint') ?? env('IMAGEKIT_URL_ENDPOINT');

                if (!$pubKey || !$privKey || !$urlEndpoint) {
                    return response()->json(['success' => false, 'message' => 'ImageKit credentials not configured in DB or .env.'], 500);
                }

                $response = Http::withBasicAuth($privKey, '')
                    ->attach('file', file_get_contents($file->getRealPath()), $randomName)
                    ->post('https://upload.imagekit.io/api/v1/files/upload', [
                        'fileName'          => $randomName,
                        'folder'            => $folder,
                        'useUniqueFileName' => 'false',
                    ]);

                if ($response->failed()) {
                    return response()->json(['success' => false, 'message' => 'ImageKit Upload failed: ' . $response->body()], 500);
                }

                $finalUrl   = $response->json()['url'];
                $provFileId = $response->json()['fileId'];

            } else { // s3
                // Load S3 credentials from DB if available, otherwise fallback to .env
                $s3Key    = $this->getProviderKey('s3', 'access_key_id')     ?? env('AWS_ACCESS_KEY_ID');
                $s3Secret = $this->getProviderKey('s3', 'secret_access_key') ?? env('AWS_SECRET_ACCESS_KEY');
                $s3Region = $this->getProviderKey('s3', 'default_region')    ?? env('AWS_DEFAULT_REGION');
                $s3Bucket = $this->getProviderKey('s3', 'bucket')            ?? env('AWS_BUCKET');

                if (!$s3Key || !$s3Secret || !$s3Region || !$s3Bucket) {
                    return response()->json(['success' => false, 'message' => 'S3 credentials not fully configured in DB or .env.'], 500);
                }

                // Dynamically reconfigure the S3 disk
                config([
                    'filesystems.disks.s3.key'    => $s3Key,
                    'filesystems.disks.s3.secret' => $s3Secret,
                    'filesystems.disks.s3.region' => $s3Region,
                    'filesystems.disks.s3.bucket' => $s3Bucket,
                    'filesystems.disks.s3.url'    => $this->getProviderKey('s3', 'url')      ?? env('AWS_URL'),
                    'filesystems.disks.s3.endpoint' => $this->getProviderKey('s3', 'endpoint') ?? env('AWS_ENDPOINT'),
                    'filesystems.disks.s3.use_path_style_endpoint' => ($this->getProviderKey('s3', 'use_path_style_endpoint') === '1'),
                    'filesystems.disks.s3.throw'  => true, 
                ]);

                Storage::disk('s3')->putFileAs($folder, $file, $randomName, 'private');
                $finalUrl   = $folder . '/' . $randomName;
                $provFileId = $finalUrl;
            }

            $media = Media::create([
                'slug'             => $slug,
                'file_name'        => $randomName,
                'provider'         => $provider,
                'size'             => $file->getSize(),
                'url'              => $finalUrl,
                'provider_file_id' => $provFileId,
                'status'           => 1,
                'uploaded_at'      => now(),
            ]);

            // Generate local proxy URL (served from our own API) or raw
            $proxyUrl = $this->isProxyEnabled()
                ? $this->getMediaBaseUrl() . '/' . $media->slug . '/' . $media->id
                : $finalUrl;
            $media->update(['path' => $proxyUrl]);

            return response()->json([
                'success'  => true,
                'message'  => 'File uploaded successfully.',
                'url'      => $proxyUrl,
                'media_id' => $media->id,
                'slug'     => $media->slug,
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── PUT /api/dms/media/{id} – update file_name/status
    public function update(Request $request, int $id)
    {
        $request->validate([
            'file_name' => 'sometimes|string|max:255',
            'status'    => 'sometimes|integer|in:0,1',
        ]);

        $media   = Media::findOrFail($id);
        $changes = [];

        if ($request->has('file_name') && $media->file_name !== $request->file_name) {
            $changes[] = ['field' => 'file_name', 'old' => $media->file_name, 'new' => $request->file_name];
        }
        if ($request->has('status') && $media->status != $request->status) {
            $changes[] = ['field' => 'status', 'old' => $media->status, 'new' => $request->status];
        }

        DB::transaction(function () use ($media, $request, $changes) {
            $media->update(array_filter([
                'file_name' => $request->file_name ?? $media->file_name,
                'status'    => $request->status    ?? $media->status,
            ]));

            foreach ($changes as $change) {
                DB::table('media_logs')->insert([
                    'media_id'      => $media->id,
                    'field_changed' => $change['field'],
                    'old_value'     => $change['old'],
                    'new_value'     => $change['new'],
                    'action_type'   => 'EDIT',
                    'changed_at'    => now(),
                ]);
            }
        });

        return response()->json(['success' => true, 'message' => 'Media updated and change history logged.']);
    }

    // ─── DELETE /api/dms/media/{id} – soft delete (status=0)
    public function destroy(int $id)
    {
        $media = Media::findOrFail($id);
        $media->update(['status' => 0]);

        DB::table('media_logs')->insert([
            'media_id'      => $media->id,
            'field_changed' => 'status',
            'old_value'     => '1',
            'new_value'     => '0',
            'action_type'   => 'DELETE',
            'changed_at'    => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Media moved to trash.']);
    }

    // ─── DELETE /api/dms/media/{id}/permanent – permanent delete
    public function permanentDestroy(int $id)
    {
        $media = Media::findOrFail($id);
        $provider = $media->provider;
        $fileId   = $media->provider_file_id;

        try {
            if ($provider === 'imagekit') {
                $privKey = $this->getProviderKey('imagekit', 'private_key') ?? env('IMAGEKIT_PRIVATE_KEY');

                // If we don't have fileId, try to find it by searching files with same name
                if (!$fileId) {
                    $search = Http::withBasicAuth($privKey, '')
                        ->get('https://api.imagekit.io/v1/files', [
                            'name' => $media->file_name,
                            'path' => 'data-dms-api/'
                        ]);
                    if ($search->successful() && !empty($search->json())) {
                        $fileId = $search->json()[0]['fileId'];
                    }
                }

                if ($fileId) {
                    $del = Http::withBasicAuth($privKey, '')
                        ->delete("https://api.imagekit.io/v1/files/{$fileId}");
                }
            } elseif ($provider === 's3') {
                Storage::disk('s3')->delete($media->url);
            }

            // Also delete from DB
            $media->delete();
            return response()->json(['success' => true, 'message' => 'Media permanently deleted from storage and database.']);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Permanent Delete failed: ' . $e->getMessage()], 500);
        }
    }

    // ─── POST /api/dms/media/{id}/restore – restore soft-deleted
    public function restore(int $id)
    {
        $media = Media::findOrFail($id);
        $media->update(['status' => 1]);

        DB::table('media_logs')->insert([
            'media_id'      => $media->id,
            'field_changed' => 'status',
            'old_value'     => '0',
            'new_value'     => '1',
            'action_type'   => 'RESTORE',
            'changed_at'    => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Media restored.']);
    }

    // ─── GET /api/dms/media/{id}/logs – audit history ────
    public function logs(int $id)
    {
        Media::findOrFail($id); // Confirm media exists
        $logs = DB::table('media_logs')
            ->where('media_id', $id)
            ->orderByDesc('changed_at')
            ->get();

        return response()->json(['success' => true, 'data' => $logs]);
    }

    // ─── GET /api/dms/keys – list API keys (admin only) ──
    public function listKeys()
    {
        $keys = DB::table('dms_api_keys')
            ->select('id', 'label', 'api_key', 'api_scope', 'provider', 'is_active', 'created_at')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => $keys]);
    }

    // ─── POST /api/dms/keys – create a new API key ────────
    public function createKey(Request $request)
    {
        $request->validate([
            'label'     => 'required|string|max:100',
            'api_scope' => 'required|in:upload,admin',
            'provider'  => 'sometimes|in:s3,imagekit',
        ]);

        $newKey = 'dms_' . Str::random(48);

        $id = DB::table('dms_api_keys')->insertGetId([
            'label'      => $request->label,
            'api_key'    => $newKey,
            'api_scope'  => $request->api_scope,
            'provider'   => $request->provider ?? 's3',
            'is_active'  => 1,
            'created_at' => now(),
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'API key created. Store this key securely — it will not be shown again.',
            'id'        => $id,
            'api_key'   => $newKey, // Shown ONCE at creation only
            'api_scope' => $request->api_scope,
            'provider'  => $request->provider ?? 's3',
        ], 201);
    }

    // ─── DELETE /api/dms/keys/{id} – revoke key ──────────
    public function revokeKey(int $id)
    {
        DB::table('dms_api_keys')->where('id', $id)->update(['is_active' => 0]);
        return response()->json(['success' => true, 'message' => 'API key revoked.']);
    }

    // ─── GET /api/dms/providers – list provider credentials
    public function listProviders()
    {
        $providers = DB::table('dms_provider_keys')
            ->select('id', 'provider', 'key_name', 'key_value', 'created_at')
            ->get();

        return response()->json(['success' => true, 'data' => $providers]);
    }

    // ─── POST /api/dms/providers – add/update provider key
    public function upsertProvider(Request $request)
    {
        $request->validate([
            'provider'  => 'required|in:imagekit,s3,proxy',
            'key_name'  => 'required|string|max:100',
            'key_value' => 'required|string',
        ]);

        DB::table('dms_provider_keys')->updateOrInsert(
            ['provider' => $request->provider, 'key_name' => $request->key_name],
            ['key_value' => $request->key_value, 'updated_at' => now()]
        );

        return response()->json(['success' => true, 'message' => 'Provider credential saved.']);
    }

    // ─── DELETE /api/dms/providers/{id} – remove credential
    public function deleteProvider(int $id)
    {
        DB::table('dms_provider_keys')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Provider credential removed.']);
    }

    // ─── GET /api/admin/dms/env-keys – list environment configuration
    public function listEnvKeys()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'AWS_ACCESS_KEY_ID'     => env('AWS_ACCESS_KEY_ID'),
                'AWS_SECRET_ACCESS_KEY' => env('AWS_SECRET_ACCESS_KEY'),
                'AWS_DEFAULT_REGION'    => env('AWS_DEFAULT_REGION'),
                'AWS_BUCKET'            => env('AWS_BUCKET'),
                'AWS_BUCKET_RUNTIME'    => env('AWS_BUCKET_RUNTIME'),
                'AWS_REGION_RUNTIME'    => env('AWS_REGION_RUNTIME'),
                'IMAGEKIT_PUBLIC_KEY'   => env('IMAGEKIT_PUBLIC_KEY'),
                'IMAGEKIT_PRIVATE_KEY'  => env('IMAGEKIT_PRIVATE_KEY'),
                'IMAGEKIT_URL_ENDPOINT' => env('IMAGEKIT_URL_ENDPOINT'),
                'MAX_UPLOAD_SIZE_MB'    => env('MAX_UPLOAD_SIZE_MB', 50),
            ]
        ]);
    }
}
