<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
// Bejelentkezési állapot lekérdezése
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "logged_in" => false
    ]);
    exit;
}

echo json_encode([
    "logged_in" => true,
    "user_id" => $_SESSION["user_id"],
    "username" => $_SESSION["username"],
    "role" => $_SESSION["role"]
]);
