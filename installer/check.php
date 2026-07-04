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
require_once __DIR__ . "/install.php";

// Hiányzó adatbázisok automatikus létrehozása
installMissingDatabases($games);
/*
|--------------------------------------------------------------------------
| Telepítési állapot ellenőrzése
|--------------------------------------------------------------------------
| Megvizsgáljuk, hogy minden játék rendelkezik-e users táblával.
| Ha nincs, akkor később automatikusan importálni fogjuk a SQL fájlt.
|--------------------------------------------------------------------------
*/

$needsInstall = [];

foreach ($games as $key => $game) {

    $needsInstall[$key] =
        !tableExists(
            $game["database"],
            "users"
        );
}
/*
|--------------------------------------------------------------------------
| Hiányzó táblák automatikus importálása
|--------------------------------------------------------------------------
| Ha egy játék adatbázisában nincs users tábla, akkor lefuttatjuk
| a hozzá tartozó SQL fájlt. Ez csak hiányzó telepítésnél történik meg.
|--------------------------------------------------------------------------
*/

foreach ($games as $key => $game) {

    if ($needsInstall[$key]) {

        importSqlFile(
            $game["database"],
            $game["sql"]
        );
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

function getUserCount($databaseName)
{
    try {
        $pdo = new PDO(
            "mysql:host=localhost;dbname=$databaseName;charset=utf8mb4",
            "root",
            "",
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
            "mysql:host=localhost;dbname=$databaseName;charset=utf8mb4",
            "root",
            "",
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
    $gameStatuses[$key] = [
        "database" => "Aktív",
        "users" => getUserCount($game["database"]),
        "activeUsers" => getActiveUserCount($game["database"])
    ];
}
