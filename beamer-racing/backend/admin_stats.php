<?php
// Admin statisztikák lekérdezése
session_start();

header("Content-Type: application/json");

require_once "db.php";

if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs jogosultság."
    ]);
    exit;
}
// Statisztikai adatok összegyűjtése
try {
    $userCount =
        $pdo->query("SELECT COUNT(*) FROM users")
        ->fetchColumn();

    $adminCount =
        $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")
        ->fetchColumn();

    $leaderboardCount =
        $pdo->query("SELECT COUNT(*) FROM leaderboard")
        ->fetchColumn();

    $bestTime =
        $pdo->query("SELECT MIN(finish_time) FROM leaderboard")
        ->fetchColumn();

    echo json_encode([
        "success" => true,
        "user_count" => $userCount,
        "admin_count" => $adminCount,
        "leaderboard_count" => $leaderboardCount,
        "best_time" => $bestTime
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Statisztikai hiba."
    ]);
}
