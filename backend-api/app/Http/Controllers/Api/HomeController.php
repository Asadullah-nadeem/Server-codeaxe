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

            $settingsRaw = DB::table('site_settings')
                ->where('setting_key', 'LIKE', 'home_%')
                ->orWhere('setting_key', 'LIKE', 'site_founder_%')
                ->get();
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

    // --- CRUD for Services ---
    public function storeService(Request $request) {
        $data = $request->validate(['index_number' => 'required|string', 'title' => 'required|string', 'description' => 'required|string', 'icon' => 'required|string']);
        $id = DB::table('home_services')->insertGetId($data);
        return response()->json(['success' => true, 'id' => $id], 201);
    }
    public function updateService(Request $request, $id) {
        DB::table('home_services')->where('id', $id)->update($request->only('index_number', 'title', 'description', 'icon'));
        return response()->json(['success' => true]);
    }
    public function destroyService($id) {
        DB::table('home_services')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- CRUD for Projects ---
    public function storeProject(Request $request) {
        $data = $request->validate(['title' => 'required|string', 'description' => 'required|string', 'year' => 'required|string', 'tags' => 'required|array', 'image_url' => 'nullable|string', 'project_url' => 'nullable|string']);
        $data['tags'] = json_encode($data['tags']);
        $id = DB::table('home_projects')->insertGetId($data);
        return response()->json(['success' => true, 'id' => $id], 201);
    }
    public function updateProject(Request $request, $id) {
        $data = $request->only('title', 'description', 'year', 'image_url', 'project_url');
        if ($request->has('tags')) $data['tags'] = json_encode($request->tags);
        DB::table('home_projects')->where('id', $id)->update($data);
        return response()->json(['success' => true]);
    }
    public function destroyProject($id) {
        DB::table('home_projects')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- CRUD for Stats ---
    public function storeStat(Request $request) {
        $data = $request->validate(['value' => 'required|string', 'label' => 'required|string']);
        $id = DB::table('home_stats')->insertGetId($data);
        return response()->json(['success' => true, 'id' => $id], 201);
    }
    public function updateStat(Request $request, $id) {
        DB::table('home_stats')->where('id', $id)->update($request->only('value', 'label'));
        return response()->json(['success' => true]);
    }
    public function destroyStat($id) {
        DB::table('home_stats')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Update Hero ---
    public function updateHero(Request $request) {
        $data = $request->validate(['badge' => 'required|string', 'title' => 'required|string', 'description' => 'required|string']);
        $exists = DB::table('home_hero')->first();
        if ($exists) {
            DB::table('home_hero')->where('id', $exists->id)->update($data);
        } else {
            DB::table('home_hero')->insert($data);
        }
        return response()->json(['success' => true]);
    }

    // --- Update Section Headers ---
    public function updateSectionHeader(Request $request, $key) {
        $data = $request->only('section_index', 'label', 'title', 'description');
        DB::table('home_section_headers')->where('section_key', $key)->update($data);
        return response()->json(['success' => true]);
    }

    // --- Update CTA ---
    public function updateCta(Request $request) {
        $data = $request->validate([
            'badge' => 'required|string', 
            'title' => 'required|string', 
            'description' => 'required|string',
            'button_label' => 'required|string',
            'button_link' => 'required|string'
        ]);
        $exists = DB::table('home_cta')->first();
        if ($exists) {
            DB::table('home_cta')->where('id', $exists->id)->update($data);
        } else {
            DB::table('home_cta')->insert($data);
        }
        return response()->json(['success' => true]);
    }

    // --- CRUD for Principles ---
    public function storePrinciple(Request $request) {
        $data = $request->validate(['title' => 'required|string', 'description' => 'required|string', 'icon' => 'required|string']);
        $id = DB::table('home_principles')->insertGetId($data);
        return response()->json(['success' => true, 'id' => $id], 201);
    }
    public function updatePrinciple(Request $request, $id) {
        DB::table('home_principles')->where('id', $id)->update($request->only('title', 'description', 'icon'));
        return response()->json(['success' => true]);
    }
    public function destroyPrinciple($id) {
        DB::table('home_principles')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- CRUD for Technologies ---
    public function storeTechnology(Request $request) {
        $data = $request->validate(['name' => 'required|string', 'src' => 'required|string']);
        $id = DB::table('home_technologies')->insertGetId($data);
        return response()->json(['success' => true, 'id' => $id], 201);
    }
    public function updateTechnology(Request $request, $id) {
        DB::table('home_technologies')->where('id', $id)->update($request->only('name', 'src'));
        return response()->json(['success' => true]);
    }
    public function destroyTechnology($id) {
        DB::table('home_technologies')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- CRUD for System Status ---
    public function storeSystemStatus(Request $request) {
        $data = $request->validate(['label' => 'required|string', 'status' => 'required|string', 'ping' => 'required|string']);
        $id = DB::table('home_system_status')->insertGetId($data);
        return response()->json(['success' => true, 'id' => $id], 201);
    }
    public function updateSystemStatus(Request $request, $id) {
        DB::table('home_system_status')->where('id', $id)->update($request->only('label', 'status', 'ping'));
        return response()->json(['success' => true]);
    }
    public function destroySystemStatus($id) {
        DB::table('home_system_status')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- CRUD for Partners ---
    public function storePartner(Request $request) {
        $data = $request->validate(['name' => 'required|string', 'src' => 'required|string']);
        $id = DB::table('home_partners')->insertGetId($data);
        return response()->json(['success' => true, 'id' => $id], 201);
    }
    public function updatePartner(Request $request, $id) {
        DB::table('home_partners')->where('id', $id)->update($request->only('name', 'src'));
        return response()->json(['success' => true]);
    }
    public function destroyPartner($id) {
        DB::table('home_partners')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
