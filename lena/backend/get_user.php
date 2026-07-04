<?php
// Bejelentkezett felhasználó adatainak lekérdezése lena
session_start();
require_once "db.php";
header("Content-Type: application/json; charset=UTF-8");
// Aktív munkamenet ellenőrzése
if (isset($_SESSION["username"])) {
    // Aktivitási idő frissítése
    if (isset($_SESSION["user_id"])) {
        $update = $conn->prepare("
            UPDATE users
            SET last_active = NOW()
            WHERE id = ?
        ");

        $update->bind_param(
            "i",
            $_SESSION["user_id"]
        );

        $update->execute();
    }
    echo json_encode([
        "loggedIn" => true,
        "user_id" => $_SESSION["user_id"],
        "username" => $_SESSION["username"],
        "role" => $_SESSION["role"]
    ]);
} else {

    echo json_encode([
        "loggedIn" => false
    ]);
}
