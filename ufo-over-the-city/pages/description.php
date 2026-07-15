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

    <title>Leírás - UFO Over the City</title>

    <link rel="stylesheet" href="../css/description.css">

</head>

<body>

    <div class="description-container">

        <h1>🛸 UFO OVER THE CITY</h1>

        <h2>VÉSZJELENTÉS</h2>

        <section>

            <h3>AZ ESEMÉNY</h3>

            <p>
                Az elmúlt órákban több város felett ismeretlen eredetű
                repülő objektumokat észleltek. A szemtanúk szerint az
                objektumok hangtalanul lebegnek az épületek felett,
                majd különös energiasugarukkal embereket emelnek fel
                a tetőkről.
            </p>

            <p>
                A hatóságok egyelőre nem tudják megállítani a jelenséget.
                A lakosság pánikban van, a városok kiürítése folyamatban
                van, azonban sokan még mindig az épületek tetején
                rekedtek.
            </p>

        </section>

        <section>

            <h3>KÜLDETÉS</h3>

            <p>
                Vedd át egy idegen felderítő UFO irányítását, és repülj
                végig a város felett.
            </p>

            <p>
                Célod, hogy minél több embert rabolj el, mielőtt lejár
                a rendelkezésre álló idő.
            </p>

        </section>

        <section>

            <h3>IRÁNYÍTÁS</h3>

            <ul>

                <li><strong>W</strong> vagy <strong>↑</strong> – UFO lefelé</li>

                <li><strong>S</strong> vagy <strong>↓</strong> – UFO felfelé</li>

                <li><strong>SHIFT</strong> – Gyorsabb repülés</li>

                <li><strong>SPACE</strong> – Energiasugár</li>

            </ul>

        </section>

        <section>

            <h3>FONTOS TUDNIVALÓK</h3>

            <ul>

                <li>Az energiasugár csak álló helyzetben működik.</li>

                <li>Az elrablás néhány másodpercig tart.</li>

                <li>A sikeres elrablások felkerülnek az online ranglistára.</li>

                <li>Azonos elrablásszám esetén a rövidebb idő a jobb.</li>

            </ul>

        </section>

        <section>

            <h3>SOK SIKERT!</h3>

            <p class="ending-text">

                A Föld sorsa már nem rajtad múlik...<br>

                <strong>...de az idegen invázió sikere igen.</strong>

            </p>

        </section>

        <div class="description-buttons">

            <button onclick="location.href='menu.php'">

                VISSZA

            </button>

        </div>

        <!-- Kis F.B.U. logó -->
        <img
            src="../../img/logo.png"
            alt="F.B.U. Team"
            class="fbu-logo-small">

        <!-- Nagy F.B.U. logó -->
        <img
            src="../../img/nagy_logo.png"
            alt="F.B.U. Team"
            class="fbu-logo-large">

    </div>

</body>

</html>