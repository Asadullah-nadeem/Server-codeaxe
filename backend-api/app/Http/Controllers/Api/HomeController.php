<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Display a listing of the home resource.
     */
    public function index()
    {
        try {
            $services = DB::table('home_services')->get();
            
            $projects = DB::table('home_projects')->get()->map(function ($project) {
                $project->tags = json_decode($project->tags, true);
                return $project;
            });

            $stats = DB::table('home_stats')->get();

            // Additional Sections currently hardcoded in frontend
            $principles = DB::table('home_principles')->get();
            $technologies = DB::table('home_technologies')->get();
            $system_status = DB::table('home_system_status')->get();
            $partners = DB::table('home_partners')->get();
            $hero = DB::table('home_hero')->first();
            $cta = DB::table('home_cta')->first();
            $section_headers_raw = DB::table('home_section_headers')->get();
            $section_headers = [];
            foreach ($section_headers_raw as $header) {
                $section_headers[$header->section_key] = $header;
            }

            $settingsRaw = DB::table('site_settings')->where('setting_key', 'LIKE', 'home_%')->get();
            $settings = [];
            foreach ($settingsRaw as $setting) {
                $settings[$setting->setting_key] = $setting->setting_value;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'services' => $services,
                    'projects' => $projects,
                    'stats' => $stats,
                    'principles' => $principles,
                    'technologies' => $technologies,
                    'system_status' => $system_status,
                    'partners' => $partners,
                    'hero' => $hero,
                    'cta' => $cta,
                    'section_headers' => $section_headers,
                    'settings' => $settings,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Example CRUD for services
    public function storeService(Request $request)
    {
        $request->validate([
            'index_number' => 'required|string',
            'title' => 'required|string',
            'description' => 'required|string',
            'icon' => 'required|string',
        ]);

        $id = DB::table('home_services')->insertGetId($request->only('index_number', 'title', 'description', 'icon'));
        return response()->json(['success' => true, 'id' => $id], 201);
    }

    public function updateService(Request $request, $id)
    {
        $updated = DB::table('home_services')->where('id', $id)->update($request->only('index_number', 'title', 'description', 'icon'));
        return response()->json(['success' => (bool)$updated]);
    }

    public function destroyService($id)
    {
        $deleted = DB::table('home_services')->where('id', $id)->delete();
        return response()->json(['success' => (bool)$deleted]);
    }
}
