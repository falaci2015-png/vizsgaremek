<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Minden mező kitöltése kötelező."
    ]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT id, username, password_hash, role
    FROM users
    WHERE username = ?
");

$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user["password_hash"])) {
    echo json_encode([
        "success" => false,
        "message" => "Hibás felhasználónév vagy jelszó."
    ]);
    exit;
}
// Sikeres bejelentkezés után a felhasználó adatainak mentése a session-be
$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $user["username"];
$_SESSION["role"] = $user["role"];

echo json_encode([
    "success" => true,
    "message" => "Sikeres bejelentkezés.",
    "user" => [
        "id" => $user["id"],
        "username" => $user["username"],
        "role" => $user["role"]
    ]
]);
