<?php
// Felhasználó bejelentkeztetése beamer-racing
session_start();

header("Content-Type: application/json");

require_once "db.php";
// Bejelentkezési adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "Hiányzó adatok."
    ]);

    exit;
}
// Felhasználó keresése
try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM users
        WHERE username = ?
        LIMIT 1
    ");

    $stmt->execute([$username]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {

        echo json_encode([
            "success" => false,
            "message" => "Hibás felhasználónév vagy jelszó."
        ]);

        exit;
    }
    // Jelszó ellenőrzése és munkamenet indítása
    if (!password_verify($password, $user["password"])) {

        echo json_encode([
            "success" => false,
            "message" => "Hibás felhasználónév vagy jelszó."
        ]);

        exit;
    }
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
} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Bejelentkezési hiba."
    ]);
}
