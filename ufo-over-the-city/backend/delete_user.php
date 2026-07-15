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

if ($userId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen felhasználó."
    ]);
    exit;
}

if ($userId === intval($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Saját magadat nem törölheted."
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
        "message" => "A fő admin nem törölhető."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);

    echo json_encode([
        "success" => true,
        "message" => "Felhasználó törölve."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Felhasználó törlési hiba."
    ]);
}
