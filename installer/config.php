<?php
/*
|--------------------------------------------------------------------------
| Közös telepítő beállítások
|--------------------------------------------------------------------------
| Ez a fájl tartalmazza a telepítő rendszer közös beállításait.
| Később innen fogja használni minden installer fájl ugyanazokat
| az adatokat, így nem kell több helyen módosítani.
|--------------------------------------------------------------------------
*/

// A projekt főkönyvtára
define("PROJECT_ROOT", dirname(__DIR__));

// Installer verzió
define("INSTALLER_VERSION", "1.0");
/*
|--------------------------------------------------------------------------
| Vizsgaremek játékok adatbázis beállításai
|--------------------------------------------------------------------------
| Minden játék adatbázisának neve és a hozzá tartozó SQL fájl.
| Az installer ezeket fogja használni automatikus telepítéskor.
|--------------------------------------------------------------------------
*/

$games = [

    "lena" => [
        "database" => "lena_game",
        "sql" => PROJECT_ROOT . "/lena/database/lena_game.sql"
    ],

    "beamer" => [
        "database" => "beamer_racing",
        "sql" => PROJECT_ROOT . "/beamer-racing/database/beamer_racing.sql"
    ],

    "rail" => [
        "database" => "rail_control",
        "sql" => PROJECT_ROOT . "/nora-rail-control/database/rail_control.sql"
    ],

    "redrock" => [
        "database" => "redrock_ranch",
        "sql" => PROJECT_ROOT . "/redrock-ranch/database/redrock_ranch.sql"
    ]

];
