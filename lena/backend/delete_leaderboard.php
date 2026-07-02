<?php

session_start();

require_once "db.php";

if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {

    die("Nincs jogosultság.");
}

$sql = "
UPDATE leaderboard
SET deleted = 1
WHERE deleted = 0
";

if ($conn->query($sql)) {

    echo "Ranglista törölve.";
} else {

    echo "Hiba: " . $conn->error;
}
