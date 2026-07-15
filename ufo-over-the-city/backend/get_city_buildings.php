<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

// Csak bejelentkezett admin használhatja
if (
    !isset($_SESSION["user_id"]) ||
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs jogosultság."
    ]);

    exit;
}

require_once "db.php";

// Városazonosító ellenőrzése
$cityId = filter_input(
    INPUT_GET,
    "city_id",
    FILTER_VALIDATE_INT
);

if (!$cityId || $cityId < 1) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen városazonosító."
    ]);

    exit;
}

try {

    // Város adatainak lekérése
    $cityStatement = $pdo->prepare("
        SELECT
            id,
            name
        FROM cities
        WHERE id = :city_id
        LIMIT 1
    ");

    $cityStatement->execute([
        "city_id" => $cityId
    ]);

    $city = $cityStatement->fetch(PDO::FETCH_ASSOC);

    if (!$city) {
        echo json_encode([
            "success" => false,
            "message" => "A kiválasztott város nem található."
        ]);

        exit;
    }

    // A városhoz tartozó házak lekérése
    $buildingStatement = $pdo->prepare("
        SELECT
            cb.id AS city_building_id,
            cb.position,
            bt.id AS building_type_id,
            bt.name,
            bt.image_filename,
            bt.spawn_x,
            bt.spawn_y
        FROM city_buildings AS cb
        INNER JOIN building_types AS bt
            ON bt.id = cb.building_type_id
        WHERE cb.city_id = :city_id
        ORDER BY cb.position ASC
    ");

    $buildingStatement->execute([
        "city_id" => $cityId
    ]);

    $buildings = $buildingStatement->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "city" => $city,
        "buildings" => $buildings,
        "building_count" => count($buildings)
    ]);
} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "A város házai nem tölthetők be."
    ]);
}
