<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";
// Admin jogosultság ellenőrzése
if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs admin jogosultság."
    ]);
    exit;
}

try {

    $userCount = $pdo->query("
        SELECT COUNT(*) FROM users
    ")->fetchColumn();

    $adminCount = $pdo->query("
        SELECT COUNT(*) FROM users
        WHERE role='admin'
    ")->fetchColumn();

    $scoreCount = $pdo->query("
        SELECT COUNT(*) FROM leaderboard
    ")->fetchColumn();

    echo json_encode([
        "success" => true,
        "user_count" => $userCount,
        "admin_count" => $adminCount,
        "score_count" => $scoreCount
    ]);
} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Statisztikai hiba."
    ]);
}
