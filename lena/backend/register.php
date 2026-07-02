<?php
// Felhasználó bejelentkeztetése
require_once "db.php";

header("Content-Type: application/json; charset=UTF-8");
// Bejelentkezési adatok beolvasása
$username =
    trim($_POST["username"]);

$password =
    $_POST["password"];

if ($username === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "Minden mező kitöltése kötelező."
    ]);

    exit;
}

$checkSql = "
SELECT id
FROM users
WHERE username = ?
LIMIT 1
";

$checkStmt =
    $conn->prepare($checkSql);

$checkStmt->bind_param(
    "s",
    $username
);

$checkStmt->execute();

$checkResult =
    $checkStmt->get_result();

if ($checkResult->num_rows > 0) {

    echo json_encode([
        "success" => false,
        "message" => "Ez a felhasználónév már foglalt."
    ]);

    exit;
}

$passwordHash =
    password_hash(
        $password,
        PASSWORD_DEFAULT
    );

$role = "user";
// Felhasználó keresése az adatbázisban
$sql = "
INSERT INTO users
(
    username,
    password,
    role
)
VALUES
(
    ?, ?, ?
)
";

$stmt =
    $conn->prepare($sql);

$stmt->bind_param(
    "sss",
    $username,
    $passwordHash,
    $role
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Sikeres regisztráció! Most már bejelentkezhetsz."
    ]);

    exit;
} else {

    echo json_encode([
        "success" => false,
        "message" => "Hiba: " . $stmt->error
    ]);

    exit;
}
