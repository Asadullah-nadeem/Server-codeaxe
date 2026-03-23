<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    // ─── All known section keys ──────────────────────────────────────────────
    private const SECTION_KEYS = [
        'navigation', 'home', 'footer', 'services', 'portfolio',
        'about', 'legal', 'sections', 'rewrites',
        'contact', 'emails', 'smtp', 'chat',
        'media', 'dms',
        'registered_users', 'admin_accounts', 'superadmin',
    ];

    // ─── GET /admin/permissions ──────────────────────────────────────────────
    // Returns a structured map: { admin: { section_key: {view,create,edit,delete} }, demo: {...} }
    public function index()
    {
        try {
            $rows = DB::table('role_permissions')
                ->whereIn('role', ['admin', 'demo'])
                ->get();

            $map = ['admin' => [], 'demo' => []];

            foreach ($rows as $row) {
                $map[$row->role][$row->section_key] = [
                    'view'   => (bool) $row->can_view,
                    'create' => (bool) $row->can_create,
                    'edit'   => (bool) $row->can_edit,
                    'delete' => (bool) $row->can_delete,
                ];
            }

            // Fill in defaults for any missing keys (view=true for admin/demo, rest=false)
            foreach (['admin', 'demo'] as $role) {
                foreach (self::SECTION_KEYS as $key) {
                    if (!isset($map[$role][$key])) {
                        // Determine sensible defaults: user_management sections default to 0
                        $isUmSection = in_array($key, ['registered_users', 'admin_accounts', 'superadmin']);
                        $map[$role][$key] = [
                            'view'   => !$isUmSection,
                            'create' => $role === 'admin' && !$isUmSection,
                            'edit'   => $role === 'admin' && !$isUmSection,
                            'delete' => $role === 'admin' && !$isUmSection,
                        ];
                    }
                }
            }

            return response()->json(['success' => true, 'data' => $map]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /admin/permissions ─────────────────────────────────────────────
    // Upsert a single section permission for a role.
    // Body: { role, section_key, can_view, can_create, can_edit, can_delete }
    public function upsert(Request $request)
    {
        $request->validate([
            'role'        => 'required|in:admin,demo',
            'section_key' => 'required|string|max:100',
            'can_view'    => 'required|boolean',
            'can_create'  => 'required|boolean',
            'can_edit'    => 'required|boolean',
            'can_delete'  => 'required|boolean',
        ]);

        try {
            $existing = DB::table('role_permissions')
                ->where('role', $request->role)
                ->where('section_key', $request->section_key)
                ->first();

            $payload = [
                'can_view'   => $request->can_view   ? 1 : 0,
                'can_create' => $request->can_create ? 1 : 0,
                'can_edit'   => $request->can_edit   ? 1 : 0,
                'can_delete' => $request->can_delete ? 1 : 0,
                'updated_at' => now(),
            ];

            if ($existing) {
                DB::table('role_permissions')
                    ->where('id', $existing->id)
                    ->update($payload);
            } else {
                DB::table('role_permissions')->insert(array_merge([
                    'role'        => $request->role,
                    'section_key' => $request->section_key,
                    'created_at'  => now(),
                ], $payload));
            }

            return response()->json(['success' => true, 'message' => 'Permission updated.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /admin/permissions/bulk ────────────────────────────────────────
    // Save all permissions for a role at once.
    // Body: { role, permissions: { section_key: { view, create, edit, delete }, ... } }
    public function bulkUpsert(Request $request)
    {
        $request->validate([
            'role'        => 'required|in:admin,demo',
            'permissions' => 'required|array',
        ]);

        try {
            foreach ($request->permissions as $sectionKey => $perm) {
                $payload = [
                    'can_view'   => !empty($perm['view'])   ? 1 : 0,
                    'can_create' => !empty($perm['create']) ? 1 : 0,
                    'can_edit'   => !empty($perm['edit'])   ? 1 : 0,
                    'can_delete' => !empty($perm['delete']) ? 1 : 0,
                    'updated_at' => now(),
                ];

                $exists = DB::table('role_permissions')
                    ->where('role', $request->role)
                    ->where('section_key', $sectionKey)
                    ->exists();

                if ($exists) {
                    DB::table('role_permissions')
                        ->where('role', $request->role)
                        ->where('section_key', $sectionKey)
                        ->update($payload);
                } else {
                    DB::table('role_permissions')->insert(array_merge([
                        'role'        => $request->role,
                        'section_key' => $sectionKey,
                        'created_at'  => now(),
                    ], $payload));
                }
            }

            return response()->json(['success' => true, 'message' => 'All permissions saved.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /admin/permissions/reset ──────────────────────────────────────
    // Resets a role's permissions back to system defaults.
    public function reset(Request $request)
    {
        $request->validate(['role' => 'required|in:admin,demo']);

        try {
            DB::table('role_permissions')->where('role', $request->role)->delete();
            return response()->json(['success' => true, 'message' => "Permissions for '{$request->role}' reset to defaults."]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
