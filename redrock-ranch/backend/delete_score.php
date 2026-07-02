<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";
// Admin jogosultság ellenőrzése
if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs admin jogosultság."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$scoreId = intval($data["score_id"] ?? 0);

if ($scoreId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen ranglista rekord."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM leaderboard WHERE id = ?");
    $stmt->execute([$scoreId]);

    echo json_encode([
        "success" => true,
        "message" => "Ranglista rekord törölve."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Ranglista rekord törlési hiba."
    ]);
}
