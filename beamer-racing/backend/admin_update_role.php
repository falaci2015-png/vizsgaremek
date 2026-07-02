<?php
// Felhasználói jogosultság módosítása
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
// Módosítási adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

$userId = intval($data["user_id"] ?? 0);
$newRole = $data["role"] ?? "";

if ($userId <= 0 || !in_array($newRole, ["user", "admin"])) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen adat."
    ]);
    exit;
}

if ($userId == $_SESSION["user_id"]) {
    echo json_encode([
        "success" => false,
        "message" => "Saját szerepkört nem módosíthatsz."
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
            "message" => "Az alap admin jogosultsága nem módosítható."
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

try {
    $stmt = $pdo->prepare("
        UPDATE users
        SET role = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $newRole,
        $userId
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Szerepkör módosítva."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Szerepkör módosítási hiba."
    ]);
}
