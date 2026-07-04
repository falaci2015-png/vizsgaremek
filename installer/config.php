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
define("PROJECT_ROOT", dirname(__DIR__));
define("INSTALLER_VERSION", "1.1");

$isLocalhost =
    $_SERVER["HTTP_HOST"] === "localhost" ||
    $_SERVER["HTTP_HOST"] === "127.0.0.1" ||
    substr($_SERVER["HTTP_HOST"], 0, 10) === "localhost:";

if ($isLocalhost) {
    $dbHost = "127.0.0.1";
    $dbUser = "root";
    $dbPassword = "";

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
} else {
    $dbHost = "sql208.infinityfree.com";
    $dbUser = "if0_41754972";
    $dbPassword = "infinity password";

    $games = [
        "lena" => [
            "database" => "if0_41754972_lena_game",
            "sql" => PROJECT_ROOT . "/lena/database/lena_game.sql"
        ],
        "beamer" => [
            "database" => "if0_41754972_beamer_racing",
            "sql" => PROJECT_ROOT . "/beamer-racing/database/beamer_racing.sql"
        ],
        "rail" => [
            "database" => "if0_41754972_rail_control",
            "sql" => PROJECT_ROOT . "/nora-rail-control/database/rail_control.sql"
        ],
        "redrock" => [
            "database" => "if0_41754972_redrock_ranch",
            "sql" => PROJECT_ROOT . "/redrock-ranch/database/redrock_ranch.sql"
        ]
    ];
}
