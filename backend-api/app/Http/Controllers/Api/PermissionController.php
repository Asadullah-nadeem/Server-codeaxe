<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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

    // ─── GET /api/admin/permissions ───────────────────────────────────────────
    public function index()
    {
        try {
            $roles = DB::table('admin_roles')->get();
            $perms = DB::table('role_permissions')->get();

            $map = [];
            foreach ($roles as $role) {
                $map[$role->name] = [];
            }

            foreach ($perms as $p) {
                if (isset($map[$p->role])) {
                    $map[$p->role][$p->section_key] = [
                        'view'   => (bool) $p->can_view,
                        'create' => (bool) $p->can_create,
                        'edit'   => (bool) $p->can_edit,
                        'delete' => (bool) $p->can_delete,
                    ];
                }
            }

            // Fill empty sections with defaults
            foreach ($roles as $role) {
                $rName = $role->name;
                foreach (self::SECTION_KEYS as $key) {
                    if (!isset($map[$rName][$key])) {
                        $isUm = in_array($key, ['registered_users', 'admin_accounts', 'superadmin']);
                        // Super admin always has full defaults, Admin has full non-UM, others (demo) have view-only
                        $full = ($rName === 'superadmin' || ($rName === 'admin' && !$isUm));
                        $map[$rName][$key] = [
                            'view'   => $rName === 'superadmin' ? true : !$isUm,
                            'create' => $full,
                            'edit'   => $full,
                            'delete' => $full,
                        ];
                    }
                }
            }

            return response()->json(['success' => true, 'data' => $map, 'roles' => $roles]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /api/admin/permissions/bulk ────────────────────────────────────
    public function bulkUpsert(Request $request)
    {
        $request->validate([
            'role'        => 'required|string|exists:admin_roles,name',
            'permissions' => 'required|array',
        ]);

        try {
            foreach ($request->permissions as $sectionKey => $perm) {
                DB::table('role_permissions')->updateOrInsert(
                    ['role' => $request->role, 'section_key' => $sectionKey],
                    [
                        'can_view'   => !empty($perm['view'])   ? 1 : 0,
                        'can_create' => !empty($perm['create']) ? 1 : 0,
                        'can_edit'   => !empty($perm['edit'])   ? 1 : 0,
                        'can_delete' => !empty($perm['delete']) ? 1 : 0,
                        'updated_at' => now(),
                    ]
                );
            }
            return response()->json(['success' => true, 'message' => "Permissions for '{$request->role}' updated."]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /api/admin/permissions/reset ───────────────────────────────────
    public function reset(Request $request)
    {
        $request->validate(['role' => 'required|string|exists:admin_roles,name']);
        try {
            DB::table('role_permissions')->where('role', $request->role)->delete();
            return response()->json(['success' => true, 'message' => "Permissions for '{$request->role}' reset to defaults."]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── Custom Role Management ──────────────────────────────────────────────

    public function listRoles()
    {
        $roles = DB::table('admin_roles')->orderBy('id')->get();
        return response()->json(['success' => true, 'data' => $roles]);
    }

    public function upsertRole(Request $request)
    {
        $request->validate([
            'id'          => 'sometimes|nullable|integer',
            'name'        => 'required|string|max:50|unique:admin_roles,name,' . ($request->id ?? 'NULL'),
            'label'       => 'required|string|max:100',
            'color'       => 'required|string|max:20',
            'description' => 'nullable|string',
        ]);

        $payload = [
            'name'        => Str::slug($request->name),
            'label'       => $request->label,
            'color'       => $request->color,
            'description' => $request->description,
            'updated_at'  => now(),
        ];

        if ($request->id) {
            DB::table('admin_roles')->where('id', $request->id)->update($payload);
            $msg = "Role '{$request->label}' updated.";
        } else {
            $payload['created_at'] = now();
            DB::table('admin_roles')->insert($payload);
            $msg = "New role '{$request->label}' created.";
        }

        return response()->json(['success' => true, 'message' => $msg]);
    }

    public function deleteRole($id)
    {
        $role = DB::table('admin_roles')->where('id', $id)->first();
        if (!$role) return response()->json(['success' => false, 'message' => 'Role not found.'], 404);
        
        if (in_array($role->name, ['superadmin', 'admin', 'demo'])) {
            return response()->json(['success' => false, 'message' => 'System roles cannot be deleted.'], 403);
        }

        DB::transaction(function() use ($id, $role) {
            DB::table('role_permissions')->where('role', $role->name)->delete();
            DB::table('admin_roles')->where('id', $id)->delete();
            // Optional: Re-assign admins with this role to 'admin'? 
            // Or just let it break/handle manually. Better to block if users exist.
            $count = DB::table('admins')->where('role', $role->name)->count();
            if ($count > 0) {
                throw new \Exception("Cannot delete role: It is assigned to {$count} admin(s).");
            }
        });

        return response()->json(['success' => true, 'message' => "Role '{$role->label}' removed."]);
    }
}
