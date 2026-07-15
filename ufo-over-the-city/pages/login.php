<!DOCTYPE html>
<html lang="hu">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Bejelentkezés - UFO Over the City</title>

    <link
        rel="stylesheet"
        href="../css/login.css">

</head>

<body>

    <main class="login-page">

        <section class="login-panel">

            <h1>BEJELENTKEZÉS</h1>

            <p class="login-subtitle">

                UFO Over the City

            </p>

            <form id="login-form">

                <input
                    id="username"
                    type="text"
                    placeholder="Felhasználónév"
                    autocomplete="username"
                    required>

                <input
                    id="password"
                    type="password"
                    placeholder="Jelszó"
                    autocomplete="current-password"
                    required>

                <button
                    type="submit">

                    BELÉPÉS

                </button>

            </form>

            <p
                id="login-message"
                class="login-message">
            </p>

            <div class="login-links">

                <a href="../../index.php">
                    KILÉPÉS
                </a>

                <a href="register.php">
                    REGISZTRÁCIÓ
                </a>

            </div>

        </section>
        <!-- Mini HUD -->
        <aside class="login-status-box">

            <h3>RENDSZERÁLLAPOT</h3>

            <p>
                <span>Adatbázis:</span>
                <strong id="status-database">...</strong>
            </p>

            <p>
                <span>Felhasználók:</span>
                <strong id="status-users">...</strong>
            </p>

            <p>
                <span>Aktív játékosok:</span>
                <strong id="status-online">...</strong>
            </p>

        </aside>
    </main>

    <script src="../js/login.js"></script>

</body>

</html>