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

// A JavaScript által küldött JSON-adatok beolvasása
$data = json_decode(
    file_get_contents("php://input"),
    true
);

$cityId = isset($data["city_id"])
    ? (int)$data["city_id"]
    : 0;

$cityName = trim($data["city_name"] ?? "");

$buildings = $data["buildings"] ?? null;

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

// Minden városnak pontosan 20 házból kell állnia
if (
    $cityId < 1 ||
    !is_array($buildings) ||
    count($buildings) !== 20
) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen vagy hiányos városadatok."
    ]);

    exit;
}

try {

    /*
     * Tranzakció indítása.
     * A 20 ház egyetlen összetartozó mentés.
     * Ha bármelyik módosítás hibás, az összeset visszavonjuk,
     * így nem maradhat félkész házsorrend az adatbázisban.
     */
    $pdo->beginTransaction();
    // Ellenőrizzük, hogy másik városnak nincs-e már ilyen neve
    $nameCheckStatement = $pdo->prepare("
    SELECT id
    FROM cities
    WHERE name = :name
      AND id <> :city_id
    LIMIT 1
");

    $nameCheckStatement->execute([
        "name" => $cityName,
        "city_id" => $cityId
    ]);

    if ($nameCheckStatement->fetch()) {
        throw new Exception("Már létezik ilyen nevű város.");
    }

    // A kiválasztott város nevének módosítása
    $updateCityStatement = $pdo->prepare("
    UPDATE cities
    SET name = :name
    WHERE id = :city_id
");

    $updateCityStatement->execute([
        "name" => $cityName,
        "city_id" => $cityId
    ]);
    /*
     * A pozíciók továbbra is fixen 1–20 között maradnak.
     * Csak azt módosítjuk, hogy az adott helyen
     * melyik háztípus szerepeljen.
     */
    $statement = $pdo->prepare("
        UPDATE city_buildings
        SET building_type_id = :building_type_id
        WHERE city_id = :city_id
          AND position = :position
    ");

    foreach ($buildings as $index => $building) {

        $buildingTypeId = isset($building["building_type_id"])
            ? (int)$building["building_type_id"]
            : 0;

        $position = $index + 1;

        if ($buildingTypeId < 1) {
            throw new Exception("Érvénytelen háztípus.");
        }

        $statement->execute([
            "building_type_id" => $buildingTypeId,
            "city_id" => $cityId,
            "position" => $position
        ]);

        if ($statement->rowCount() > 1) {
            throw new Exception("Hibás városszerkezet.");
        }
    }

    // Mind a 20 módosítás sikerült, ezért véglegesítjük őket
    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "A város sikeresen mentve."
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
