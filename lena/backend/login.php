<?php
// Felhasználó bejelentkeztetése
session_start();

require_once "db.php";

header("Content-Type: application/json; charset=UTF-8");
// Bejelentkezési adatok beolvasása
$username = trim($_POST["username"]);
$password = $_POST["password"];

if ($username === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "Minden mező kitöltése kötelező."
    ]);

    exit;
}
// Felhasználó keresése az adatbázisban
$sql = "SELECT * FROM users WHERE username = ? LIMIT 1";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "s",
    $username
);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Nincs ilyen felhasználó."
    ]);

    exit;
}

$user = $result->fetch_assoc();
// Jelszó ellenőrzése és munkamenet indítása
if (password_verify($password, $user["password"])) {

    $_SESSION["user_id"] = $user["id"];
    $_SESSION["username"] = $user["username"];
    $_SESSION["role"] = $user["role"];

    echo json_encode([
        "success" => true,
        "message" => "Sikeres bejelentkezés."
    ]);

    exit;
} else {

    echo json_encode([
        "success" => false,
        "message" => "Hibás jelszó."
    ]);

    exit;
}
