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
    SELECT
        leaderboard.id,
        users.username,
        leaderboard.difficulty,
        leaderboard.score,
        leaderboard.created_at
    FROM leaderboard
    INNER JOIN users
        ON leaderboard.user_id = users.id
    ORDER BY leaderboard.created_at DESC
");

echo json_encode([
    "success" => true,
    "records" => $stmt->fetchAll(PDO::FETCH_ASSOC)
]);
