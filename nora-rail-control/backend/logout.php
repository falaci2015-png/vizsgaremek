<?php

session_start();
// Felhasználói session törlése
session_unset();
session_destroy();

header("Content-Type: application/json; charset=utf-8");

echo json_encode([
    "success" => true
]);
