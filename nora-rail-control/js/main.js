// ===== Főmenü =====
const startGameBtn = document.getElementById("startGameBtn");
const userStatus = document.getElementById("userStatus");
const logoutBtn = document.getElementById("logoutBtn");
const adminBtn = document.getElementById("adminBtn");

let loggedInUser = null;
// Bejelentkezett felhasználó ellenőrzése
async function checkLoginStatus() {
  const response = await fetch("backend/get_user.php");
  const result = await response.json();

  if (result.loggedIn) {
    loggedInUser = result.user;
    userStatus.textContent = `Bejelentkezve: ${result.user.username}`;
    logoutBtn.style.display = "block";

    if (result.user.role === "admin") {
      adminBtn.style.display = "block";
    } else {
      adminBtn.style.display = "none";
    }
  } else {
    loggedInUser = null;
    userStatus.textContent = "Nincs bejelentkezve";
    logoutBtn.style.display = "none";
    adminBtn.style.display = "none";
  }
}

startGameBtn.addEventListener("click", () => {
  if (loggedInUser) {
    window.location.href = "game.html";
  } else {
    window.location.href = "login.html";
  }
});

logoutBtn.addEventListener("click", async () => {
  await fetch("backend/logout.php");
  window.location.href = "login.html";
});

checkLoginStatus();
