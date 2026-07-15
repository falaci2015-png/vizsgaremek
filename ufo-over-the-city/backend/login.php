<?php
// Bejelentkezési adatok beolvasása
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = trim($data["password"] ?? "");

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user["password_hash"])) {
    echo json_encode(["success" => false, "message" => "Hibás felhasználónév vagy jelszó."]);
    exit;
}
// Felhasználói munkamenet létrehozása
// Felhasználó online állapotának frissítése
$stmt = $pdo->prepare("
    UPDATE users
    SET
        is_online = 1,
        last_active = NOW()
    WHERE id = ?
");

$stmt->execute([
    $user["id"]
]);
$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $user["username"];
$_SESSION["role"] = $user["role"];

echo json_encode([
    "success" => true,
    "username" => $user["username"],
    "role" => $user["role"]
]);
