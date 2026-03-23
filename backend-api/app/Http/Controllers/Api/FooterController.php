<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FooterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sections = DB::table('footer_sections')->get();
        $links = DB::table('footer_links')->get();

        $footerData = [];
        foreach ($sections as $section) {
            $sectionLinks = $links->where('section_id', $section->id)->values();
            $footerData[] = [
                'id' => $section->id,
                'title' => $section->title,
                'type' => $section->type,
                'links' => $sectionLinks
            ];
        }

        $settingsRaw = DB::table('site_settings')
            ->where('setting_key', 'LIKE', 'footer_%')
            ->orWhere('setting_key', 'LIKE', 'site_name_%')
            ->orWhere('setting_key', 'LIKE', 'site_logo_%')
            ->orWhere('setting_key', 'LIKE', 'seo_%')
            ->orWhere('setting_key', 'LIKE', 'site_founder_%')
            ->get();
        $settings = [];
        foreach ($settingsRaw as $setting) {
            $settings[$setting->setting_key] = $setting->setting_value;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'sections' => $footerData,
                'settings' => $settings
            ]
        ], 200);
    }

    /**
     * Store a newly created link.
     */
    public function storeLink(Request $request)
    {
        $request->validate([
            'section_id' => 'required|integer',
            'label' => 'required|string',
            'url' => 'required|string',
        ]);

        $id = DB::table('footer_links')->insertGetId([
            'section_id' => $request->section_id,
            'label' => $request->label,
            'url' => $request->url,
            'is_external' => $request->is_external ?? false,
            'icon' => $request->icon
        ]);

        return response()->json(['success' => true, 'id' => $id], 201);
    }

    /**
     * Update a link.
     */
    public function updateLink(Request $request, $id)
    {
        $updated = DB::table('footer_links')->where('id', $id)->update($request->only('label', 'url', 'is_external', 'section_id', 'icon'));
        return response()->json(['success' => (bool)$updated]);
    }

    /**
     * Remove a link.
     */
    public function destroyLink($id)
    {
        $deleted = DB::table('footer_links')->where('id', $id)->delete();
        return response()->json(['success' => (bool)$deleted]);
    }

    /**
     * Update global footer settings.
     */
    public function updateSettings(Request $request)
    {
        $settings = $request->only([
            'footer_title', 
            'footer_subtitle', 
            'footer_contact_email', 
            'footer_contact_phone', 
            'footer_copyright',
            'site_logo_url',
            'site_name_prefix',
            'site_name_accent',
            'footer_is_visible',
            'seo_title',
            'seo_description',
            'seo_google_analytics_id',
            'seo_google_search_console_id',
            'site_founder_name',
            'site_founder_message'
        ]);

        foreach ($settings as $key => $value) {
            DB::table('site_settings')
                ->updateOrInsert(
                    ['setting_key' => $key],
                    ['setting_value' => $value ?? '']
                );
        }

        return response()->json(['success' => true]);
    }
}
