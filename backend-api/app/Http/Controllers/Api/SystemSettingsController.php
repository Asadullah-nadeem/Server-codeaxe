<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SystemSettingsController extends Controller
{
    /**
     * Get all connection settings and system status.
     */
    public function index()
    {
        $settings = DB::table('site_settings')
            ->whereIn('setting_key', [
                'api_url', 
                'app_key', 
                'frontend_url', 
                'admin_url',
                'image_proxy_enabled',
                'image_base_url',
                'db_host',
                'db_database'
            ])
            ->pluck('setting_value', 'setting_key');

        // Add defaults if missing
        $currentHost = request()->getSchemeAndHttpHost();
        $defaults = [
            'api_url' => env('APP_URL', $currentHost) . '/api',
            'app_key' => env('APP_KEY'),
            'frontend_url' => env('FRONTEND_URL', $currentHost . ':3000'),
            'admin_url' => env('ADMIN_URL', $currentHost . ':3001'),
            'image_proxy_enabled' => '1',
            'image_base_url' => env('APP_URL', $currentHost) . '/api/dms/media',
            'db_host' => env('DB_HOST', 'localhost'),
            'db_database' => env('DB_DATABASE', config('database.connections.' . config('database.default') . '.database')),
        ];

        $data = array_merge($defaults, $settings->toArray());

        return response()->json([
            'success' => true,
            'data' => $data,
            'status' => [
                'database' => $this->checkDatabaseConnection(),
                'api' => 'Online',
                'env' => app()->environment(),
            ]
        ]);
    }

    /**
     * Update connection settings.
     */
    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            DB::table('site_settings')->updateOrInsert(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'System settings updated successfully.'
        ]);
    }

    /**
     * Check if database is connected.
     */
    private function checkDatabaseConnection()
    {
        try {
            DB::connection()->getPdo();
            return 'Connected';
        } catch (\Exception $e) {
            return 'Disconnected: ' . $e->getMessage();
        }
    }
}
