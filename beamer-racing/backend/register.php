<?php
// Új felhasználó regisztrálása
header("Content-Type: application/json");

require_once "db.php";
// Regisztrációs adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Felhasználónév és jelszó megadása kötelező."
    ]);
    exit;
}

if (strlen($username) > 50) {
    echo json_encode([
        "success" => false,
        "message" => "A felhasználónév túl hosszú."
    ]);
    exit;
}

if (strlen($password) < 4) {
    echo json_encode([
        "success" => false,
        "message" => "A jelszó legalább 4 karakter legyen."
    ]);
    exit;
}
// Felhasználónév ellenőrzése
try {
    $stmt = $pdo->prepare("
        SELECT id
        FROM users
        WHERE username = ?
        LIMIT 1
    ");

    $stmt->execute([$username]);

    if ($stmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Ez a felhasználónév már foglalt."
        ]);
        exit;
    }
    // Jelszó titkosítása és mentése
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        INSERT INTO users (username, password)
        VALUES (?, ?)
    ");

    $stmt->execute([
        $username,
        $passwordHash
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Sikeres regisztráció."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Regisztrációs hiba."
    ]);
}
