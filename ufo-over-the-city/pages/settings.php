<?php

session_start();

// A beállításokat csak bejelentkezett felhasználó érheti el
if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}

$username = htmlspecialchars(
    $_SESSION["username"] ?? "Játékos",
    ENT_QUOTES,
    "UTF-8"
);

?>

<!DOCTYPE html>
<html lang="hu">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Beállítások – UFO Over the City</title>

    <link
        rel="stylesheet"
        href="../css/settings.css">

</head>

<body>

    <main class="settings-page">

        <section class="settings-panel">

            <header class="settings-header">

                <h1>BEÁLLÍTÁSOK</h1>

                <p>
                    Bejelentkezve:
                    <strong><?= $username ?></strong>
                </p>

            </header>

            <!-- Játékbeállítások -->
            <section class="settings-section">

                <h2>Játékbeállítások</h2>

                <!-- Háttérzene kapcsoló -->
                <div class="setting-row">

                    <div class="setting-text">

                        <label for="music-enabled">
                            Háttérzene
                        </label>

                        <p>
                            A játék háttérzenéjének ki- vagy bekapcsolása.
                        </p>

                    </div>

                    <label class="switch">

                        <input
                            id="music-enabled"
                            type="checkbox"
                            checked>

                        <span class="switch-slider"></span>

                    </label>

                </div>

                <!-- Hangeffektek kapcsoló -->
                <div class="setting-row">

                    <div class="setting-text">

                        <label for="effects-enabled">
                            Hangeffektek
                        </label>

                        <p>
                            Az UFO, a sugár és a többi effekt hangjának
                            ki- vagy bekapcsolása.
                        </p>

                    </div>

                    <label class="switch">

                        <input
                            id="effects-enabled"
                            type="checkbox"
                            checked>

                        <span class="switch-slider"></span>

                    </label>

                </div>

                <div class="setting-row">

                    <div class="setting-text">

                        <label for="city-select">
                            Város
                        </label>

                        <p>
                            Válaszd ki, melyik városban szeretnél játszani.
                        </p>

                    </div>

                    <select id="city-select">

                        <option value="">
                            Városok betöltése...
                        </option>

                    </select>

                </div>

                <div class="setting-row">

                    <div class="setting-text">

                        <label for="background-select">
                            Háttér
                        </label>

                        <p>
                            Válaszd ki a városhoz tartozó égboltot.
                        </p>

                    </div>

                    <select id="background-select">

                        <option value="">
                            Hátterek betöltése...
                        </option>

                    </select>

                </div>

                <div class="setting-row">

                    <div class="setting-text">

                        <label for="difficulty-select">
                            Nehézségi szint
                        </label>

                        <p>
                            A nehézség később az emberek megjelenését,
                            a mozgást és a pontozást befolyásolja.
                        </p>

                    </div>

                    <select id="difficulty-select">

                        <option value="easy">
                            Könnyű
                        </option>

                        <option
                            value="normal"
                            selected>
                            Normál
                        </option>

                        <option value="hard">
                            Nehéz
                        </option>

                        <option value="brutal">
                            Brutális
                        </option>

                    </select>

                </div>
                <div class="setting-row">

                    <div class="setting-text">

                        <label for="game-time-select">
                            Játékidő
                        </label>

                        <p>
                            Válaszd ki, hogy egy játék hány másodpercig tartson.
                        </p>

                    </div>

                    <select id="game-time-select">

                        <option value="30">
                            30 másodperc
                        </option>

                        <option value="60" selected>
                            60 másodperc
                        </option>

                        <option value="90">
                            90 másodperc
                        </option>

                        <option value="120">
                            120 másodperc
                        </option>

                    </select>

                </div>
                <button
                    id="save-game-settings"
                    class="settings-button"
                    type="button">

                    JÁTÉKBEÁLLÍTÁSOK MENTÉSE

                </button>

                <p
                    id="game-settings-message"
                    class="settings-message">
                </p>

            </section>

            <!-- Saját jelszó módosítása -->
            <section class="settings-section">

                <h2>Jelszó módosítása</h2>

                <form id="password-form">

                    <label for="old-password">
                        Régi jelszó
                    </label>

                    <input
                        id="old-password"
                        type="password"
                        autocomplete="current-password"
                        required>

                    <label for="new-password">
                        Új jelszó
                    </label>

                    <input
                        id="new-password"
                        type="password"
                        autocomplete="new-password"
                        required>

                    <label for="new-password-again">
                        Új jelszó újra
                    </label>

                    <input
                        id="new-password-again"
                        type="password"
                        autocomplete="new-password"
                        required>

                    <button
                        class="settings-button"
                        type="submit">

                        JELSZÓ MÓDOSÍTÁSA

                    </button>

                </form>

                <p
                    id="password-message"
                    class="settings-message">
                </p>

            </section>

            <a
                class="back-button"
                href="menu.php">

                VISSZA A FŐMENÜBE

            </a>

        </section>

    </main>

    <script src="../js/settings.js"></script>

</body>

</html>