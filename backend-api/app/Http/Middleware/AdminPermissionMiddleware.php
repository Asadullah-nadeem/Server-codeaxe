<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\DB;

class AdminPermissionMiddleware
{
    public function handle(Request $request, Closure $next, $section = null, $action = 'view'): Response
    {
        $admin = $request->admin; // Attached by AdminAuthMiddleware
        if (!$admin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized Identity'], 401);
        }

        if ($admin->role === 'superadmin') {
            return $next($request);
        }

        if (!$section) {
            $segments = $request->segments();
            if (isset($segments[1]) && $segments[1] === 'admin' && isset($segments[2])) {
                $section = $segments[2];
                // Map routes to Matrix keys
                $map = [
                    'active-chats' => 'chat',
                    'registered-users' => 'registered_users',
                    'developer-keys' => 'superadmin',
                    'dms-settings' => 'dms',
                    'system' => 'superadmin',
                    'nav' => 'navigation',
                    'footer' => 'footer',
                    'home' => 'home',
                    'rewrites' => 'rewrites',
                    'services' => 'services',
                    'portfolio' => 'portfolio',
                    'work' => 'portfolio', // mapped to portfolio per dashboard
                    'pages' => isset($segments[3]) ? $segments[3] : 'about', // e.g., pages/about -> about, pages/legal -> legal
                    'dms' => 'dms',
                    'contact' => 'contact',
                    'chat' => 'chat',
                    'email' => 'emails',
                    'smtp' => 'smtp',
                    'sections' => 'sections'
                ];

                // Exempt universally accessible routes
                if (in_array($section, ['profile', 'auth', 'logout', 'login', 'forget-password'])) {
                    return $next($request);
                }

                if (isset($map[$section])) {
                    $section = $map[$section];
                }
            } else {
                return $next($request);
            }
        }

        if (!$action) {
            $method = $request->method();
            $action = 'view';
            if ($method === 'POST') $action = 'create';
            if ($method === 'PUT' || $method === 'PATCH') $action = 'edit';
            if ($method === 'DELETE') $action = 'delete';
        }

        if ($section) {
            $perm = DB::table('role_permissions')->where('role', $admin->role)->where('section_key', $section)->first();
            
            if (!$perm) {
                // Return generic access denied if section not found in policy matrix
                return response()->json(['success' => false, 'message' => "Access Denied: Unmapped section ($section)."], 403);
            }

            $hasAccess = false;
            switch ($action) {
                case 'view':   $hasAccess = $perm->can_view; break;
                case 'create': $hasAccess = $perm->can_create; break;
                case 'edit':   $hasAccess = $perm->can_edit; break;
                case 'delete': $hasAccess = $perm->can_delete; break;
            }

            if (!$hasAccess) {
                return response()->json(['success' => false, 'message' => "Restricted: You do not have '{$action}' permissions for '{$section}'."], 403);
            }
        }

        return $next($request);
    }
}
