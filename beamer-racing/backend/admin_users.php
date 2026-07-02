<?php
// Felhasználók listájának lekérdezése
session_start();

header("Content-Type: application/json");

require_once "db.php";
// Admin jogosultság ellenőrzése
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
// Felhasználók lekérdezése
try {

    $stmt = $pdo->query("
        SELECT
            id,
            username,
            role,
            created_at
        FROM users
        ORDER BY username ASC
    ");

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "users" => $users
    ]);
} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Lekérdezési hiba."
    ]);
}
