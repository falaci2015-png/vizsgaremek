<?php
// Kijelentkezés és munkamenet lezárása beamer-racing
session_start();
require_once "db.php";

// Felhasználó offline állapotának beállítása
if (isset($_SESSION["user_id"])) {

    $stmt = $pdo->prepare("
        UPDATE users
        SET is_online = 0
        WHERE id = ?
    ");

    $stmt->execute([
        $_SESSION["user_id"]
    ]);
}

$_SESSION = [];

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();

    setcookie(
        session_name(),
        "",
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

session_destroy();

header("Content-Type: application/json");

echo json_encode([
    "success" => true,
    "message" => "Sikeres kijelentkezés."
]);