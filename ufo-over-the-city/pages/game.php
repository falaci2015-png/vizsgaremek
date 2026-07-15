<?php

session_start();

// Ha nincs bejelentkezve, visszairányítás a login oldalra
if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}

?>
<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <title>UFO Over the City</title>

    <link rel="stylesheet" href="../css/game.css">
</head>

<body>

    <div id="game-wrapper">
        <div id="world">
            <!-- Felső HUD -->
            <div id="game-hud">

                <!-- Bal oldali HUD: pontszám és idő -->
                <section class="hud-panel hud-left">

                    <div class="hud-line">
                        <span>PONTSZÁM</span>
                        <strong id="score-value">0</strong>
                    </div>

                    <div class="hud-line">
                        <span>IDŐ</span>
                        <strong id="time-value">--</strong>
                    </div>

                </section>

                <!-- Középső HUD: rendőrségi figyelmeztetés -->
                <section class="hud-panel hud-center">

                    <div id="police-alert" class="police-alert">

                        <span id="police-alert-text">
                            FIGYELEM! UFO-K LEPTÉK EL A VÁROST! MINDENKI HAGYJA EL AZ UTCÁKAT!
                        </span>

                    </div>

                </section>

                <!-- Jobb oldali HUD: játékadatok és visszalépés -->
                <section class="hud-panel hud-right">

                    <div class="hud-line hud-city-line">
                        <strong
                            id="city-name"
                            title="Metropolis">
                            Metropolis
                        </strong>
                    </div>

                    <div class="hud-line hud-difficulty-line">
                        <strong id="difficulty-value">
                            Normál
                        </strong>
                    </div>

                    <a
                        id="menu-button"
                        class="hud-menu-button"
                        href="menu.php">

                        MENÜ

                    </a>

                </section>

            </div>
            <!-- A házak és az út együtt mozgó rétege -->
            <div id="moving-city">

                <div id="road"></div>

                <div id="city"></div>

            </div>
            <!-- UFO -->
            <img
                id="ufo"
                src="../assets/ufo/ufo_01.png"
                alt="UFO">
            <!-- UFO energiasugár -->
            <div id="ufo-beam"></div>
            <!-- Játék vége panel -->
            <section id="game-over-overlay" class="game-over-overlay">

                <div class="game-over-panel">

                    <h1>JÁTÉK VÉGE</h1>

                    <p class="game-over-result">
                        Elrabolt emberek:
                        <strong id="final-score">0</strong>
                    </p>

                    <p
                        id="score-save-message"
                        class="score-save-message">
                    </p>

                    <div class="game-over-buttons">

                        <a
                            class="game-over-button"
                            href="game.php">

                            ÚJ JÁTÉK

                        </a>

                        <a
                            class="game-over-button"
                            href="menu.php">

                            FŐMENÜ

                        </a>

                        <a
                            class="game-over-button"
                            href="leaderboard.php">

                            RANGLISTA

                        </a>

                        <a
                            class="game-over-button game-over-exit-button"
                            href="../../index.php">

                            KILÉPÉS A JÁTÉKGYŰJTEMÉNYBE

                        </a>

                    </div>

                </div>

            </section>
        </div>
    </div>

    <script src="../js/game.js"></script>

</body>

</html>