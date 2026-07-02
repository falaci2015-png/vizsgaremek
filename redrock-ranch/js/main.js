// ===== Főmenü =====
// Bejelentkezés ellenőrzése
fetch("backend/get_user.php")
  .then((response) => response.json())
  .then((data) => {
    if (!data.logged_in) {
      location.href = "login.html";
      return;
    }

    const adminBtn = document.getElementById("adminBtn");

    if (adminBtn && data.role === "admin") {
      adminBtn.classList.remove("hidden");
    }
  })
  .catch(() => {
    location.href = "login.html";
  });
document.getElementById("startBtn").addEventListener("click", () => {
  location.href = "game.html";
});

document.getElementById("settingsBtn").addEventListener("click", () => {
  location.href = "settings.html";
});

document.getElementById("leaderboardBtn").addEventListener("click", () => {
  location.href = "leaderboard.html";
});

document.getElementById("descriptionBtn").addEventListener("click", () => {
  location.href = "description.html";
});
document.getElementById("adminBtn").addEventListener("click", () => {
  location.href = "admin.html";
});

document.getElementById("projectExitZone").addEventListener("click", () => {
  location.href = "../index.html";
});
document.getElementById("logoutBtn").addEventListener("click", () => {
  fetch("backend/logout.php")
    .then((response) => response.json())
    .then(() => {
      location.href = "login.html";
    });
});
