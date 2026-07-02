<?php
// Felhasználói jelszó módosítása
session_start();

header("Content-Type: application/json");

require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);
    exit;
}
// Jelszó adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

$oldPassword = $data["old_password"] ?? "";
$newPassword = $data["new_password"] ?? "";

if ($oldPassword === "" || $newPassword === "") {
    echo json_encode([
        "success" => false,
        "message" => "Minden mező kitöltése kötelező."
    ]);
    exit;
}

if (strlen($newPassword) < 4) {
    echo json_encode([
        "success" => false,
        "message" => "Az új jelszó legalább 4 karakter legyen."
    ]);
    exit;
}
// Jelenlegi jelszó ellenőrzése
try {
    $stmt = $pdo->prepare("
        SELECT password
        FROM users
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->execute([
        $_SESSION["user_id"]
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "Felhasználó nem található."
        ]);
        exit;
    }

    if (!password_verify($oldPassword, $user["password"])) {
        echo json_encode([
            "success" => false,
            "message" => "A régi jelszó hibás."
        ]);
        exit;
    }
    // Új jelszó mentése
    $newPasswordHash =
        password_hash($newPassword, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        UPDATE users
        SET password = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $newPasswordHash,
        $_SESSION["user_id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Jelszó sikeresen módosítva."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Jelszó módosítási hiba."
    ]);
}
