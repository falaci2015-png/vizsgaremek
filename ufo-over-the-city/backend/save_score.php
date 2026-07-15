<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

// Csak bejelentkezett játékos menthet eredményt
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$userId = intval($_SESSION["user_id"]);
$score = intval($data["score"] ?? 0);

if ($score < 0) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen pontszám."
    ]);

    exit;
}

try {
    // A várost és a játékidőt az adatbázisból olvassuk ki
    $settingsStmt = $pdo->prepare("
        SELECT
            selected_city_id,
            game_duration_seconds
        FROM user_settings
        WHERE user_id = ?
        LIMIT 1
    ");

    $settingsStmt->execute([$userId]);

    $settings = $settingsStmt->fetch(PDO::FETCH_ASSOC);

    if (!$settings) {
        echo json_encode([
            "success" => false,
            "message" => "A játékos beállításai nem találhatók."
        ]);

        exit;
    }

    $cityId = intval($settings["selected_city_id"]);
    $gameDuration = intval($settings["game_duration_seconds"]);

    // Eredmény mentése a ranglistába
    $stmt = $pdo->prepare("
        INSERT INTO leaderboard (
            user_id,
            city_id,
            score,
            game_duration_seconds
        )
        VALUES (
            :user_id,
            :city_id,
            :score,
            :game_duration
        )
    ");

    $stmt->execute([
        ":user_id" => $userId,
        ":city_id" => $cityId,
        ":score" => $score,
        ":game_duration" => $gameDuration
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Az eredmény sikeresen elmentve."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Pontszám mentési hiba."
    ]);
}
