<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";
// Bejelentkezett felhasználó ellenőrzése
if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezett felhasználó."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$userId = $_SESSION["user_id"];
$score = intval($data["score"] ?? 0);
$gameTime = intval($data["game_time"] ?? 60);
// Eredmény mentése a ranglistába
try {
    $stmt = $pdo->prepare("
        INSERT INTO leaderboard (user_id, score, game_time)
        VALUES (:user_id, :score, :game_time)
    ");

    $stmt->execute([
        ":user_id" => $userId,
        ":score" => $score,
        ":game_time" => $gameTime
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Pontszám mentve."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Pontszám mentési hiba."
    ]);
}
