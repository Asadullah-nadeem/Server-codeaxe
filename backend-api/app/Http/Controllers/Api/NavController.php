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
            ->orWhere('setting_key', 'LIKE', 'seo_%')
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
            'icon' => $request->icon,
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
            'icon' => $request->icon,
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

    /**
     * Update global nav and SEO settings
     */
    public function updateSettings(Request $request)
    {
        $settings = $request->only([
            'nav_portfolio_label',
            'nav_info_label',
            'nav_btn_send_request',
            'nav_btn_dashboard',
            'nav_btn_login',
            'nav_btn_signup',
            'nav_btn_profile',
            'seo_title',
            'seo_description',
            'site_name_prefix',
            'site_name_accent',
            'site_logo_url'
        ]);

        foreach ($settings as $key => $value) {
            DB::table('site_settings')->updateOrInsert(
                ['setting_key' => $key],
                ['setting_value' => $value ?? '']
            );
        }

        return response()->json(['success' => true]);
    }
}
