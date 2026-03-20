<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DemoModeMiddleware
{
    /**
     * Blocks all modification requests for the 'demo' role.
     */
    public function handle(Request $request, Closure $next)
    {
        $admin = $request->admin; // Attached by AdminAuthMiddleware

        if ($admin && $admin->role === 'demo') {
            $method = $request->method();
            
            // Block all non-GET/HEAD/OPTIONS methods
            if (!in_array($method, ['GET', 'HEAD', 'OPTIONS'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Action denied. Demonstration account is in READ-ONLY mode.'
                ], 403);
            }
        }

        return $next($request);
    }
}
