<?php

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

try {

    // Regisztrált felhasználók száma
    $userStatement = $pdo->query("
        SELECT COUNT(*)
        FROM users
    ");

    $userCount = (int)$userStatement->fetchColumn();

    // Aktív játékosok száma
    $onlineStatement = $pdo->query("
        SELECT COUNT(*)
        FROM users
        WHERE is_online = 1
          AND last_active >= NOW() - INTERVAL 5 MINUTE
    ");

    $onlineCount = (int)$onlineStatement->fetchColumn();

    echo json_encode([
        "success" => true,
        "database" => "Aktív",
        "users" => $userCount,
        "active_users" => $onlineCount
    ]);
} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "database" => "Hiba",
        "users" => 0,
        "active_users" => 0,
        "message" => "A rendszerállapot nem kérhető le."
    ]);
}
