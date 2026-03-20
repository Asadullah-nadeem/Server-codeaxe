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
                'message' => 'Your account is disabled. Please contact the super admin.'
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
        ]);

        DB::table('admins')->insert([
            'name'       => $request->name,
            'username'   => $request->username,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => $request->role,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Account created successfully.']);
    }

    public function updateAdmin(Request $request, $id)
    {
        $request->validate([
            'name'  => 'sometimes|string',
            'role'  => 'sometimes|in:superadmin,admin',
            'is_active' => 'sometimes|boolean'
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
}
