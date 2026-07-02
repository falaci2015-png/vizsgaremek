<?php
// Ranglista rekord törlése
session_start();

header("Content-Type: application/json");

require_once "db.php";

if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "Nincs jogosultság."
    ]);
    exit;
}
// Törlési adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

$scoreId = intval($data["score_id"] ?? 0);

if ($scoreId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen rekord."
    ]);
    exit;
}
// Rekord törlése
try {
    $stmt = $pdo->prepare("
        DELETE FROM leaderboard
        WHERE id = ?
    ");

    $stmt->execute([$scoreId]);

    echo json_encode([
        "success" => true,
        "message" => "Ranglista rekord törölve."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Ranglista törlési hiba."
    ]);
}
