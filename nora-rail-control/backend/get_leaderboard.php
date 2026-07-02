<?php
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

$difficulty = $_GET["difficulty"] ?? "normal";
// Engedélyezett nehézségi szintek
$allowed = ["easy", "normal", "hard"];

if (!in_array($difficulty, $allowed)) {
    $difficulty = "normal";
}
// Top 10 eredmény lekérése az adott nehézségi szinthez
$stmt = $pdo->prepare("
    SELECT 
        leaderboard.id,
        users.username,
        leaderboard.difficulty,
        leaderboard.score,
        leaderboard.trains_passed,
        leaderboard.correct_routes,
        leaderboard.wrong_routes,
        leaderboard.created_at
    FROM leaderboard
    INNER JOIN users ON leaderboard.user_id = users.id
    WHERE leaderboard.difficulty = ?
    ORDER BY leaderboard.score DESC, leaderboard.correct_routes DESC
    LIMIT 10
");

$stmt->execute([$difficulty]);

echo json_encode([
    "success" => true,
    "leaderboard" => $stmt->fetchAll(PDO::FETCH_ASSOC)
]);
