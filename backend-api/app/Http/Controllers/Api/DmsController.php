<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
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

    // ─── GET /api/dms/media – list active media ───────────
    public function index()
    {
        $images = Media::where('status', 1)
            ->orderByDesc('uploaded_at')
            ->get();

        return response()->json(['success' => true, 'data' => $images]);
    }

    // ─── GET /api/dms/media/all – list including trashed ──
    public function all()
    {
        $images = Media::orderByDesc('uploaded_at')->get();
        return response()->json(['success' => true, 'data' => $images]);
    }

    // ─── POST /api/dms/media – upload new file ────────────
    public function store(Request $request)
    {
        $request->validate([
            'photo'            => 'required|image|max:5120', // 5 MB max
            'storage_provider' => 'required|in:imagekit,s3',
            'username'         => 'required|string|max:50',
        ]);

        $provider   = $request->input('storage_provider');
        $file       = $request->file('photo');
        $username   = Str::slug($request->input('username'));
        $origName   = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension  = $file->getClientOriginalExtension();
        $randomName = Str::slug($origName) . '_' . uniqid() . '.' . $extension;
        $slug       = Str::random(6);
        $folder     = 'data-dms-api/' . $username;

        try {
            if ($provider === 'imagekit') {
                // Load ImageKit credentials from DB
                $pubKey      = $this->getProviderKey('imagekit', 'public_key');
                $privKey     = $this->getProviderKey('imagekit', 'private_key');
                $urlEndpoint = $this->getProviderKey('imagekit', 'url_endpoint');

                if (!$pubKey || !$privKey || !$urlEndpoint) {
                    return response()->json(['success' => false, 'message' => 'ImageKit credentials not configured in dms_provider_keys table.'], 500);
                }

                $imageKit = new \ImageKit\ImageKit($pubKey, $privKey, $urlEndpoint);
                $upload = $imageKit->uploadFiles([
                    'file'     => base64_encode(file_get_contents($file->path())),
                    'fileName' => $randomName,
                    'folder'   => $folder,
                ]);
                $finalUrl = $upload->result->url;

            } else { // s3
                Storage::disk('s3')->putFileAs($folder, $file, $randomName, 'private');
                $finalUrl = $folder . '/' . $randomName;
            }

            $media = Media::create([
                'slug'        => $slug,
                'file_name'   => $randomName,
                'provider'    => $provider,
                'url'         => $finalUrl,
                'status'      => 1,
                'uploaded_at' => now(),
            ]);

            // Generate local proxy URL (served from our own API)
            $proxyUrl = url('/api/dms/media/' . $media->slug . '/' . $media->id);
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
            ->select('id', 'label', 'api_scope', 'is_active', 'created_at')
            ->orderByDesc('created_at')
            ->get();

        // NOTE: api_key value is intentionally excluded from listing for security
        return response()->json(['success' => true, 'data' => $keys]);
    }

    // ─── POST /api/dms/keys – create a new API key ────────
    public function createKey(Request $request)
    {
        $request->validate([
            'label'     => 'required|string|max:100',
            'api_scope' => 'required|in:upload,admin',
        ]);

        $newKey = 'dms_' . Str::random(48);

        $id = DB::table('dms_api_keys')->insertGetId([
            'label'      => $request->label,
            'api_key'    => $newKey,
            'api_scope'  => $request->api_scope,
            'is_active'  => 1,
            'created_at' => now(),
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'API key created. Store this key securely — it will not be shown again.',
            'id'        => $id,
            'api_key'   => $newKey, // Shown ONCE at creation only
            'api_scope' => $request->api_scope,
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
            ->select('id', 'provider', 'key_name', 'created_at')
            ->get();

        // Values are masked for security
        return response()->json(['success' => true, 'data' => $providers]);
    }

    // ─── POST /api/dms/providers – add/update provider key
    public function upsertProvider(Request $request)
    {
        $request->validate([
            'provider'  => 'required|in:imagekit,s3',
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
}
