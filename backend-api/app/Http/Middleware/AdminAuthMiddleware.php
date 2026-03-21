<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAuthMiddleware
{
    /**
     * Handle an incoming request.
     * Requires Bearer token or X-Admin-Token header.
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken() ?: $request->header('X-Admin-Token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin token required in header.'
            ], 401);
        }

        $admin = DB::table('admins')
            ->where('api_token', $token)
            ->where('is_active', 1)
            ->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Your administrator session is invalid or has expired.'
            ], 401);
        }

        // Attach admin object to request for downstream access
        $request->admin = $admin;

        return $next($request);
    }
}
