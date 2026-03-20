<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * DMS API Key middleware.
 * Keys are stored securely in the `dms_api_keys` MySQL table.
 *
 * Usage: Pass header  X-DMS-Key: <key>
 * For admin-only routes, pass $scope = 'admin' to handle() via route binding.
 */
class DmsApiKeyMiddleware
{
    public function handle(Request $request, Closure $next, string $scope = 'upload')
    {
        $key = $request->header('X-DMS-Key');

        if (!$key) {
            return response()->json([
                'success' => false,
                'message' => 'DMS API key is required. Please provide X-DMS-Key header.',
            ], 401);
        }

        $record = DB::table('dms_api_keys')
            ->where('api_key', $key)
            ->where('is_active', 1)
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or inactive DMS API key.',
            ], 403);
        }

        // If route requires 'admin' scope, check it
        if ($scope === 'admin' && $record->api_scope !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Admin key required.',
            ], 403);
        }

        // Attach DMS key record to request for downstream use
        $request->merge(['_dms_key' => $record]);

        return $next($request);
    }
}
