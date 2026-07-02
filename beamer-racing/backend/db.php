<?php
// Adatbázis kapcsolat létrehozása
// Környezet felismerése (helyi / online)
$isLocalhost =
    $_SERVER["HTTP_HOST"] === "localhost" ||
    $_SERVER["HTTP_HOST"] === "127.0.0.1" ||
    str_starts_with($_SERVER["HTTP_HOST"], "localhost:");

if ($isLocalhost) {
    $host = "localhost";
    $dbname = "beamer_racing";
    $username = "root";
    $password = "";
} else {
    $host = "sql208.infinityfree.com";
    $dbname = "if0_41754972_beamer_racing";
    $username = "if0_41754972";
    $password = "password";
}
// Kapcsolódás az adatbázishoz
try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "message" => "Adatbázis kapcsolódási hiba.",
        "debug" => $e->getMessage()
    ]);
    exit;
}
