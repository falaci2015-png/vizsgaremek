<?php
// Ranglista lekérdezése
header("Content-Type: application/json");

require_once "db.php";
// Legjobb eredmények lekérdezése
try {
    $stmt = $pdo->query("
        SELECT
            id,
            player_name,
            car,
            difficulty,
            finish_time,
            money,
            created_at
        FROM leaderboard
        ORDER BY finish_time ASC, money DESC
        LIMIT 10
    ");

    $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "leaderboard" => $leaderboard
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
