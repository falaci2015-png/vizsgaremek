<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";
// Admin jogosultság ellenőrzése
if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs admin jogosultság."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$userId = intval($data["user_id"] ?? 0);
$newRole = $data["role"] ?? "";

if ($userId <= 0 || !in_array($newRole, ["user", "admin"])) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen adatok."
    ]);
    exit;
}
// Saját admin jogosultság módosításának tiltása
if ($userId === intval($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Saját jogosultságodat nem módosíthatod."
    ]);
    exit;
}

$stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode([
        "success" => false,
        "message" => "Felhasználó nem található."
    ]);
    exit;
}

if ($user["username"] === "admin") {
    echo json_encode([
        "success" => false,
        "message" => "A fő admin nem módosítható."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE users
        SET role = ?
        WHERE id = ?
    ");

    $stmt->execute([$newRole, $userId]);

    echo json_encode([
        "success" => true,
        "message" => "Jogosultság módosítva."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Jogosultság módosítási hiba."
    ]);
}
