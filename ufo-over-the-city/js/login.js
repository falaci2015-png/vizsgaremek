// Bejelentkezési űrlap
const loginForm = document.getElementById("login-form");

// Üzenet megjelenítése
const loginMessage = document.getElementById("login-message");
// Mini HUD
const statusDatabase = document.getElementById("status-database");

const statusUsers = document.getElementById("status-users");

const statusOnline = document.getElementById("status-online");

// Bejelentkezés
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value;

  loginMessage.textContent = "";

  try {
    const response = await fetch("../backend/login.php", {
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
      loginMessage.style.color = "#8fff8f";
      loginMessage.textContent = "Sikeres bejelentkezés...";

      // Kis várakozás a felhasználói élmény miatt
      setTimeout(() => {
        // Sikeres belépés után minden felhasználó a főmenübe kerül
        window.location.href = "menu.php";
      }, 500);
    } else {
      loginMessage.style.color = "#ffb3b3";
      loginMessage.textContent = data.message;
    }
  } catch (error) {
    console.error(error);

    loginMessage.style.color = "#ffb3b3";

    loginMessage.textContent = "Kapcsolódási hiba.";
  }
});
// **********************************************
// Rendszerállapot lekérése
// **********************************************
async function loadSystemStatus() {
  try {
    const response = await fetch("../backend/get_system_status.php");

    const data = await response.json();

    if (!data.success) {
      throw new Error();
    }

    statusDatabase.textContent = data.database;
    statusUsers.textContent = data.users;
    statusOnline.textContent = data.active_users;
  } catch {
    statusDatabase.textContent = "Hiba";
    statusUsers.textContent = "-";
    statusOnline.textContent = "-";
  }
}

// Betöltéskor frissítjük a mini HUD-ot
loadSystemStatus();
