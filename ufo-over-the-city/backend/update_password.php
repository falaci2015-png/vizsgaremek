<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";
// Régi jelszó ellenőrzése
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$oldPassword = trim($data["old_password"] ?? "");
$newPassword = trim($data["new_password"] ?? "");
$newPasswordAgain = trim($data["new_password_again"] ?? "");

if ($oldPassword === "" || $newPassword === "" || $newPasswordAgain === "") {
    echo json_encode([
        "success" => false,
        "message" => "Minden jelszó mező kitöltése kötelező."
    ]);
    exit;
}

if ($newPassword !== $newPasswordAgain) {
    echo json_encode([
        "success" => false,
        "message" => "Az új jelszavak nem egyeznek."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
    $stmt->execute([$_SESSION["user_id"]]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    // Bejelentkezés ellenőrzése
    if (!$user || !password_verify($oldPassword, $user["password_hash"])) {
        echo json_encode([
            "success" => false,
            "message" => "A régi jelszó hibás."
        ]);
        exit;
    }
    // Új jelszó titkosítása
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$newHash, $_SESSION["user_id"]]);

    echo json_encode([
        "success" => true,
        "message" => "Jelszó sikeresen módosítva."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Jelszó módosítási hiba."
    ]);
}
