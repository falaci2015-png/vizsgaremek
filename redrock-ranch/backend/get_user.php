<?php
// redrock-ranch
session_start();
require_once "db.php";

header("Content-Type: application/json; charset=utf-8");

// Bejelentkezési állapot lekérdezése
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "logged_in" => false
    ]);
    exit;
}

// Aktivitási idő frissítése
$stmt = $pdo->prepare("
    UPDATE users
    SET last_active = NOW()
    WHERE id = ?
");

$stmt->execute([
    $_SESSION["user_id"]
]);

echo json_encode([
    "logged_in" => true,
    "user_id" => $_SESSION["user_id"],
    "username" => $_SESSION["username"],
    "role" => $_SESSION["role"]
]);
