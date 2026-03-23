<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SectionController extends Controller
{
    /**
     * GET /admin/sections
     * Returns all section visibility settings.
     */
    public function index()
    {
        try {
            $sections = DB::table('section_visibility')
                ->orderBy('section_key')
                ->get();

            return response()->json([
                'success' => true,
                'data'    => $sections,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /admin/sections
     * Upsert a section visibility record (insert or update by section_key).
     */
    public function upsert(Request $request)
    {
        $request->validate([
            'section_key' => 'required|string|max:100',
            'is_enabled'  => 'required|boolean',
        ]);

        try {
            $existing = DB::table('section_visibility')
                ->where('section_key', $request->section_key)
                ->first();

            $payload = [
                'is_enabled'   => $request->is_enabled ? 1 : 0,
                'custom_label' => $request->custom_label ?? null,
                'custom_desc'  => $request->custom_desc  ?? null,
                'updated_at'   => now(),
            ];

            if ($existing) {
                DB::table('section_visibility')
                    ->where('section_key', $request->section_key)
                    ->update($payload);
                $id = $existing->id;
            } else {
                $id = DB::table('section_visibility')->insertGetId(array_merge(
                    ['section_key' => $request->section_key, 'created_at' => now()],
                    $payload
                ));
            }

            return response()->json([
                'success' => true,
                'id'      => $id,
                'message' => 'Section visibility updated.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /sections  (public — for frontend to check which sections are visible)
     */
    public function publicIndex()
    {
        try {
            $sections = DB::table('section_visibility')
                ->get(['section_key', 'is_enabled']);

            // Build a simple key => bool map
            $map = [];
            foreach ($sections as $s) {
                $map[$s->section_key] = (bool) $s->is_enabled;
            }

            return response()->json([
                'success' => true,
                'data'    => $map,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
