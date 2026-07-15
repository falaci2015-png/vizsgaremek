<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

// Csak admin törölhet várost
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

// JavaScriptből érkező JSON
$data = json_decode(
    file_get_contents("php://input"),
    true
);

$cityId = isset($data["city_id"])
    ? (int)$data["city_id"]
    : 0;

if ($cityId < 1) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen városazonosító."
    ]);

    exit;
}

// Az 1-es azonosítójú alapváros védett
if ($cityId === 1) {
    echo json_encode([
        "success" => false,
        "message" => "Az alapváros nem törölhető."
    ]);

    exit;
}

try {

    /*
     * A város és a hozzá tartozó adatok törlését
     * egyetlen tranzakcióban végezzük.
     */
    $pdo->beginTransaction();

    // A játékosok beállításait visszaállítjuk az alapvárosra
    $settingsStatement = $pdo->prepare("
    UPDATE user_settings
    SET selected_city_id = 1
    WHERE selected_city_id = :city_id
");
    $settingsStatement->execute([
        "city_id" => $cityId
    ]);

    // A város házainak törlése
    $buildingsStatement = $pdo->prepare("
        DELETE FROM city_buildings
        WHERE city_id = :city_id
    ");

    $buildingsStatement->execute([
        "city_id" => $cityId
    ]);

    // A város törlése
    $cityStatement = $pdo->prepare("
        DELETE FROM cities
        WHERE id = :city_id
    ");

    $cityStatement->execute([
        "city_id" => $cityId
    ]);

    if ($cityStatement->rowCount() !== 1) {
        throw new Exception("A város nem található.");
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "A város sikeresen törölve."
    ]);
} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
