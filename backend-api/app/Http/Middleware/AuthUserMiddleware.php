<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthUserMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['success' => false, 'message' => 'Unauthorized: Missing API token.'], 401);
        }

        $user = DB::table('users')->where('api_token', $token)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized: Invalid API token.'], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json(['success' => false, 'message' => 'Unauthorized: Email not verified.'], 403);
        }

        // Attach user object to the request so controllers can use $request->user
        $request->user = $user;

        return $next($request);
    }
}
