<?php

$isLocalhost =
    $_SERVER["HTTP_HOST"] === "localhost" ||
    $_SERVER["HTTP_HOST"] === "127.0.0.1" ||
    str_starts_with($_SERVER["HTTP_HOST"], "localhost:");
// Környezet felismerése (localhost vagy online tárhely)
if ($isLocalhost) {

    $host = "127.0.0.1";
    $dbname = "redrock_ranch";
    $username = "root";
    $password = "";
} else {

    $host = "sql208.infinityfree.com";
    $dbname = "if0_41754972_redrock_ranch";
    $username = "if0_41754972";
    $password = "password";
}
// Adatbázis kapcsolat létrehozása
try {

    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );
} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Adatbázis kapcsolódási hiba."
    ]);

    exit;
}
