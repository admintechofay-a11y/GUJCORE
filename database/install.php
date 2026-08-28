<?php
/**
 * GUJCORR 2027: Automated MySQL Database Installer & Seeder
 * Run from terminal: php install.php
 * Or access in browser via local web server: http://localhost/database/install.php
 */

$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'gujcorr_db';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASSWORD') ?: '';

echo "=== GUJCORR 2027 Database Setup ===\n";
echo "Host: $db_host:$db_port\n";
echo "Database: $db_name\n";
echo "User: $db_user\n\n";

try {
    // 1. Connect to MySQL server
    $pdo = new PDO("mysql:host=$db_host;port=$db_port;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "[✓] Connected to MySQL Server.\n";

    // 2. Create Database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `$db_name`;");
    echo "[✓] Database `$db_name` ready.\n";

    // 3. Import Schema
    $schema_sql = file_get_contents(__DIR__ . '/gujcorr_schema.sql');
    if ($schema_sql) {
        $pdo->exec($schema_sql);
        echo "[✓] Schema tables (registrations, papers, booths, awards, invoices, inquiries) created.\n";
    }

    // 4. Import Seed Data
    $seed_sql = file_get_contents(__DIR__ . '/gujcorr_seed_data.sql');
    if ($seed_sql) {
        $pdo->exec($seed_sql);
        echo "[✓] Seed data inserted successfully.\n";
    }

    echo "\n🎉 SUCCESS: GUJCORR 2027 Production Database is Ready!\n";

} catch (PDOException $e) {
    echo "[!] Connection / Execution Error: " . $e->getMessage() . "\n";
    echo "Note: If running locally with XAMPP, ensure MySQL is started in XAMPP Control Panel.\n";
}
