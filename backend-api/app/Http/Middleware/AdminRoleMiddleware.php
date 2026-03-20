<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminRoleMiddleware
{
    /**
     * Handle an incoming request.
     * Enforces 'superadmin' vs 'admin' restrictions.
     */
    public function handle(Request $request, Closure $next, string $role = 'superadmin')
    {
        $admin = $request->admin; // This was attached by AdminAuthMiddleware

        if (!$admin || $admin->role !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient authorization. Super Admin access only.'
            ], 403);
        }

        return $next($request);
    }
}
