<?php

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

try {

    $stmt = $pdo->query("
        SELECT
            
            l.id,

            u.role,

            u.username AS player_name,

            c.name AS city_name,

            l.score,

            l.game_duration_seconds,

            l.played_at

        FROM leaderboard l

        INNER JOIN users u
            ON l.user_id = u.id

        INNER JOIN cities c
            ON l.city_id = c.id

        ORDER BY

            l.score DESC,

            l.game_duration_seconds ASC,

            l.played_at ASC

        LIMIT 100
    ");

    echo json_encode([
        "success" => true,
        "leaderboard" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Ranglista lekérési hiba."
    ]);
}
