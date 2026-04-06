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

        // High Level Security DB Tracking - Log Failed Attempt
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            DB::table('admin_security_logs')->insert([
                'email' => $request->username, // Using username since they failed
                'action' => 'login_failed',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

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

        // High Level Security DB Tracking - Log Success
        DB::table('admin_security_logs')->insert([
            'email' => $admin->email,
            'action' => 'login_success',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged in as administrator.',
            'data'    => [
                'id'       => $admin->id,
                'name'     => $admin->name,
                'username' => $admin->username,
                'email'    => $admin->email,
                'role'     => $admin->role,
                'login_type' => $admin->login_type ?? 'password',
                'token'    => $token,
            ]
        ]);
    }

    // ─── POST /api/admin/forget-password ─────────
    public function forgetPassword(Request $request) {
        $request->validate([
            'email' => 'required|email'
        ]);

        $admin = DB::table('admins')->where('email', $request->email)->first();

        // High Level Security DB Tracking - Log Reset Request
        DB::table('admin_security_logs')->insert([
            'email' => $request->email,
            'action' => 'password_reset_request',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($admin) {
            $token = Str::random(60);
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => Hash::make($token),
                    'created_at' => now()
                ]
            );
        }

        // Return a generic success to prevent email enumeration (OWASP Best Practice)
        return response()->json([
            'success' => true,
            'message' => 'If your email is registered, authorization keys have been dispatched via a secure channel.'
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

    // ─── PUT/POST /api/admin/profile/update ───────
    public function updateProfile(Request $request) {
        $admin = $request->admin;
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:admins,username,' . $admin->id,
            'email' => 'sometimes|email|unique:admins,email,' . $admin->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        $updateData = [];
        if($request->has('name')) $updateData['name'] = $request->name;
        if($request->has('username')) $updateData['username'] = $request->username;
        if($request->has('email')) $updateData['email'] = $request->email;
        if($request->has('photo')) $updateData['photo'] = $request->photo;
        if($request->has('password')) $updateData['password'] = Hash::make($request->password);
        
        if(empty($updateData)) {
            return response()->json([
                'success' => true,
                'message' => 'No changes provided.'
            ]);
        }

        $updateData['updated_at'] = now();

        DB::table('admins')->where('id', $admin->id)->update($updateData);

        // Fetch updated admin
        $updatedAdmin = DB::table('admins')->where('id', $admin->id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'data' => $updatedAdmin
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
                'email' => $admin->email,
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
        $admins = DB::table('admins')->select('id', 'name', 'username', 'email', 'photo', 'role', 'is_active', 'created_at')->get();
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
            'name'     => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:admins,username,' . $id,
            'email'    => 'sometimes|email|unique:admins,email,' . $id,
            'password' => 'sometimes|string|min:8',
            'role'     => 'sometimes|in:superadmin,admin,demo',
            'is_active'=> 'sometimes|integer|in:0,1'
        ]);

        // Guard: Prevent removing the last superadmin
        if ($request->has('role') && $request->role !== 'superadmin') {
            $target = DB::table('admins')->where('id', $id)->first();
            if ($target && $target->role === 'superadmin') {
                $superadminCount = DB::table('admins')->where('role', 'superadmin')->count();
                if ($superadminCount <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot demote the last Super Admin account.'
                    ], 403);
                }
            }
        }

        $update = ['updated_at' => now()];
        if ($request->has('name'))      $update['name']     = $request->name;
        if ($request->has('username'))  $update['username'] = $request->username;
        if ($request->has('email'))     $update['email']    = $request->email;
        if ($request->has('photo'))     $update['photo']    = $request->photo;
        if ($request->has('password'))  $update['password'] = Hash::make($request->password);
        if ($request->has('role'))      $update['role']     = $request->role;
        if ($request->has('is_active')) $update['is_active']= $request->is_active;

        DB::table('admins')->where('id', $id)->update($update);

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
