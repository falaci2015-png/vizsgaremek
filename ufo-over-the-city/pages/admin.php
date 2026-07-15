<?php

session_start();

// Csak bejelentkezett admin nyithatja meg az oldalt
if (
    !isset($_SESSION["user_id"]) ||
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    header("Location: login.php");
    exit;
}

$username = htmlspecialchars(
    $_SESSION["username"] ?? "Admin",
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

    <title>Admin panel – UFO Over the City</title>

    <link
        rel="stylesheet"
        href="../css/admin.css">
</head>

<body>

    <div class="admin-page">

        <aside class="admin-sidebar">

            <div class="admin-title">

                <h1>UFO ADMIN</h1>

                <p>
                    Bejelentkezve:
                    <strong><?= $username ?></strong>
                </p>

            </div>

            <nav class="admin-menu">

                <button
                    class="admin-menu-button active"
                    type="button"
                    data-section="stats">
                    STATISZTIKA
                </button>

                <button
                    class="admin-menu-button"
                    type="button"
                    data-section="users">
                    FELHASZNÁLÓK
                </button>

                <button
                    class="admin-menu-button"
                    type="button"
                    data-section="scores">
                    RANGLISTA
                </button>

                <button
                    class="admin-menu-button"
                    type="button"
                    data-section="cities">
                    VÁROSOK
                </button>

            </nav>

            <div class="admin-sidebar-bottom">

                <a
                    class="admin-link"
                    href="menu.php">
                    VISSZA A FŐMENÜBE
                </a>

                <button
                    id="logout-button"
                    class="admin-link logout-button"
                    type="button">
                    KIJELENTKEZÉS
                </button>

            </div>

        </aside>

        <main class="admin-content">

            <header class="admin-content-header">

                <h2 id="section-title">
                    Statisztika
                </h2>

                <p>
                    UFO Over the City vezérlőpult
                </p>

            </header>

            <section
                id="stats-section"
                class="admin-section active">

                <div class="stats-grid">

                    <article class="stat-card">

                        <h3>Felhasználók</h3>

                        <p id="user-count">
                            0
                        </p>

                    </article>

                    <article class="stat-card">

                        <h3>Adminok</h3>

                        <p id="admin-count">
                            0
                        </p>

                    </article>

                    <article class="stat-card">

                        <h3>Online</h3>

                        <p id="online-count">
                            0
                        </p>

                    </article>

                    <article class="stat-card">

                        <h3>Eredmények</h3>

                        <p id="score-count">
                            0
                        </p>

                    </article>

                </div>

            </section>

            <section
                id="users-section"
                class="admin-section">

                <div class="admin-data-panel">

                    <div class="admin-section-heading">

                        <div>
                            <h3>Felhasználók kezelése</h3>

                            <p>
                                Jogosultság módosítása és felhasználók törlése.
                            </p>
                        </div>

                        <button
                            id="refresh-users-button"
                            class="admin-action-button"
                            type="button">

                            FRISSÍTÉS

                        </button>

                    </div>

                    <p
                        id="users-message"
                        class="admin-message">
                    </p>

                    <div class="admin-table-wrapper">

                        <table class="admin-table">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Felhasználónév</th>
                                    <th>Jogosultság</th>
                                    <th>Regisztráció</th>
                                    <th>Műveletek</th>
                                </tr>

                            </thead>

                            <tbody id="users-table-body">

                                <!-- JavaScript tölti fel -->

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>

            <section
                id="scores-section"
                class="admin-section">

                <div class="section-placeholder">

                    <h3>Ranglista kezelése</h3>

                    <p>
                        Ide kerülnek majd a mentett eredmények.
                    </p>

                </div>

            </section>

            <section
                id="cities-section"
                class="admin-section">

                <div class="admin-data-panel">

                    <div class="admin-section-heading">

                        <div>
                            <h3>Városok és házsorrend</h3>

                            <p>
                                Minden város pontosan 20 épületből áll.
                            </p>
                        </div>

                        <button
                            id="new-city-button"
                            class="admin-action-button"
                            type="button">

                            ÚJ VÁROS

                        </button>

                    </div>

                    <p
                        id="cities-message"
                        class="admin-message">
                    </p>

                    <div class="city-editor-layout">

                        <div class="city-list-panel">

                            <h4>Városok</h4>

                            <div id="city-list">

                                <!-- JavaScript tölti fel -->

                            </div>

                        </div>

                        <div class="city-editor-panel">

                            <div class="city-editor-header">

                                <div class="city-name-field">

                                    <label for="city-name-input">
                                        Város neve
                                    </label>

                                    <input
                                        id="city-name-input"
                                        type="text"
                                        maxlength="40"
                                        autocomplete="off">

                                </div>

                                <div class="city-counter">

                                    Házak:
                                    <strong id="city-building-count">
                                        0 / 20
                                    </strong>

                                </div>

                            </div>

                            <div
                                id="city-buildings-list"
                                class="city-buildings-list">

                                <p class="city-empty-message">
                                    Válassz ki egy várost a szerkesztéshez.
                                </p>

                            </div>

                            <div class="city-editor-actions">

                                <button
                                    id="save-city-button"
                                    class="admin-action-button"
                                    type="button"
                                    disabled>

                                    VÁROS MENTÉSE

                                </button>

                                <button
                                    id="delete-city-button"
                                    class="admin-danger-button"
                                    type="button"
                                    disabled>

                                    VÁROS TÖRLÉSE

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>

    </div>
    <!-- Házválasztó ablak -->
    <div
        id="building-selector-modal"
        class="building-selector-modal">

        <div class="building-selector-window">

            <div class="building-selector-header">

                <div>
                    <h3>Ház kiválasztása</h3>

                    <p>
                        Válassz egyet a 30 rendelkezésre álló háztípus közül.
                    </p>
                </div>

                <button
                    id="close-building-selector"
                    class="building-selector-close"
                    type="button"
                    title="Bezárás">

                    ×

                </button>

            </div>

            <div
                id="building-selector-grid"
                class="building-selector-grid">

                <!-- JavaScript tölti fel a háztípusokat -->

            </div>

        </div>

    </div>

    <script src="../js/admin.js"></script>

</body>

</html>