<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // ─── GET /api/dashboard ──────────────────
    // Returns dashboard UI text config and the current user's requests
    public function index(Request $request)
    {
        $user = $request->user; // Set by AuthUserMiddleware

        $ui = DB::table('dashboard_ui')->where('page_key', 'dashboard')->first();
        
        $requests = DB::table('client_requests')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'ui' => $ui,
                'requests' => $requests,
            ]
        ]);
    }

    // ─── GET /api/dashboard/request/ui ───────
    public function requestUi()
    {
        $ui = DB::table('dashboard_ui')->where('page_key', 'send-request')->first();
        return response()->json(['success' => true, 'data' => $ui]);
    }

    // ─── POST /api/dashboard/request ─────────
    public function storeRequest(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'service_type' => 'required|string|max:100',
            'budget'       => 'nullable|string|max:100',
            'description'  => 'required|string',
        ]);

        $user = $request->user;

        $id = DB::table('client_requests')->insertGetId([
            'user_id'      => $user->id,
            'title'        => $request->title,
            'service_type' => $request->service_type,
            'budget'       => $request->budget,
            'description'  => $request->description,
            'status'       => 'pending',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request submitted successfully. Our team will review it shortly.',
            'id' => $id
        ], 201);
    }
}
