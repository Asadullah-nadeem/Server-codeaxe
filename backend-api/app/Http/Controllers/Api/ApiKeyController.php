<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ApiKeyController extends Controller
{
    public function index()
    {
        $keys = DB::table('api_keys')->orderBy('id', 'desc')->get();
        // Decode JSON permissions
        $keys->transform(function($key) {
            $key->permissions = json_decode($key->permissions, true) ?: [];
            return $key;
        });

        return response()->json(['success' => true, 'data' => $keys]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array'
        ]);

        $token = 'dms_live_' . Str::random(32);

        $id = DB::table('api_keys')->insertGetId([
            'name' => $request->name,
            'token' => $token,
            'permissions' => json_encode($request->permissions),
            'clicks' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $newKey = DB::table('api_keys')->where('id', $id)->first();
        $newKey->permissions = json_decode($newKey->permissions, true);

        return response()->json(['success' => true, 'data' => $newKey]);
    }

    public function destroy($id)
    {
        DB::table('api_keys')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
