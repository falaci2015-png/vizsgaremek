<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezve."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$oldPassword = $data["oldPassword"] ?? "";
$newPassword = $data["newPassword"] ?? "";

$stmt = $pdo->prepare("
    SELECT password_hash
    FROM users
    WHERE id = ?
");

$stmt->execute([$_SESSION["user_id"]]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode([
        "success" => false,
        "message" => "Felhasználó nem található."
    ]);
    exit;
}
// Csak bejelentkezett felhasználó módosíthat jelszót
if (!password_verify($oldPassword, $user["password_hash"])) {
    echo json_encode([
        "success" => false,
        "message" => "A régi jelszó hibás."
    ]);
    exit;
}
// Új jelszó titkosítása
$newHash = password_hash($newPassword, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("
    UPDATE users
    SET password_hash = ?
    WHERE id = ?
");

$stmt->execute([
    $newHash,
    $_SESSION["user_id"]
]);

echo json_encode([
    "success" => true,
    "message" => "Jelszó sikeresen módosítva."
]);
