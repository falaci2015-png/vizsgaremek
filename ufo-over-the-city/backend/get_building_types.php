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

try {

    // Az összes választható háztípus lekérése
    $statement = $pdo->query("
        SELECT
            id,
            name,
            image_filename,
            spawn_x,
            spawn_y
        FROM building_types
        ORDER BY id ASC
    ");

    $buildingTypes = $statement->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "building_types" => $buildingTypes
    ]);
} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "A háztípusok nem tölthetők be."
    ]);
}
