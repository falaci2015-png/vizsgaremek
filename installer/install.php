<?php
/*
|--------------------------------------------------------------------------
| Automatikus adatbázis telepítő
|--------------------------------------------------------------------------
| Ez a fájl hozza létre a hiányzó játék-adatbázisokat.
| A táblák és az alapadatok importálása a következő lépés lesz.
|--------------------------------------------------------------------------
*/

require_once __DIR__ . "/config.php";

/**
 * Kapcsolódás a MySQL szerverhez adatbázisnév nélkül.
 * Így akkor is tudunk adatbázist létrehozni, ha az még nem létezik.
 */
function getServerConnection()
{
    $host = "localhost";
    $user = "root";
    $password = "";

    return new PDO(
        "mysql:host=$host;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );
}

/**
 * Hiányzó adatbázis létrehozása.
 */
function createDatabaseIfMissing($pdo, $databaseName)
{
    $pdo->exec(
        "CREATE DATABASE IF NOT EXISTS `$databaseName`
         CHARACTER SET utf8mb4
         COLLATE utf8mb4_hungarian_ci"
    );
}

/**
 * Az összes játék adatbázisának ellenőrzése/létrehozása.
 */
function installMissingDatabases($games)
{
    $pdo = getServerConnection();

    foreach ($games as $game) {
        createDatabaseIfMissing($pdo, $game["database"]);
    }
}
/*
|--------------------------------------------------------------------------
| Megvizsgálja, hogy létezik-e egy adott tábla.
|--------------------------------------------------------------------------
| Ha a users tábla már létezik, akkor feltételezzük, hogy
| az adott játék adatbázisa már telepítve van.
|--------------------------------------------------------------------------
*/
function tableExists($databaseName, $tableName)
{
    try {

        $pdo = new PDO(
            "mysql:host=localhost;dbname=$databaseName;charset=utf8mb4",
            "root",
            "",
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]
        );

        $stmt = $pdo->prepare("
            SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_schema = ?
              AND table_name = ?
        ");

        $stmt->execute([
            $databaseName,
            $tableName
        ]);

        return $stmt->fetchColumn() > 0;
    } catch (PDOException $e) {

        return false;
    }
}
/*
|--------------------------------------------------------------------------
| SQL fájl importálása
|--------------------------------------------------------------------------
| Beolvassa a játékhoz tartozó SQL fájlt, eltávolítja belőle
| a CREATE DATABASE és USE sorokat, majd lefuttatja a táblák
| és alapadatok létrehozását.
|--------------------------------------------------------------------------
*/
function importSqlFile($databaseName, $sqlFilePath)
{
    if (!file_exists($sqlFilePath)) {
        return false;
    }

    $sql = file_get_contents($sqlFilePath);

    // UTF-8 BOM eltávolítása, ha van
    $sql = preg_replace('/^\xEF\xBB\xBF/', '', $sql);

    // CREATE DATABASE sorok eltávolítása
    $sql = preg_replace(
        '/CREATE\s+DATABASE\s+.*?;/is',
        '',
        $sql
    );

    // USE adatbázisnév sorok eltávolítása
    $sql = preg_replace(
        '/USE\s+`?.*?`?\s*;/is',
        '',
        $sql
    );

    $pdo = new PDO(
        "mysql:host=localhost;dbname=$databaseName;charset=utf8mb4",
        "root",
        "",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );

    /*
     * Az SQL fájlt utasításonként futtatjuk.
     * A DELIMITER nem SQL utasítás, hanem phpMyAdmin/MySQL kliens parancs,
     * ezért a PHP külön kezeli a triggerek $$ lezárását.
     */
    $delimiter = ";";
    $statement = "";

    $lines = preg_split('/\R/', $sql);

    foreach ($lines as $line) {
        $trimmedLine = trim($line);

        // DELIMITER $$ vagy DELIMITER ; felismerése
        if (preg_match('/^DELIMITER\s+(.+)$/i', $trimmedLine, $matches)) {
            $delimiter = trim($matches[1]);
            continue;
        }

        $statement .= $line . PHP_EOL;

        $trimmedStatement = rtrim($statement);

        if (
            $trimmedStatement !== "" &&
            str_ends_with($trimmedStatement, $delimiter)
        ) {
            // Az aktuális lezárójel eltávolítása
            $statementToRun = substr(
                $trimmedStatement,
                0,
                -strlen($delimiter)
            );

            $statementToRun = trim($statementToRun);

            if ($statementToRun !== "") {
                $pdo->exec($statementToRun);
            }

            $statement = "";
        }
    }

    // Biztonsági futtatás, ha maradt lezáratlan utasítás
    $remainingStatement = trim($statement);

    if ($remainingStatement !== "") {
        $pdo->exec($remainingStatement);
    }

    return true;
}
