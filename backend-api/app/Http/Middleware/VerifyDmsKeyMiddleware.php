<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VerifyDmsKeyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $dmsKey = $request->header('X-DMS-Key');

        if (!$dmsKey) {
            return response()->json(['success' => false, 'message' => 'DMS API key is required. Please provide X-DMS-Key header.'], 401);
        }

        $keyRecord = DB::table('dms_api_keys')
            ->where('api_key', $dmsKey)
            ->where('is_active', 1)
            ->first();

        if (!$keyRecord) {
            return response()->json(['success' => false, 'message' => 'Invalid or revoked DMS API key.'], 403);
        }

        // Attach key metadata to the request for the controller to use
        $request->attributes->set('dms_key_label', $keyRecord->label);
        $request->attributes->set('dms_key_scope', $keyRecord->api_scope);
        $request->attributes->set('dms_key_provider', $keyRecord->provider);

        return $next($request);
    }
}
