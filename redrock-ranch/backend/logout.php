<?php
session_start();
// Aktív munkamenet lezárása
session_destroy();

header("Content-Type: application/json; charset=utf-8");
echo json_encode(["success" => true]);
