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
    $stmt = $pdo->query("
        SELECT 
            leaderboard.id,
            users.username,
            leaderboard.score,
            leaderboard.game_time,
            leaderboard.created_at
        FROM leaderboard
        INNER JOIN users ON leaderboard.user_id = users.id
        ORDER BY leaderboard.score DESC, leaderboard.created_at ASC
    ");

    echo json_encode([
        "success" => true,
        "scores" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Ranglista rekordok lekérési hiba."
    ]);
}
