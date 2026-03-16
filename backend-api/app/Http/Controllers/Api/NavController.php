<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NavController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mainItems = DB::table('nav_links')->where('type', 'main')->get();
        $portfolioItems = DB::table('nav_links')->where('type', 'portfolio')->get();
        $infoItems = DB::table('nav_links')->where('type', 'info')->get();

        $settingsRaw = DB::table('site_settings')
            ->where('setting_key', 'LIKE', 'nav_%')
            ->orWhere('setting_key', 'LIKE', 'site_name_%')
            ->orWhere('setting_key', 'LIKE', 'site_logo_%')
            ->get();
        $settings = [];
        foreach ($settingsRaw as $setting) {
            $settings[$setting->setting_key] = $setting->setting_value;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'mainItems' => $mainItems,
                'portfolioItems' => $portfolioItems,
                'infoItems' => $infoItems,
                'settings' => $settings
            ]
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'label' => 'required|string',
            'path' => 'required|string',
        ]);

        $id = DB::table('nav_links')->insertGetId([
            'type' => $request->type,
            'label' => $request->label,
            'path' => $request->path,
        ]);

        return response()->json(['success' => true, 'id' => $id], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $nav = DB::table('nav_links')->find($id);

        if (!$nav) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $nav], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|string',
            'label' => 'required|string',
            'path' => 'required|string',
        ]);

        $updated = DB::table('nav_links')->where('id', $id)->update([
            'type' => $request->type,
            'label' => $request->label,
            'path' => $request->path,
        ]);

        if (!$updated) {
            return response()->json(['success' => false, 'message' => 'Update failed or no changes'], 400);
        }

        return response()->json(['success' => true, 'message' => 'Updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $deleted = DB::table('nav_links')->where('id', $id)->delete();

        if (!$deleted) {
            return response()->json(['success' => false, 'message' => 'Delete failed'], 400);
        }

        return response()->json(['success' => true, 'message' => 'Deleted successfully'], 200);
    }
}
