<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

// Csak bejelentkezett admin hozhat létre várost
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

// A JavaScriptből érkező JSON-adatok beolvasása
$data = json_decode(
    file_get_contents("php://input"),
    true
);

$cityName = trim($data["name"] ?? "");

$templateCityId = isset($data["template_city_id"])
    ? (int)$data["template_city_id"]
    : 0;

// Városnév ellenőrzése
if ($cityName === "") {
    echo json_encode([
        "success" => false,
        "message" => "A város nevét kötelező megadni."
    ]);

    exit;
}

if (mb_strlen($cityName) > 40) {
    echo json_encode([
        "success" => false,
        "message" => "A város neve legfeljebb 40 karakter lehet."
    ]);

    exit;
}

if ($templateCityId < 1) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs kiválasztott mintaváros."
    ]);

    exit;
}

try {

    /*
     * Tranzakció indítása.
     * Az új város és a hozzá tartozó 20 ház egyetlen egység.
     * Ha bárhol hiba történik, sem a város,
     * sem a félkész házsorrend nem marad az adatbázisban.
     */
    $pdo->beginTransaction();

    // Ellenőrizzük, hogy nincs-e már ilyen nevű város
    $nameStatement = $pdo->prepare("
        SELECT id
        FROM cities
        WHERE name = :name
        LIMIT 1
    ");

    $nameStatement->execute([
        "name" => $cityName
    ]);

    if ($nameStatement->fetch()) {
        throw new Exception("Már létezik ilyen nevű város.");
    }

    // A mintaváros háttér-azonosítójának lekérése
    $templateStatement = $pdo->prepare("
        SELECT
            id,
            background_id
        FROM cities
        WHERE id = :city_id
        LIMIT 1
    ");

    $templateStatement->execute([
        "city_id" => $templateCityId
    ]);

    $templateCity = $templateStatement->fetch(PDO::FETCH_ASSOC);

    if (!$templateCity) {
        throw new Exception("A mintaváros nem található.");
    }

    // A mintaváros pontosan 20 házának lekérése
    $buildingsStatement = $pdo->prepare("
        SELECT
            position,
            building_type_id
        FROM city_buildings
        WHERE city_id = :city_id
        ORDER BY position ASC
    ");

    $buildingsStatement->execute([
        "city_id" => $templateCityId
    ]);

    $templateBuildings =
        $buildingsStatement->fetchAll(PDO::FETCH_ASSOC);

    if (count($templateBuildings) !== 20) {
        throw new Exception(
            "A mintaváros nem pontosan 20 házból áll."
        );
    }

    // Új város létrehozása
    $insertCityStatement = $pdo->prepare("
        INSERT INTO cities (
            name,
            background_id,
            created_by
        )
        VALUES (
            :name,
            :background_id,
            :created_by
        )
    ");

    $insertCityStatement->execute([
        "name" => $cityName,
        "background_id" => (int)$templateCity["background_id"],
        "created_by" => (int)$_SESSION["user_id"]
    ]);

    $newCityId = (int)$pdo->lastInsertId();

    // A 20 ház átmásolása az új városhoz
    $insertBuildingStatement = $pdo->prepare("
        INSERT INTO city_buildings (
            city_id,
            position,
            building_type_id
        )
        VALUES (
            :city_id,
            :position,
            :building_type_id
        )
    ");

    foreach ($templateBuildings as $building) {
        $insertBuildingStatement->execute([
            "city_id" => $newCityId,
            "position" => (int)$building["position"],
            "building_type_id" =>
            (int)$building["building_type_id"]
        ]);
    }

    // A város és mind a 20 ház elkészült
    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Az új város sikeresen létrejött.",
        "city_id" => $newCityId
    ]);
} catch (Throwable $e) {

    // Hiba esetén minden addigi módosítást visszavonunk
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
