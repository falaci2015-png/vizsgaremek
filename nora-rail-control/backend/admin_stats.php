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

$userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$adminCount = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
$leaderboardCount = $pdo->query("SELECT COUNT(*) FROM leaderboard")->fetchColumn();

echo json_encode([
    "success" => true,
    "stats" => [
        "users" => $userCount,
        "admins" => $adminCount,
        "leaderboard" => $leaderboardCount
    ]
]);
