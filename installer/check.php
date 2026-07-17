<?php
/*
|--------------------------------------------------------------------------
| Rendszerellenőrzés
|--------------------------------------------------------------------------
| Ez a fájl gyűjti össze a négy játék állapotadatait.
| Később innen kapja majd a főmenü a külön státuszablakok adatait.
|--------------------------------------------------------------------------
*/

// A játékok alapértelmezett állapotadatai
/*
|--------------------------------------------------------------------------
| Automatikus adatbázis ellenőrzés
|--------------------------------------------------------------------------
| Az oldal betöltésekor ellenőrzi, hogy minden játék adatbázisa
| létezik-e. Ha valamelyik hiányzik, automatikusan létrehozza.
|--------------------------------------------------------------------------
*/
require_once __DIR__ . "/config.php";

if ($isLocalhost) {
    require_once __DIR__ . "/install.php";
    installMissingDatabases($games);
}

// Hiányzó adatbázisok automatikus létrehozása
/*
|--------------------------------------------------------------------------
| Telepítési állapot ellenőrzése
|--------------------------------------------------------------------------
| Megvizsgáljuk, hogy minden játék rendelkezik-e users táblával.
| Ha nincs, akkor később automatikusan importálni fogjuk a SQL fájlt.
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Hiányzó táblák automatikus importálása
|--------------------------------------------------------------------------
| Ha egy játék adatbázisában nincs users tábla, akkor lefuttatjuk
| a hozzá tartozó SQL fájlt. Ez csak hiányzó telepítésnél történik meg.
|--------------------------------------------------------------------------
*/

if ($isLocalhost) {

    $needsInstall = [];

    foreach ($games as $key => $game) {

        $needsInstall[$key] =
            !tableExists(
                $game["database"],
                "users"
            );
    }

    foreach ($games as $key => $game) {

        if ($needsInstall[$key]) {

            importSqlFile(
                $game["database"],
                $game["sql"]
            );
        }
    }
}
/*
|--------------------------------------------------------------------------
| Felhasználószám lekérdezése
|--------------------------------------------------------------------------
| Minden játék saját adatbázisából kiolvassuk,
| hány regisztrált felhasználó van.
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Adatbázis-kapcsolat ellenőrzése
|--------------------------------------------------------------------------
| Csak akkor jelenítünk meg Aktív állapotot,
| ha az adott adatbázishoz valóban sikerült kapcsolódni.
|--------------------------------------------------------------------------
*/
function isDatabaseActive($databaseName)
{
    try {
        new PDO(
            "mysql:host=" . $GLOBALS["dbHost"] .
                ";dbname=$databaseName;charset=utf8mb4",
            $GLOBALS["dbUser"],
            $GLOBALS["dbPassword"],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]
        );

        return true;
    } catch (PDOException $e) {
        return false;
    }
}
function getUserCount($databaseName)
{
    try {
        $pdo = new PDO(
            "mysql:host=" . $GLOBALS["dbHost"] . ";dbname=$databaseName;charset=utf8mb4",
            $GLOBALS["dbUser"],
            $GLOBALS["dbPassword"],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

        $stmt = $pdo->query("SELECT COUNT(*) FROM users");
        return (int)$stmt->fetchColumn();
    } catch (PDOException $e) {
        return 0;
    }
}
/*
|--------------------------------------------------------------------------
| Aktív felhasználók számának lekérdezése
|--------------------------------------------------------------------------
| Azokat számolja aktívnak, akik be vannak jelentkezve,
| és az elmúlt 5 percben volt friss aktivitásuk.
|--------------------------------------------------------------------------
*/

function getActiveUserCount($databaseName)
{
    try {
        $pdo = new PDO(
            "mysql:host=" . $GLOBALS["dbHost"] . ";dbname=$databaseName;charset=utf8mb4",
            $GLOBALS["dbUser"],
            $GLOBALS["dbPassword"],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

        $stmt = $pdo->query("
            SELECT COUNT(*)
            FROM users
            WHERE is_online = 1
              AND last_active >= NOW() - INTERVAL 5 MINUTE
        ");

        return (int)$stmt->fetchColumn();
    } catch (PDOException $e) {
        return 0;
    }
}

/*
|--------------------------------------------------------------------------
| Játékok állapotadatai
|--------------------------------------------------------------------------
| Ezek az adatok jelennek meg a négy miniHUD-ban.
|--------------------------------------------------------------------------
*/

$gameStatuses = [];

foreach ($games as $key => $game) {
    $databaseActive = isDatabaseActive($game["database"]);

    $gameStatuses[$key] = [
        "database" => $databaseActive ? "Aktív" : "Hiba",

        "users" => $databaseActive
            ? getUserCount($game["database"])
            : 0,

        "activeUsers" => $databaseActive
            ? getActiveUserCount($game["database"])
            : 0
    ];
}
