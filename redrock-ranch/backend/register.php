<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = trim($data["password"] ?? "");

if ($username === "" || $password === "") {
    echo json_encode(["success" => false, "message" => "Hiányzó adatok."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);

    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Ez a felhasználónév már foglalt."]);
        exit;
    }
    // Jelszó biztonságos titkosítása
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        INSERT INTO users (username, password_hash, role)
        VALUES (?, ?, 'user')
    ");
    $stmt->execute([$username, $hash]);

    echo json_encode(["success" => true, "message" => "Sikeres regisztráció."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Regisztrációs hiba."]);
}
