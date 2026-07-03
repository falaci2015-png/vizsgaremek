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