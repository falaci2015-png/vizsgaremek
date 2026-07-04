<?php
// nora-rail-controll
session_start();
require_once "db.php";
header("Content-Type: application/json; charset=utf-8");
// Bejelentkezési állapot lekérdezése
if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "loggedIn" => false
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
    "loggedIn" => true,
    "user" => [
        "id" => $_SESSION["user_id"],
        "username" => $_SESSION["username"],
        "role" => $_SESSION["role"]
    ]
]);
