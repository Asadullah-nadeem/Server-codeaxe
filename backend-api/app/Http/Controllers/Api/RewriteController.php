<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Request;

class RewriteController extends Controller
{
    /**
     * Admin Index - Return all rules with full data
     */
    public function index()
    {
        try {
            $rewrites = DB::table('route_rewrites')
                ->orderBy('sort_order')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $rewrites
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Public List - Return only active source/destination for Next.js
     */
    public function publicList()
    {
        try {
            $rewrites = DB::table('route_rewrites')
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get(['source', 'destination']);

            return response()->json([
                'success' => true,
                'data' => $rewrites
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'source' => 'required|string',
            'destination' => 'required|string',
        ]);
        $id = DB::table('route_rewrites')->insertGetId([
            'source' => $request->source,
            'destination' => $request->destination,
            'is_active' => $request->is_active ?? 1,
            'sort_order' => $request->sort_order ?? 0,
            'description' => $request->description,
        ]);
        return response()->json(['success' => true, 'id' => $id], 201);
    }

    public function update(Request $request, $id)
    {
        DB::table('route_rewrites')->where('id', $id)->update(
            $request->only('source', 'destination', 'is_active', 'sort_order', 'description')
        );
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        DB::table('route_rewrites')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
