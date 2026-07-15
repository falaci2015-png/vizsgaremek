<?php

session_start();

// Ha nincs bejelentkezve a felhasználó,
// akkor a bejelentkezési oldalra irányítjuk.
if (!isset($_SESSION["user_id"])) {
    header("Location: pages/login.php");
    exit;
}

// Ha már be van jelentkezve,
// akkor megnyitjuk a játék főmenüjét.
header("Location: pages/menu.php");
exit;
