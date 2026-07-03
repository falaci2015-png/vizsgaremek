// Bejelentkezett felhasználó ellenőrzése
document.body.style.display = "none";

fetch("backend/get_user.php", {
  cache: "no-store",
})
  .then((response) => response.json())
  .then((user) => {
    if (!user.logged_in) {
      window.location.replace("login.html");
      return;
    }

    localStorage.setItem("playerName", user.username);
    localStorage.setItem("userRole", user.role);
    if (user.role === "admin") {
      adminButton.classList.remove("hidden");
    }

    document.body.style.display = "block";
  })
  .catch(() => {
    window.location.replace("login.html");
  });
// Menü felület elemeinek inicializálása
const menuPanel = document.querySelector(".menuPanel");

const exitGlow = document.getElementById("exitGlow");

const settingsPanel = document.getElementById("settingsPanel");

const leaderboardPanel = document.getElementById("leaderboardPanel");

const descriptionPanel = document.getElementById("descriptionPanel");
const leaderboardContent = document.getElementById("leaderboardContent");

const buttons = document.querySelectorAll(".menuBtn");

const menuExitZone = document.getElementById("menuExitZone");

const projectExitZone = document.getElementById("projectExitZone");
const adminButton = document.getElementById("adminButton");

const adminPanel = document.getElementById("adminPanel");

const adminUsersList = document.getElementById("adminUsersList");

const adminUserCount = document.getElementById("adminUserCount");

const adminAdminCount = document.getElementById("adminAdminCount");
const startButton = document.getElementById("startButton");
const logoutBtn = document.getElementById("logoutBtn");
const adminLeaderboardCount = document.getElementById("adminLeaderboardCount");

const adminBestTime = document.getElementById("adminBestTime");
const adminScoresList = document.getElementById("adminScoresList");
// Panelek elrejtése
function hideAllPanels() {
  settingsPanel.classList.add("hidden");
  leaderboardPanel.classList.add("hidden");
  descriptionPanel.classList.add("hidden");
  adminPanel.classList.add("hidden");
}

buttons[1].addEventListener("click", () => {
  menuPanel.style.display = "none";

  hideAllPanels();

  settingsPanel.classList.remove("hidden");

  menuExitZone.style.display = "block";
  projectExitZone.style.display = "block";
  exitGlow.style.display = "block";
});

buttons[2].addEventListener("click", () => {
  menuPanel.style.display = "none";

  hideAllPanels();

  leaderboardPanel.classList.remove("hidden");

  menuExitZone.style.display = "block";
  projectExitZone.style.display = "block";
  exitGlow.style.display = "block";
  loadLeaderboard();
});

buttons[3].addEventListener("click", () => {
  menuPanel.style.display = "none";

  hideAllPanels();

  descriptionPanel.classList.remove("hidden");

  menuExitZone.style.display = "block";
  projectExitZone.style.display = "block";
  exitGlow.style.display = "block";
});

menuExitZone.addEventListener("click", () => {
  hideAllPanels();

  menuPanel.style.display = "block";

  menuExitZone.style.display = "none";
  projectExitZone.style.display = "block";
});
projectExitZone.addEventListener("click", () => {
  window.location.href = "../index.php";
});

exitGlow.style.display = "block";
menuExitZone.style.display = "none";
projectExitZone.style.display = "block";

//
// BEÁLLÍTÁSOK MENTÉSE
//
// Játékbeállítások betöltése
const soundEnabled = document.getElementById("soundEnabled");
const playerNameInput = document.getElementById("playerNameInput");
const savedPlayerName = localStorage.getItem("playerName");
if (savedPlayerName) {
  playerNameInput.value = savedPlayerName;
}

fetch("backend/get_user.php")
  .then((response) => response.json())
  .then((user) => {
    if (user.logged_in) {
      playerNameInput.value = user.username;

      localStorage.setItem("playerName", user.username);
    }
  });
const carRadios = document.querySelectorAll('input[name="car"]');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const oldPasswordInput = document.getElementById("oldPasswordInput");

const newPasswordInput = document.getElementById("newPasswordInput");

const newPasswordAgainInput = document.getElementById("newPasswordAgainInput");

const changePasswordBtn = document.getElementById("changePasswordBtn");

const passwordMessageBox = document.getElementById("passwordMessageBox");

//
// betöltés
//

const savedCar = localStorage.getItem("selectedCar");

const savedSound = localStorage.getItem("soundEnabled");

const savedDifficulty = localStorage.getItem("selectedDifficulty");

if (savedCar) {
  carRadios.forEach((radio) => {
    if (radio.value === savedCar) {
      radio.checked = true;
    }
  });
}

if (savedSound !== null) {
  soundEnabled.checked = savedSound === "true";
}
if (savedDifficulty) {
  difficultyRadios.forEach((radio) => {
    if (radio.value === savedDifficulty) {
      radio.checked = true;
    }
  });
}

//
// mentés
//
// Beállítások mentése
carRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    localStorage.setItem("selectedCar", radio.value);
  });
});

difficultyRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    localStorage.setItem("selectedDifficulty", radio.value);
  });
});

soundEnabled.addEventListener("change", () => {
  localStorage.setItem("soundEnabled", soundEnabled.checked);
});
//
// JÁTÉK INDÍTÁSA
//
startButton.addEventListener("click", () => {
  window.location.href = "game.html";
});
// Idő formázása
function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");

  const secs = String(seconds % 60).padStart(2, "0");

  return `00:${mins}:${secs}`;
}
// Ranglista betöltése
function loadLeaderboard() {
  fetch("backend/get_leaderboard.php")
    .then((response) => response.json())

    .then((data) => {
      if (!data.success) {
        return;
      }

      leaderboardContent.innerHTML = "";

      data.leaderboard.forEach((entry, index) => {
        let medal = index + 1;
        let rowClass = "";

        if (index === 0) {
          medal = "🥇";
          rowClass = "gold";
        }

        if (index === 1) {
          medal = "🥈";
          rowClass = "silver";
        }

        if (index === 2) {
          medal = "🥉";
          rowClass = "bronze";
        }

        leaderboardContent.innerHTML += `
    <div class="leaderboardItem ${rowClass}">

                        <span>${medal}</span>

                        <span>${entry.player_name}</span>

                        <span>${entry.car}</span>

                        <span>${entry.difficulty}</span>

                        <span>${formatTime(entry.finish_time)}</span>

                        <span>${entry.money}$</span>

                    </div>
                `;
      });
    })

    .catch((error) => {
      console.error(error);
    });
}
// Kijelentkezés
logoutBtn.addEventListener("click", () => {
  fetch("backend/logout.php")
    .then((response) => response.json())

    .then(() => {
      window.location.href = "login.html";
    });
});
// Admin panel megnyitása
adminButton.addEventListener("click", () => {
  menuPanel.style.display = "none";

  hideAllPanels();

  adminPanel.classList.remove("hidden");

  menuExitZone.style.display = "block";
  projectExitZone.style.display = "block";
  exitGlow.style.display = "block";

  loadAdminUsers();
  loadAdminStats();
  loadAdminScores();
});
// Felhasználók betöltése
function loadAdminUsers() {
  fetch("backend/admin_users.php")
    .then((response) => response.json())

    .then((data) => {
      if (!data.success) {
        adminUsersList.innerHTML = "<p>Nincs jogosultság.</p>";
        return;
      }

      adminUsersList.innerHTML = "";

      adminUserCount.textContent = data.users.length;

      adminAdminCount.textContent = data.users.filter(
        (user) => user.role === "admin",
      ).length;

      data.users.forEach((user) => {
        const nextRole = user.role === "admin" ? "user" : "admin";

        const buttonText =
          user.role === "admin" ? "Userré tesz" : "Adminná tesz";

        adminUsersList.innerHTML += `
    <div class="adminUserItem">
        <span>${user.username}</span>
        <span>${user.role}</span>

        <button onclick="updateUserRole(${user.id}, '${nextRole}')">
            ${buttonText}
        </button>

        <button class="dangerBtn" onclick="deleteUser(${user.id}, '${user.username}')">
            Törlés
        </button>
    </div>
`;
      });
    });
}

function updateUserRole(userId, newRole) {
  fetch("backend/admin_update_role.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      role: newRole,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);

      loadAdminUsers();
    });
}
// Felhasználó törlése
function deleteUser(userId, username) {
  if (!confirm(`Biztosan törlöd ezt a felhasználót: ${username}?`)) {
    return;
  }

  fetch("backend/admin_delete_user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);

      loadAdminUsers();
    });
}
// Admin statisztikák betöltése
function loadAdminStats() {
  fetch("backend/admin_stats.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        return;
      }

      adminUserCount.textContent = data.user_count;
      adminAdminCount.textContent = data.admin_count;
      adminLeaderboardCount.textContent = data.leaderboard_count;

      if (data.best_time === null) {
        adminBestTime.textContent = "-";
      } else {
        adminBestTime.textContent = formatTime(Number(data.best_time));
      }
    });
}
// Admin ranglista betöltése
function loadAdminScores() {
  fetch("backend/get_leaderboard.php")
    .then((response) => response.json())

    .then((data) => {
      if (!data.success) {
        return;
      }

      adminScoresList.innerHTML = "";

      data.leaderboard.forEach((score) => {
        adminScoresList.innerHTML += `
                    <div class="adminUserItem">

                        <span>${score.player_name}</span>

                        <span>${formatTime(score.finish_time)}</span>

                        <span>${score.money}$</span>

                        <button
                            class="dangerBtn"
                            onclick="deleteScore(${score.id})">

                            Törlés

                        </button>

                    </div>
                `;
      });
    });
}
// Ranglista rekord törlése
function deleteScore(scoreId) {
  if (!confirm("Biztosan törlöd ezt a rekordot?")) {
    return;
  }

  fetch("backend/admin_delete_score.php", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      score_id: scoreId,
    }),
  })
    .then((response) => response.json())

    .then((data) => {
      alert(data.message);

      loadAdminScores();
      loadAdminStats();
    });
}
changePasswordBtn.addEventListener("click", () => {
  passwordMessageBox.textContent = "";

  if (
    oldPasswordInput.value === "" ||
    newPasswordInput.value === "" ||
    newPasswordAgainInput.value === ""
  ) {
    passwordMessageBox.textContent = "Minden mező kitöltése kötelező.";
    return;
  }

  if (newPasswordInput.value !== newPasswordAgainInput.value) {
    passwordMessageBox.textContent = "Az új jelszavak nem egyeznek.";
    return;
  }

  fetch("backend/update_password.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      old_password: oldPasswordInput.value,
      new_password: newPasswordInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      passwordMessageBox.textContent = data.message || "";

      if (data.success) {
        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        newPasswordAgainInput.value = "";
      }
    })
    .catch(() => {
      passwordMessageBox.textContent = "Kapcsolódási hiba.";
    });
});
// Kilépési zóna megjelenítése
function showMainMenuExit() {
  exitGlow.style.display = "block";
  menuExitZone.style.display = "none";
  projectExitZone.style.display = "block";
}
showMainMenuExit();
