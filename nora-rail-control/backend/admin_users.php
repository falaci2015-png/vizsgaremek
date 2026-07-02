<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";
// Admin jogosultság ellenőrzése
if (!isset($_SESSION["user_id"]) || $_SESSION["role"] !== "admin") {
    echo json_encode([
        "success" => false,
        "message" => "Nincs admin jogosultság."
    ]);
    exit;
}

$stmt = $pdo->query("
    SELECT id, username, role, created_at
    FROM users
    ORDER BY id ASC
");

echo json_encode([
    "success" => true,
    "users" => $stmt->fetchAll(PDO::FETCH_ASSOC)
]);
