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
        l.id,
        u.username,
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
