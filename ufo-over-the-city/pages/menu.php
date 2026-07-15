<?php

session_start();

// Csak bejelentkezett felhasználó láthatja
if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}

$username = htmlspecialchars(
    $_SESSION["username"],
    ENT_QUOTES,
    "UTF-8"
);

$isAdmin =
    isset($_SESSION["role"]) &&
    $_SESSION["role"] === "admin";

?>

<!DOCTYPE html>
<html lang="hu">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>UFO Over the City</title>

    <link
        rel="stylesheet"
        href="../css/index.css">

</head>

<body>

    <main class="menu-page">

        <section class="menu-panel">

            <h1>UFO OVER THE CITY</h1>

            <p class="menu-subtitle">

                Üdvözöllek,
                <strong><?= $username ?></strong>!

            </p>

            <nav class="menu-buttons">

                <a
                    class="menu-button primary-button"
                    href="game.php">

                    JÁTÉK INDÍTÁSA

                </a>

                <a
                    class="menu-button"
                    href="settings.php">

                    BEÁLLÍTÁSOK

                </a>

                <a
                    class="menu-button"
                    href="leaderboard.php">

                    RANGLISTA

                </a>

                <a
                    class="menu-button"
                    href="description.php">

                    LEÍRÁS

                </a>

                <?php if ($isAdmin): ?>

                    <a
                        class="menu-button"
                        href="admin.php">

                        ADMIN

                    </a>

                <?php endif; ?>
                <a
                    class="menu-button"
                    href="../../index.php">

                    KILÉPÉS

                </a>
                <button
                    id="logout-button"
                    class="menu-button">

                    KIJELENTKEZÉS

                </button>

            </nav>

            <p class="menu-note">

                A várost idegen erők támadták meg.

            </p>

        </section>

    </main>

    <script src="../js/menu.js"></script>

</body>

</html>