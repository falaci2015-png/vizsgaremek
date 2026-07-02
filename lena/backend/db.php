<?php
// Adatbázis kapcsolat létrehozása
// Környezet felismerése (helyi / online)
if (
    $_SERVER["HTTP_HOST"] === "localhost" ||
    $_SERVER["HTTP_HOST"] === "127.0.0.1"
) {

    $host = "localhost";
    $user = "root";
    $password = "";
    $database = "lena_game";
} else {

    $host = "sql208.infinityfree.com";
    $user = "if0_41754972";
    $password = "password";
    $database = "if0_41754972_lena_game";
}
// Kapcsolódás az adatbázishoz
$conn = new mysqli(
    $host,
    $user,
    $password,
    $database
);

if ($conn->connect_error) {

    die("Adatbázis kapcsolati hiba: " .
        $conn->connect_error);
}

$conn->set_charset("utf8mb4");
