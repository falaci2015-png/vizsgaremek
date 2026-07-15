<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

// Csak bejelentkezett játékos kérheti le a várost
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);

    exit;
}

$userId = intval($_SESSION["user_id"]);

try {
    // A játékos kiválasztott városának lekérése
    $settingsStmt = $pdo->prepare("
        SELECT selected_city_id
        FROM user_settings
        WHERE user_id = ?
        LIMIT 1
    ");

    $settingsStmt->execute([$userId]);

    $cityId = intval($settingsStmt->fetchColumn());

    // Biztonsági alapérték
    if ($cityId <= 0) {
        $cityId = 1;
    }

    // A kiválasztott város épületeinek lekérése
    $stmt = $pdo->prepare("
        SELECT
            cb.position,
            bt.image_filename,
            bt.spawn_x,
            bt.spawn_y
        FROM city_buildings cb
        INNER JOIN building_types bt
            ON cb.building_type_id = bt.id
        WHERE cb.city_id = ?
        ORDER BY cb.position
    ");

    $stmt->execute([$cityId]);

    echo json_encode(
        $stmt->fetchAll(PDO::FETCH_ASSOC),
        JSON_UNESCAPED_UNICODE
    );
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "A város betöltése nem sikerült."
    ]);
}
