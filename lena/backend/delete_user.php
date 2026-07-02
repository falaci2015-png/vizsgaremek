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

    die("Az alap admin nem törölhető.");
}

if ($userId === $loggedInUserId) {

    die("Saját magadat nem törölheted.");
}

$sql = "
DELETE FROM users
WHERE id = ?
";

$stmt =
    $conn->prepare($sql);

$stmt->bind_param(
    "i",
    $userId
);

if ($stmt->execute()) {

    echo "Felhasználó törölve.";
} else {

    echo "Hiba: " . $stmt->error;
}
