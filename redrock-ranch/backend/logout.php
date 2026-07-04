<?php
// redrock-ranch
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
// Aktív munkamenet lezárása
session_destroy();

header("Content-Type: application/json; charset=utf-8");
echo json_encode(["success" => true]);
