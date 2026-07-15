<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

// Csak bejelentkezett felhasználó kérheti le a beállításait
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);

    exit;
}

$userId = intval($_SESSION["user_id"]);

try {
    $stmt = $pdo->prepare("
        SELECT
            us.selected_city_id,
            c.name AS city_name,
            us.selected_background_id,
            b.name AS background_name,
            b.image_filename AS background_filename,
            us.difficulty,
            us.game_duration_seconds,
            us.music_enabled,
            us.effects_enabled
        FROM user_settings us
        INNER JOIN cities c
            ON us.selected_city_id = c.id
        INNER JOIN backgrounds b
            ON us.selected_background_id = b.id
        WHERE us.user_id = ?
        LIMIT 1
    ");

    $stmt->execute([$userId]);

    $settings = $stmt->fetch(PDO::FETCH_ASSOC);

    // Biztonsági tartalék, ha egy új felhasználónak még nincs beállítássora
    if (!$settings) {
        $insert = $pdo->prepare("
            INSERT INTO user_settings (
                user_id,
                selected_city_id,
                selected_background_id,
                difficulty,
                game_duration_seconds,
                music_enabled,
                effects_enabled
            )
            VALUES (?, 1, 1, 'normal', 60, 1, 1)
        ");

        $insert->execute([$userId]);

        $stmt->execute([$userId]);

        $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    echo json_encode([
        "success" => true,
        "settings" => [
            "city_id" => intval($settings["selected_city_id"]),
            "city_name" => $settings["city_name"],
            "background_id" => intval($settings["selected_background_id"]),
            "background_name" => $settings["background_name"],
            "background_filename" => $settings["background_filename"],
            "difficulty" => $settings["difficulty"],
            "game_duration_seconds" =>
            intval($settings["game_duration_seconds"]),
            "music_enabled" =>
            boolval($settings["music_enabled"]),
            "effects_enabled" =>
            boolval($settings["effects_enabled"])
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "A játékbeállítások betöltése nem sikerült."
    ]);
}
