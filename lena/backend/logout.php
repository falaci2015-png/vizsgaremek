<?php
// Kijelentkezés és munkamenet lezárása lena
session_start();
require_once "db.php";
// Felhasználó offline állapotának beállítása
if (isset($_SESSION["user_id"])) {
    $update = $conn->prepare("
        UPDATE users
        SET is_online = 0
        WHERE id = ?
    ");

    $update->bind_param(
        "i",
        $_SESSION["user_id"]
    );

    $update->execute();
}
session_destroy();

header(
    "Location: ../login.html"
);

exit;
