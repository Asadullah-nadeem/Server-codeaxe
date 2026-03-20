<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServicesController extends Controller
{
    public function index()
    {
        try {
            $header = DB::table('services_page_header')->first();

            $services = DB::table('services_list')
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get()
                ->map(function ($s) {
                    $s->points = json_decode($s->points, true);
                    return $s;
                });

            $cta = DB::table('services_cta')->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'header'   => $header,
                    'services' => $services,
                    'cta'      => $cta,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'sort_index'  => 'required|string',
            'title'       => 'required|string',
            'description' => 'required|string',
            'points'      => 'required|array',
        ]);
        $id = DB::table('services_list')->insertGetId([
            'sort_index'  => $request->sort_index,
            'title'       => $request->title,
            'description' => $request->description,
            'points'      => json_encode($request->points),
            'is_active'   => $request->is_active ?? 1,
            'sort_order'  => $request->sort_order ?? 0,
        ]);
        return response()->json(['success' => true, 'id' => $id], 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->only('sort_index', 'title', 'description', 'is_active', 'sort_order');
        if ($request->has('points')) {
            $data['points'] = json_encode($request->points);
        }
        DB::table('services_list')->where('id', $id)->update($data);
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        DB::table('services_list')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
