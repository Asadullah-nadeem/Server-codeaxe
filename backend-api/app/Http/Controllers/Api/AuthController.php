<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // ─── GET /api/auth/page/{type} ───────────
    public function pageConfig($type)
    {
        $page = DB::table('auth_pages')->where('page_type', $type)->where('is_active', 1)->first();
        if (!$page) {
            return response()->json(['success' => false, 'message' => 'Page configuration not found.'], 404);
        }
        return response()->json(['success' => true, 'data' => $page]);
    }

    // ─── POST /api/auth/signup ───────────────
    public function signup(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:100|unique:users',
            'email'    => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $apiToken = Str::random(60);

        $userId = DB::table('users')->insertGetId([
            'username'   => $request->username,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'api_token'  => $apiToken,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $tokenStr = Str::random(64);
        DB::table('verification_tokens')->insert([
            'email'      => $request->email,
            'token'      => $tokenStr,
            'created_at' => now(),
        ]);

        $template = DB::table('email_templates')
            ->where('template_key', 'email_verification')
            ->where('is_active', 1)
            ->first();

        $emailSent = false;
        if ($template) {
            // Use the environment NEXT_PUBLIC_API_URL or APP_URL to build verification link pointing to frontend /login
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            $verificationLink = "{$frontendUrl}/login?verify={$tokenStr}";

            try {
                Mail::to($request->email)->send(new VerifyEmail([
                    'username' => $request->username,
                    'email'    => $request->email,
                ], $verificationLink, $template));
                $emailSent = true;
            } catch (\Exception $e) {
                \Log::warning("Verification email failed for {$request->email}: " . $e->getMessage());
            }
        }

        return response()->json([
            'success'    => true,
            'message'    => 'Account created. Please check your email to verify your account.',
            'email_sent' => $emailSent
        ], 201);
    }

    // ─── GET /api/auth/verify ────────────────
    public function verify(Request $request)
    {
        $tokenStr = $request->query('token');
        if (!$tokenStr) {
            return response()->json(['success' => false, 'message' => 'Token is missing'], 400);
        }

        $tokenData = DB::table('verification_tokens')->where('token', $tokenStr)->first();
        if (!$tokenData) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired token.'], 400);
        }

        DB::table('users')->where('email', $tokenData->email)->update([
            'email_verified_at' => now(),
            'updated_at'        => now()
        ]);

        DB::table('verification_tokens')->where('token', $tokenStr)->delete();

        return response()->json(['success' => true, 'message' => 'Email verified successfully. You can now log in.']);
    }

    // ─── POST /api/auth/login ────────────────
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = DB::table('users')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials.'], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json(['success' => false, 'message' => 'Please verify your email before logging in.'], 403);
        }

        // Generate a new token on each login for security
        $apiToken = Str::random(60);
        DB::table('users')->where('id', $user->id)->update([
            'api_token' => $apiToken,
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully.',
            'data'    => [
                'id'       => $user->id,
                'username' => $user->username,
                'email'    => $user->email,
                'token'    => $apiToken,
            ]
        ]);
    }

    // ─── POST /api/auth/forgot-password ──────
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = DB::table('users')->where('email', $request->email)->first();
        if (!$user) {
            // Return success even if not found to prevent user enumeration
            return response()->json(['success' => true, 'message' => 'If your email is in our system, a password reset link has been sent.']);
        }

        $tokenStr = Str::random(64);
        
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $tokenStr, 'created_at' => now()]
        );

        $template = DB::table('email_templates')
            ->where('template_key', 'password_reset')
            ->where('is_active', 1)
            ->first();

        if ($template) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            $resetLink = "{$frontendUrl}/reset-password?token={$tokenStr}&email=" . urlencode($request->email);

            try {
                // Must add: use App\Mail\ResetPasswordEmail;
                Mail::to($request->email)->send(new \App\Mail\ResetPasswordEmail([
                    'username' => $user->username,
                    'email'    => $user->email,
                ], $resetLink, $template));
            } catch (\Exception $e) {
                \Log::warning("Reset password email failed for {$request->email}: " . $e->getMessage());
            }
        }

        return response()->json(['success' => true, 'message' => 'If your email is in our system, a password reset link has been sent.']);
    }

    // ─── POST /api/auth/reset-password ───────
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'token'    => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $reset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$reset) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired password reset link.'], 400);
        }

        DB::table('users')->where('email', $request->email)->update([
            'password' => Hash::make($request->password),
            'updated_at' => now()
        ]);

        // Delete token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['success' => true, 'message' => 'Password reset successfully. You can now log in.']);
    }
}
