<?php
$host = 'localhost';
$db = 'u_codeaxe_me';
$user = 'root';
$pass = '1234';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("DROP DATABASE IF EXISTS `$db`");
    $pdo->exec("CREATE DATABASE `$db`");
    $pdo->exec("USE `$db`");

    $files = [
        __DIR__ . '/sql/schema.sql',
        __DIR__ . '/sql/schema_extension.sql',
        __DIR__ . '/sql/schema_missing.sql',
        __DIR__ . '/sql/schema_cta.sql',
        __DIR__ . '/sql/schema_headers.sql',
        __DIR__ . '/sql/schema_settings.sql',
        __DIR__ . '/sql/schema_work.sql',
        __DIR__ . '/sql/schema_rewrites.sql',
        __DIR__ . '/sql/schema_services.sql',
        __DIR__ . '/sql/schema_portfolio.sql',
        __DIR__ . '/sql/schema_pages.sql',
        __DIR__ . '/sql/schema_contact.sql',
        __DIR__ . '/sql/schema_auth.sql',
        __DIR__ . '/sql/schema_dashboard.sql',
        __DIR__ . '/sql/schema_dms.sql'
    ];

    foreach ($files as $file) {
        if (file_exists($file)) {
            $sql = file_get_contents($file);
            $pdo->exec($sql);
            echo "Successfully executed " . basename($file) . "\n";
        } else {
            echo "File missing: " . basename($file) . "\n";
        }
    }
    echo "Database setup complete.\n";
} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage() . "\n");
}
