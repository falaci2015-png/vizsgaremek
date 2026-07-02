<?php

session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs bejelentkezve."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$difficulty = $data["difficulty"] ?? "normal";
$score = (int)($data["score"] ?? 0);
$trainsPassed = (int)($data["trainsPassed"] ?? 0);
$correctRoutes = (int)($data["correctRoutes"] ?? 0);
$wrongRoutes = (int)($data["wrongRoutes"] ?? 0);
// Eredmény mentése a ranglistába
$stmt = $pdo->prepare("
    INSERT INTO leaderboard
    (
        user_id,
        difficulty,
        score,
        trains_passed,
        correct_routes,
        wrong_routes
    )
    VALUES
    (?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $_SESSION["user_id"],
    $difficulty,
    $score,
    $trainsPassed,
    $correctRoutes,
    $wrongRoutes
]);

echo json_encode([
    "success" => true
]);
