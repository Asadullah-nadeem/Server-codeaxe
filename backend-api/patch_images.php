<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$sql = file_get_contents(__DIR__ . '/sql/schema_images.sql');
$statements = array_filter(array_map('trim', explode(';', $sql)));
$count = 0;
foreach ($statements as $stmt) {
    if ($stmt) {
        Illuminate\Support\Facades\DB::statement($stmt);
        $count++;
    }
}
echo "Updated $count portfolio item images successfully." . PHP_EOL;
