<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

// A beállítási listák csak bejelentkezve kérhetők le
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);

    exit;
}

try {
    // Városok lekérése az adatbázisból
    $cityStmt = $pdo->query("
        SELECT
            id,
            name,
            background_id
        FROM cities
        ORDER BY name ASC
    ");

    $cities = $cityStmt->fetchAll(PDO::FETCH_ASSOC);

    // Hátterek lekérése az adatbázisból
    $backgroundStmt = $pdo->query("
        SELECT
            id,
            name,
            image_filename
        FROM backgrounds
        ORDER BY id ASC
    ");

    $backgrounds = $backgroundStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "cities" => $cities,
        "backgrounds" => $backgrounds
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "A városok és hátterek betöltése nem sikerült."
    ]);
}
