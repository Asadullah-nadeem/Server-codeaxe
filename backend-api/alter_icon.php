<?php
$host = 'localhost';
$db = 'u_codeaxe_me';
$user = 'root';
$pass = '1234';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Add icon column to nav_links if it doesn't exist
    $stmt = $pdo->query("SHOW COLUMNS FROM nav_links LIKE 'icon'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE nav_links ADD COLUMN icon VARCHAR(50) DEFAULT NULL AFTER path");
        echo "Added 'icon' to nav_links.\n";
    } else {
        echo "'icon' already exists in nav_links.\n";
    }

    // Add icon column to footer_links if it doesn't exist
    $stmt2 = $pdo->query("SHOW COLUMNS FROM footer_links LIKE 'icon'");
    if ($stmt2->rowCount() == 0) {
        $pdo->exec("ALTER TABLE footer_links ADD COLUMN icon VARCHAR(50) DEFAULT NULL AFTER is_external");
        echo "Added 'icon' to footer_links.\n";
    } else {
        echo "'icon' already exists in footer_links.\n";
    }

} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage() . "\n");
}
