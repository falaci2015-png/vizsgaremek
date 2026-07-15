// Regisztrációs űrlap
const registerForm = document.getElementById("register-form");

// Üzenet megjelenítése
const registerMessage = document.getElementById("register-message");

// Regisztráció
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value;

  const passwordAgain = document.getElementById("password-again").value;

  registerMessage.style.color = "#ffd36b";
  registerMessage.textContent = "";

  // Két jelszó egyezése
  if (password !== passwordAgain) {
    registerMessage.style.color = "#ffb3b3";
    registerMessage.textContent = "A két jelszó nem egyezik.";

    return;
  }

  try {
    const response = await fetch("../backend/register.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username: username,

        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      registerMessage.style.color = "#8fff8f";

      registerMessage.textContent = "Sikeres regisztráció! Átirányítás...";

      // Kis várakozás, hogy a felhasználó el tudja olvasni
      setTimeout(() => {
        window.location.href = "login.php";
      }, 1000);
    } else {
      registerMessage.style.color = "#ffb3b3";

      registerMessage.textContent = data.message;
    }
  } catch (error) {
    console.error(error);

    registerMessage.style.color = "#ffb3b3";

    registerMessage.textContent = "Kapcsolódási hiba.";
  }
});
