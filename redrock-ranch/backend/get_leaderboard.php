<?php

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

try {
    $stmt = $pdo->query("
        SELECT 
            users.username AS player_name,
            leaderboard.score,
            leaderboard.game_time,
            leaderboard.created_at
        FROM leaderboard
        INNER JOIN users ON leaderboard.user_id = users.id
        ORDER BY leaderboard.score DESC, leaderboard.created_at ASC
        LIMIT 10
    ");

    echo json_encode([
        "success" => true,
        "leaderboard" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Ranglista lekérési hiba."
    ]);
}
