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

if (strlen($username) < 3 || strlen($password) < 3) {
    echo json_encode([
        "success" => false,
        "message" => "A felhasználónév és jelszó legalább 3 karakter legyen."
    ]);
    exit;
}

$check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$check->execute([$username]);

if ($check->fetch()) {
    echo json_encode([
        "success" => false,
        "message" => "Ez a felhasználónév már foglalt."
    ]);
    exit;
}
// Jelszó titkosítása mentés előtt
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("
    INSERT INTO users (username, password_hash)
    VALUES (?, ?)
");

$stmt->execute([$username, $passwordHash]);

echo json_encode([
    "success" => true,
    "message" => "Sikeres regisztráció."
]);
