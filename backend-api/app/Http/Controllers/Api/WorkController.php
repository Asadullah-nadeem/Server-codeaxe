<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class WorkController extends Controller
{
    public function index()
    {
        try {
            $header = DB::table('work_section_header')->first();

            $categories = DB::table('work_categories')
                ->orderBy('sort_order')
                ->get();

            $projects = DB::table('work_projects')->get()->map(function ($p) {
                $p->tags = json_decode($p->tags, true);
                return $p;
            });

            $categoriesWithProjects = $categories->map(function ($cat) use ($projects) {
                $cat->projects = $projects->where('category_id', $cat->id)->values();
                return $cat;
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'header'     => $header,
                    'categories' => $categoriesWithProjects,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
