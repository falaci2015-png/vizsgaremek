<?php
session_start();

if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <title>Ranglista - UFO Over the City</title>

    <link rel="stylesheet" href="../css/leaderboard.css">
</head>

<body
    data-is-admin="<?= ($_SESSION["role"] ?? "") === "admin" ? "1" : "0" ?>">

    <div class="leaderboard-container">

        <!-- Oldal címe -->
        <h1>🏆 RANGLISTA</h1>

        <p class="subtitle">
            Az UFO Over the City legjobb játékosai
        </p>

        <!-- Ranglista -->
        <table id="leaderboard-table">

            <thead>

                <tr>

                    <th>#</th>

                    <th>Játékos</th>

                    <th>Város</th>

                    <th>Elrablások</th>

                    <th>Idő</th>

                    <th>Dátum</th>

                    <?php if ($_SESSION["role"] === "admin"): ?>

                        <th>Művelet</th>

                    <?php endif; ?>

                </tr>

            </thead>

            <tbody>

                <!-- JavaScript tölti fel -->

            </tbody>

        </table>

        <!-- Gombok -->
        <div class="buttons">

            <button id="refresh-button">
                FRISSÍTÉS
            </button>

            <button
                onclick="window.location.href='menu.php'">

                VISSZA A MENÜBE

            </button>

        </div>

    </div>

    <script src="../js/leaderboard.js"></script>

</body>

</html>