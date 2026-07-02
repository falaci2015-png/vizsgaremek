<?php

session_start();

require_once "db.php";

if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {

    die("Nincs jogosultság.");
}

if (!isset($_SESSION["user_id"])) {

    die("Nincs bejelentkezve.");
}

$loggedInUserId =
    $_SESSION["user_id"];

$userId =
    intval($_POST["userId"]);

$newRole =
    $_POST["role"];
$checkSql = "
SELECT username
FROM users
WHERE id = ?
LIMIT 1
";

$checkStmt = $conn->prepare($checkSql);

$checkStmt->bind_param("i", $userId);

$checkStmt->execute();

$checkResult = $checkStmt->get_result();

$targetUser = $checkResult->fetch_assoc();

if ($targetUser && $targetUser["username"] === "admin") {

    die("Az alap admin jogosultsága nem módosítható.");
}

if ($userId === $loggedInUserId) {

    die("Saját jogosultságodat nem módosíthatod.");
}

if (
    $newRole !== "user" &&
    $newRole !== "admin"
) {

    die("Érvénytelen jogosultság.");
}

$sql = "
UPDATE users
SET role = ?
WHERE id = ?
";

$stmt =
    $conn->prepare($sql);

$stmt->bind_param(
    "si",
    $newRole,
    $userId
);

if ($stmt->execute()) {

    echo "Jogosultság módosítva.";
} else {

    echo "Hiba: " . $stmt->error;
}
