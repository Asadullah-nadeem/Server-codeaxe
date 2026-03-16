<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyAppKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $appKey = env('APP_KEY');
        $headerKey = $request->header('X-API-KEY');

        if (!$headerKey || $headerKey !== $appKey) {
            return response()->json([
                'success' => false, 
                'message' => 'Unauthorized Access. Invalid Security Key.'
            ], 401);
        }

        return $next($request);
    }
}
