<?php
// Versenyeredmény mentése
session_start();

header("Content-Type: application/json");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs adat."
    ]);
    exit;
}
// Bejelentkezés ellenőrzése
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);
    exit;
}

$playerName = $_SESSION["username"];
$car = $data["car"] ?? "Autó A";
$difficulty = $data["difficulty"] ?? "Normál";
$finishTime = $data["finish_time"] ?? 0;
$money = $data["money"] ?? 0;
// Eredmény mentése az adatbázisba
try {

    $stmt = $pdo->prepare("
        INSERT INTO leaderboard
        (player_name, car, difficulty, finish_time, money)
        VALUES
        (?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $playerName,
        $car,
        $difficulty,
        $finishTime,
        $money
    ]);

    echo json_encode([
        "success" => true
    ]);
} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
