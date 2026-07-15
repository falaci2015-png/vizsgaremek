<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

// Csak admin használhatja
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

    $stmt = $pdo->query("
        SELECT
            id,
            name
        FROM cities
        ORDER BY id ASC
    ");

    $cities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "cities" => $cities
    ]);
} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "A városok nem tölthetők be."
    ]);
}
