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

    // Az új játékos alapértelmezett beállításainak létrehozása
    $newUserId = intval($pdo->lastInsertId());

    $settingsStmt = $pdo->prepare("
    INSERT INTO user_settings (
        user_id,
        selected_city_id,
        selected_background_id,
        difficulty,
        game_duration_seconds,
        music_enabled,
        effects_enabled
    )
    VALUES (?, 1, 1, 'normal', 60, 1, 1)
");

    $settingsStmt->execute([$newUserId]);

    echo json_encode([
        "success" => true,
        "message" => "Sikeres regisztráció."
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Regisztrációs hiba."]);
}
