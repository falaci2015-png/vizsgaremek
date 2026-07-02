<?php
// Bejelentkezett felhasználó adatainak lekérdezése
session_start();

header("Content-Type: application/json; charset=UTF-8");
// Aktív munkamenet ellenőrzése
if (isset($_SESSION["username"])) {

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
