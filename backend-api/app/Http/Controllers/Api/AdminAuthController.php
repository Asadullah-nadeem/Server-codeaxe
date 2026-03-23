<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    // ─── POST /api/admin/login ───────────────────
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = DB::table('admins')->where('username', $request->username)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials do not match our records.'
            ], 401);
        }

        if (!$admin->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is Suspended.'
            ], 403);
        }

        // Token generation
        $token = Str::random(80);
        DB::table('admins')->where('id', $admin->id)->update([
            'api_token' => $token,
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged in as administrator.',
            'data'    => [
                'id'       => $admin->id,
                'name'     => $admin->name,
                'username' => $admin->username,
                'role'     => $admin->role,
                'login_type' => $admin->login_type ?? 'password',
                'token'    => $token,
            ]
        ]);
    }

    // ─── GET /api/admin/profile ──────────────────
    public function profile(Request $request)
    {
        // $request->admin was attached by AdminAuthMiddleware
        $admin = $request->admin;
        return response()->json([
            'success' => true,
            'data'    => $admin
        ]);
    }

    // ─── GET /api/admin/auth/check (FOR SSO) ────────────────
    public function checkAuth(Request $request) {
        $admin = $request->admin;
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'username' => $admin->username,
                'role' => $admin->role,
                'login_type' => $admin->login_type ?? 'password',
                'token' => $admin->api_token
            ]
        ]);
    }

    // ─── POST /api/admin/logout ──────────────────
    public function logout(Request $request)
    {
        $admin = $request->admin;
        DB::table('admins')->where('id', $admin->id)->update([
            'api_token' => null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }

    // ─── Admin Management (Super Admin only check via role middleware) ─────
    public function listAdmins()
    {
        $admins = DB::table('admins')->select('id', 'name', 'username', 'email', 'role', 'is_active', 'created_at')->get();
        return response()->json(['success' => true, 'data' => $admins]);
    }

    public function createAdmin(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'username' => 'required|string|unique:admins,username',
            'email'    => 'required|email|unique:admins,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:superadmin,admin,demo',
            'is_active' => 'sometimes|integer|in:0,1',
        ]);

        DB::table('admins')->insert([
            'name'       => $request->name,
            'username'   => $request->username,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => $request->role,
            'is_active'  => $request->has('is_active') ? $request->is_active : 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Account created successfully.']);
    }

    public function updateAdmin(Request $request, $id)
    {
        $request->validate([
            'name'  => 'sometimes|string',
            'role'  => 'sometimes|in:superadmin,admin,demo',
            'is_active' => 'sometimes|integer|in:0,1'
        ]);

        DB::table('admins')->where('id', $id)->update(array_filter([
            'name' => $request->name,
            'role' => $request->role,
            'is_active' => $request->is_active,
            'updated_at' => now()
        ], function($v) { return !is_null($v); }));

        return response()->json(['success' => true, 'message' => 'Account updated.']);
    }

    public function deleteAdmin($id)
    {
        // Basic check to prevent deleting yourself
        if (request()->admin->id == $id) {
            return response()->json(['success' => false, 'message' => 'You cannot delete your own account.'], 403);
        }

        DB::table('admins')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Account removed.']);
    }

    public function registeredUsers()
    {
        $users = DB::table('users')
                    ->select('id', 'username', 'email', 'login_type', 'is_banned', 'email_verified_at', 'created_at', 'updated_at')
                    ->orderBy('created_at', 'desc')
                    ->get();
        foreach($users as $user) {
            $user->messages = DB::table('contact_submissions')
                                ->where('email', $user->email)
                                ->orderBy('submitted_at', 'desc')
                                ->get();
            $user->requests = DB::table('client_requests')
                                ->where('user_id', $user->id)
                                ->orderBy('created_at', 'desc')
                                ->get();
            $user->verification_tokens = DB::table('verification_tokens')
                                ->where('email', $user->email)
                                ->orderBy('created_at', 'desc')
                                ->get();
            $user->password_resets = DB::table('password_reset_tokens')
                                ->where('email', $user->email)
                                ->orderBy('created_at', 'desc')
                                ->get();
        }
        return response()->json(['success' => true, 'data' => $users]);
    }

    public function verifyUser($id)
    {
        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        DB::table('users')->where('id', $id)->update([
            'email_verified_at' => now(),
            'updated_at' => now()
        ]);

        // Clean up pending verification tokens
        DB::table('verification_tokens')->where('email', $user->email)->delete();

        return response()->json(['success' => true, 'message' => 'User address verified successfully.']);
    }

    public function toggleBanUser($id)
    {
        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $newStatus = $user->is_banned ? 0 : 1;
        DB::table('users')->where('id', $id)->update([
            'is_banned' => $newStatus,
            'updated_at' => now()
        ]);

        return response()->json(['success' => true, 'message' => $newStatus ? 'User has been restricted from logging in.' : 'User ban has been lifted.']);
    }

    public function createFrontendUser(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ]);

        if (DB::table('users')->where('email', $request->email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This email address is already in use by another user.'
            ], 400);
        }

        $id = DB::table('users')->insertGetId([
            'username' => $request->username,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'login_type' => 'password',
            'email_verified_at' => now(), // Pre-verify so they don't need email verification
            'is_banned' => 0,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['success' => true, 'message' => 'User created successfully without sending email.']);
    }
}
