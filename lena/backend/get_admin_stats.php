<?php
// Admin statisztikák lekérdezése
session_start();

require_once "db.php";

header("Content-Type: application/json; charset=UTF-8");

if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {

    echo json_encode([
        "success" => false
    ]);

    exit;
}
// Statisztikai adatok összegyűjtése
$stats = [];

$resultUsers =
    $conn->query("
        SELECT COUNT(*) AS total
        FROM users
    ");

$stats["users"] =
    $resultUsers->fetch_assoc()["total"];

$resultAdmins =
    $conn->query("
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'admin'
    ");

$stats["admins"] =
    $resultAdmins->fetch_assoc()["total"];

$resultScores =
    $conn->query("
        SELECT COUNT(*) AS total
        FROM leaderboard
        WHERE deleted = 0
    ");

$stats["scores"] =
    $resultScores->fetch_assoc()["total"];

echo json_encode([
    "success" => true,
    "stats" => $stats
]);
