<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$admin = DB::table('admins')->where('username', 'superadmin')->first();
$token = 'test_token_' . time();

if (!$admin) {
    echo "Superadmin not found.";
} else {
    DB::table('admins')->where('username', 'superadmin')->update(['api_token' => $token]);
    echo "Token generated: " . $token . "\n";
    
    // Now simulate backend call
    $response = file_get_contents('http://127.0.0.1:8000/api/admin/nav', false, stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => ['Authorization: Bearer ' . $token, 'Accept: application/json']
        ]
    ]));

    echo "API Response: \n" . $response . "\n";
}
