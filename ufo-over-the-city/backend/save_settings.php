<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

// Csak bejelentkezett felhasználó menthet beállításokat
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$userId = intval($_SESSION["user_id"]);

$cityId = intval($data["city_id"] ?? 0);
$backgroundId = intval($data["background_id"] ?? 0);
$difficulty = $data["difficulty"] ?? "normal";
$gameDuration = intval($data["game_duration_seconds"] ?? 60);
$musicEnabled = !empty($data["music_enabled"]) ? 1 : 0;
$effectsEnabled = !empty($data["effects_enabled"]) ? 1 : 0;

// Engedélyezett értékek ellenőrzése
$allowedDifficulties = [
    "easy",
    "normal",
    "hard",
    "brutal"
];

$allowedDurations = [
    30,
    60,
    90,
    120
];

if (
    $cityId <= 0 ||
    $backgroundId <= 0 ||
    !in_array($difficulty, $allowedDifficulties, true) ||
    !in_array($gameDuration, $allowedDurations, true)
) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen játékbeállítás."
    ]);

    exit;
}

try {
    // Ellenőrizzük, hogy létezik-e a kiválasztott város
    $stmt = $pdo->prepare("
        SELECT id
        FROM cities
        WHERE id = ?
    ");

    $stmt->execute([$cityId]);

    if (!$stmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "A kiválasztott város nem található."
        ]);

        exit;
    }

    // Ellenőrizzük, hogy létezik-e a kiválasztott háttér
    $stmt = $pdo->prepare("
        SELECT id
        FROM backgrounds
        WHERE id = ?
    ");

    $stmt->execute([$backgroundId]);

    if (!$stmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "A kiválasztott háttér nem található."
        ]);

        exit;
    }

    // Meglévő sor frissítése vagy új sor létrehozása
    $stmt = $pdo->prepare("
        INSERT INTO user_settings (
            user_id,
            selected_city_id,
            selected_background_id,
            difficulty,
            game_duration_seconds,
            music_enabled,
            effects_enabled
        )
        VALUES (
            :user_id,
            :city_id,
            :background_id,
            :difficulty,
            :game_duration,
            :music_enabled,
            :effects_enabled
        )
        ON DUPLICATE KEY UPDATE
            selected_city_id = VALUES(selected_city_id),
            selected_background_id = VALUES(selected_background_id),
            difficulty = VALUES(difficulty),
            game_duration_seconds = VALUES(game_duration_seconds),
            music_enabled = VALUES(music_enabled),
            effects_enabled = VALUES(effects_enabled)
    ");

    $stmt->execute([
        ":user_id" => $userId,
        ":city_id" => $cityId,
        ":background_id" => $backgroundId,
        ":difficulty" => $difficulty,
        ":game_duration" => $gameDuration,
        ":music_enabled" => $musicEnabled,
        ":effects_enabled" => $effectsEnabled
    ]);

    echo json_encode([
        "success" => true,
        "message" => "A játékbeállítások sikeresen elmentve."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "A játékbeállítások mentése nem sikerült."
    ]);
}
