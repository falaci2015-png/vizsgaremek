<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";
// Admin jogosultság ellenőrzése
if (!isset($_SESSION["user_id"]) || $_SESSION["role"] !== "admin") {
    echo json_encode([
        "success" => false,
        "message" => "Nincs admin jogosultság."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$userId = (int)($data["userId"] ?? 0);
$newRole = $data["role"] ?? "user";

if (!in_array($newRole, ["user", "admin"])) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen jogosultság."
    ]);
    exit;
}

if ($userId === (int)$_SESSION["user_id"] && $newRole !== "admin") {
    echo json_encode([
        "success" => false,
        "message" => "Saját admin jogosultságodat nem veheted el."
    ]);
    exit;
}
$stmt = $pdo->prepare("
    SELECT username
    FROM users
    WHERE id = ?
");

$stmt->execute([$userId]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && $user["username"] === "admin") {
    echo json_encode([
        "success" => false,
        "message" => "A fő admin nem módosítható."
    ]);
    exit;
}
$stmt = $pdo->prepare("
    UPDATE users
    SET role = ?
    WHERE id = ?
");

$stmt->execute([$newRole, $userId]);

echo json_encode([
    "success" => true,
    "message" => "Jogosultság frissítve."
]);
