<?php
// Ranglista adatainak lekérdezése
require_once "db.php";

header("Content-Type: application/json; charset=UTF-8");
// Legjobb eredmények lekérdezése
$sql = "
SELECT
    leaderboard.id,
    leaderboard.score,
    leaderboard.world,
    leaderboard.difficulty,
    leaderboard.played_at,
    users.username
FROM leaderboard
INNER JOIN users
    ON leaderboard.user_id = users.id
WHERE leaderboard.deleted = 0
ORDER BY leaderboard.score DESC, leaderboard.played_at ASC
LIMIT 10
";

$result = $conn->query($sql);

$leaderboard = [];

while ($row = $result->fetch_assoc()) {

    $leaderboard[] = $row;
}

echo json_encode($leaderboard);
