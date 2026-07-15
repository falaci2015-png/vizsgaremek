<?php
/*
|--------------------------------------------------------------------------
| Vizsgaremek - Automatikus rendszerellenőrzés
|--------------------------------------------------------------------------
| Az oldal megnyitásakor automatikusan ellenőrzi a telepítést.
| Ha szükséges, a később elkészülő installer automatikusan
| létrehozza a hiányzó adatbázisokat és táblákat.
|--------------------------------------------------------------------------
*/

require_once "installer/config.php";
require_once "installer/check.php";
?>
<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vizsgaremek – Játékgyűjtemény</title>

    <!-- Közös főmenü stíluslapjai -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/fbu.css">
</head>

<body>

    <!-- Főcím és FBU Team logó -->
    <header class="mainHeader">
        <h1 class="mainTitle">Vizsgaremek – Játékgyűjtemény</h1>

        <div class="fbuLogoBox">
            <img src="img/logo.png" alt="FBU TEAM" class="fbuSmallLogo">

            <div class="fbuBigLogoBox">
                <img src="img/nagy_logo.png" alt="FBU TEAM vizsgaremek logó" class="fbuBigLogo">
            </div>
        </div>

        <!-- Online információ -->
        <div class="infoIconBox">

            <img src="img/info.png"
                alt="Online információ"
                class="infoIcon">

            <div class="infoPopup">
                <h3>Online információ</h3>

                <h4>Gyorsítótár frissítése</h4>

                <p>
                    Ha a <strong>Belépés</strong> vagy
                    <strong>Regisztráció</strong> gomb első kattintásra nem reagál,
                    frissítsd az oldalt:
                </p>

                <p class="shortcut">CTRL + SHIFT + R</p>

                <p>vagy</p>

                <p class="shortcut">CTRL + F5</p>

                <p class="smallText">
                    Ez a böngésző gyorsítótára miatt fordulhat elő.
                </p>

                <hr>

                <h4>A Vizsgaremekről</h4>

                <ul>
                    <li>4 önálló webböngészős játékgyűjtemény</li>
                    <li>Külön felhasználókezelés minden játékhoz</li>
                    <li>Saját adatbázis és online ranglista játékonként</li>
                    <li>Automatikus rendszerellenőrzés indításkor</li>
                </ul>

                <hr>

                <h4>Rendszerinformáció</h4>

                <p>
                    A kezdőoldalon megjelenő információk automatikusan frissülnek.
                </p>

                <ul>
                    <li>Adatbázis állapota</li>
                    <li>Regisztrált felhasználók száma</li>
                    <li>Aktív játékosok száma</li>
                </ul>

                <hr>

                <h4>F.B.U. Team</h4>

                <p>
                    A Vizsgaremek a <strong>Szoftverfejlesztő és tesztelő</strong>
                    szakmai vizsga keretében készült.
                </p>

                <p class="smallText">
                    Köszönjük, hogy kipróbálod játékainkat!
                </p>
            </div>

        </div>
        <!-- +1 bónuszjáték ikon -->
        <div class="bonusGameBox">

            <button
                class="bonusGameIcon"
                type="button"
                aria-label="UFO Over the City bónuszjáték">

                <span class="bonusPlus">+1</span>

                <span class="bonusLabel">BONUSZ</span>

            </button>

            <div class="bonusGamePopup">

                <p class="bonusEyebrow">
                    F.B.U. TEAM – EXTRA JÁTÉK
                </p>

                <h3>UFO Over the City</h3>

                <p>
                    Irányíts egy idegen űrhajót, repülj végig
                    az adatbázisból felépített városok felett,
                    és hajts végre minél több sikeres elrablást.
                </p>

                <ul>
                    <li>Saját felhasználói rendszer</li>
                    <li>Online ranglista</li>
                    <li>Város- és pályaszerkesztő</li>
                    <li>Adminisztrációs felület</li>
                </ul>

                <a
                    class="bonusStartButton"
                    href="ufo-over-the-city/index.php">

                    BÓNUSZJÁTÉK INDÍTÁSA

                </a>

            </div>

        </div>

    </header>

    <!-- A négy játék indítópanelje -->
    <main class="gameGrid">

        <section class="gamePanel lenaPanel">
            <div class="panelContent panelWithStatus">
                <div class="gameInfo">
                    <h2>Léna – The Endless Worlds</h2>
                    <p>Platformjáték több világgal, különféle ellenfelekkel, főellenségekkel és online ranglistával.</p>
                    <a class="startBtn" href="lena/login.html">Játék indítása</a>
                </div>

                <!-- Léna játék saját állapotpanelje -->
                <div class="statusBox">
                    <p><span>Adatbázis:</span> <strong><?= $gameStatuses["lena"]["database"] ?></strong></p>
                    <p><span>Felhasználók:</span> <strong><?= $gameStatuses["lena"]["users"] ?></strong></p>
                    <p><span>Aktív játékosok:</span> <strong><?= $gameStatuses["lena"]["activeUsers"] ?></strong></p>
                </div>
            </div>
        </section>

        <section class="gamePanel beamerPanel">
            <div class="panelContent panelWithStatus">
                <div class="gameInfo">
                    <h2>Beamer Racing</h2>
                    <p>Felülnézetes autóverseny pénzgyűjtéssel, akadályokkal, időméréssel és online ranglistával.</p>
                    <a class="startBtn" href="beamer-racing/login.html">Játék indítása</a>
                </div>
                <!-- Beamer Racing saját állapotpanelje -->
                <div class="statusBox">
                    <p><span>Adatbázis:</span> <strong><?= $gameStatuses["beamer"]["database"] ?></strong></p>
                    <p><span>Felhasználók:</span> <strong><?= $gameStatuses["beamer"]["users"] ?></strong></p>
                    <p><span>Aktív játékosok:</span> <strong><?= $gameStatuses["beamer"]["activeUsers"] ?></strong></p>
                </div>
            </div>
        </section>

        <section class="gamePanel railPanel">
            <div class="panelContent panelWithStatus">
                <div class="gameInfo">
                    <h2>Nóra – Rail Control</h2>
                    <p>Vasúti forgalomirányító stratégiai játék váltókkal, jelzőkkel és növekvő nehézséggel.</p>
                    <a class="startBtn" href="nora-rail-control/login.html">Játék indítása</a>
                </div>
                <!-- Rail Control saját állapotpanelje -->
                <div class="statusBox">
                    <p><span>Adatbázis:</span> <strong><?= $gameStatuses["rail"]["database"] ?></strong></p>
                    <p><span>Felhasználók:</span> <strong><?= $gameStatuses["rail"]["users"] ?></strong></p>
                    <p><span>Aktív játékosok:</span> <strong><?= $gameStatuses["rail"]["activeUsers"] ?></strong></p>
                </div>
            </div>
        </section>

        <section class="gamePanel redrockPanel">
            <div class="panelContent panelWithStatus">
                <div class="gameInfo">
                    <h2>Redrock Ranch</h2>
                    <p>Western lövöldözős ügyességi játék banditákkal, gyors reakciókkal és pontgyűjtéssel.</p>
                    <a class="startBtn" href="redrock-ranch/login.html">Játék indítása</a>
                </div>
                <!-- Redrock Ranch saját állapotpanelje -->
                <div class="statusBox">
                    <p><span>Adatbázis:</span> <strong><?= $gameStatuses["redrock"]["database"] ?></strong></p>
                    <p><span>Felhasználók:</span> <strong><?= $gameStatuses["redrock"]["users"] ?></strong></p>
                    <p><span>Aktív játékosok:</span> <strong><?= $gameStatuses["redrock"]["activeUsers"] ?></strong></p>
                </div>
            </div>
        </section>

    </main>

</body>

</html>