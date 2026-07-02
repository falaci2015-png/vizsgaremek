<?php

session_start();

require_once "db.php";

if (!isset($_SESSION["user_id"])) {

    die("Nincs bejelentkezve.");
}

$userId =
    $_SESSION["user_id"];

$oldPassword =
    $_POST["oldPassword"];

$newPassword =
    $_POST["newPassword"];

$sql = "
SELECT password
FROM users
WHERE id = ?
LIMIT 1
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "i",
    $userId
);

$stmt->execute();

$result =
    $stmt->get_result();

$user =
    $result->fetch_assoc();

if (!$user) {

    die("Felhasználó nem található.");
}

if (!password_verify($oldPassword, $user["password"])) {

    die("A régi jelszó hibás.");
}

$newPasswordHash =
    password_hash(
        $newPassword,
        PASSWORD_DEFAULT
    );

$updateSql = "
UPDATE users
SET password = ?
WHERE id = ?
";

$updateStmt =
    $conn->prepare($updateSql);

$updateStmt->bind_param(
    "si",
    $newPasswordHash,
    $userId
);

if ($updateStmt->execute()) {

    echo "Jelszó sikeresen módosítva.";
} else {

    echo "Hiba: " . $updateStmt->error;
}
