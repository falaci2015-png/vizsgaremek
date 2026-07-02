<?php
// Játékeredmény mentése az adatbázisba
session_start();

require_once "db.php";
// Bejelentkezés ellenőrzése
if (!isset($_SESSION["user_id"])) {

    die("Nincs bejelentkezve.");
}

$userId = $_SESSION["user_id"];

$score =
    intval($_POST["score"]);

$world =
    $_POST["world"];

$difficulty =
    $_POST["difficulty"];
// Új ranglista rekord mentése
$sql = "
INSERT INTO leaderboard
(
    user_id,
    score,
    world,
    difficulty
)
VALUES
(
    ?, ?, ?, ?
)
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "iiss",
    $userId,
    $score,
    $world,
    $difficulty
);

if ($stmt->execute()) {

    echo "Sikeres mentés";
} else {

    echo "Hiba: " . $stmt->error;
}
