<!DOCTYPE html>
<html lang="hu">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Regisztráció - UFO Over the City</title>

    <link
        rel="stylesheet"
        href="../css/register.css">

</head>

<body>

    <main class="register-page">

        <section class="register-panel">

            <h1>REGISZTRÁCIÓ</h1>

            <p class="register-subtitle">
                Új játékos létrehozása
            </p>

            <form id="register-form">

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
                    autocomplete="new-password"
                    required>

                <input
                    id="password-again"
                    type="password"
                    placeholder="Jelszó újra"
                    autocomplete="new-password"
                    required>

                <button type="submit">
                    REGISZTRÁCIÓ
                </button>

            </form>

            <p
                id="register-message"
                class="register-message">
            </p>

            <div class="register-links">

                <a href="../../index.php">
                    KILÉPÉS
                </a>

                <a href="login.php">
                    BEJELENTKEZÉS
                </a>

            </div>

        </section>

    </main>

    <script src="../js/register.js"></script>

</body>

</html>