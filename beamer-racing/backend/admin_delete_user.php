<?php
// Felhasználó törlése
session_start();

header("Content-Type: application/json");

require_once "db.php";

if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs jogosultság."
    ]);
    exit;
}
// Törlési adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

$userId = intval($data["user_id"] ?? 0);

if ($userId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen felhasználó."
    ]);
    exit;
}

if ($userId == $_SESSION["user_id"]) {
    echo json_encode([
        "success" => false,
        "message" => "Saját magadat nem törölheted."
    ]);
    exit;
}
// Védett felhasználó ellenőrzése
try {
    $checkStmt = $pdo->prepare("
        SELECT username
        FROM users
        WHERE id = ?
        LIMIT 1
    ");

    $checkStmt->execute([$userId]);

    $targetUser = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if ($targetUser && $targetUser["username"] === "admin") {
        echo json_encode([
            "success" => false,
            "message" => "Az alap admin nem törölhető."
        ]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Felhasználó ellenőrzési hiba."
    ]);
    exit;
}
// Felhasználó törlése az adatbázisból
try {
    $stmt = $pdo->prepare("
        DELETE FROM users
        WHERE id = ?
    ");

    $stmt->execute([$userId]);

    echo json_encode([
        "success" => true,
        "message" => "Felhasználó törölve."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Felhasználó törlési hiba."
    ]);
}
