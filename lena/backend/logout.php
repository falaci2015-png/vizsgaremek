<?php
// Kijelentkezés és munkamenet lezárása
session_start();

session_destroy();

header(
    "Location: ../login.html"
);

exit;
