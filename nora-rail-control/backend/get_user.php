<?php

session_start();

header("Content-Type: application/json; charset=utf-8");
// Bejelentkezési állapot lekérdezése
if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "loggedIn" => false
    ]);

    exit;
}

echo json_encode([
    "loggedIn" => true,
    "user" => [
        "id" => $_SESSION["user_id"],
        "username" => $_SESSION["username"],
        "role" => $_SESSION["role"]
    ]
]);
