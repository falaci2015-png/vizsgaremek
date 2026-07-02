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

if ($userId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen felhasználó."
    ]);
    exit;
}

if ($userId === (int)$_SESSION["user_id"]) {
    echo json_encode([
        "success" => false,
        "message" => "Saját magadat nem törölheted."
    ]);
    exit;
}

$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
$stmt = $pdo->prepare("
    SELECT username
    FROM users
    WHERE id = ?
");

$stmt->execute([$userId]);

$protectedUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (
    $protectedUser &&
    $protectedUser["username"] === "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "A fő admin nem törölhető."
    ]);
    exit;
}
if (!$user) {
    echo json_encode([
        "success" => false,
        "message" => "Felhasználó nem található."
    ]);
    exit;
}

if ($user["role"] === "admin") {
    $adminCount = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();

    if ($adminCount <= 1) {
        echo json_encode([
            "success" => false,
            "message" => "Az utolsó admin nem törölhető."
        ]);
        exit;
    }
}

$stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
$stmt->execute([$userId]);

echo json_encode([
    "success" => true,
    "message" => "Felhasználó törölve."
]);
