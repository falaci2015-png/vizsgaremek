// ===== Admin felület =====
const usersBody = document.getElementById("usersBody");
const scoresBody = document.getElementById("scoresBody");
const userCount = document.getElementById("userCount");
const adminCount = document.getElementById("adminCount");
const scoreCount = document.getElementById("scoreCount");

loadUsers();
loadScores();
loadStats();
// Felhasználók betöltése
function loadUsers() {
  fetch("backend/get_users.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        usersBody.innerHTML = `
                    <tr>
                        <td colspan="4">${data.message || "Nincs jogosultság."}</td>
                    </tr>
                `;
        return;
      }

      usersBody.innerHTML = "";

      data.users.forEach((user) => {
        const row = document.createElement("tr");
        const isMainAdmin = user.username === "admin";

        const nextRole = user.role === "admin" ? "user" : "admin";
        const buttonText =
          user.role === "admin" ? "User legyen" : "Admin legyen";

        row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>
                          ${
                            isMainAdmin
                              ? "Védett admin"
                              : `
                          <button class="adminActionBtn roleBtn" data-id="${user.id}" data-role="${nextRole}">
                           ${buttonText}
                           </button>
                          <button class="adminActionBtn deleteBtn" data-id="${user.id}" data-name="${user.username}">
                              Törlés
                          </button>
                        `
                          }
                    </td>
                `;

        usersBody.appendChild(row);
      });

      document.querySelectorAll(".roleBtn").forEach((button) => {
        button.addEventListener("click", () => {
          updateRole(button.dataset.id, button.dataset.role);
        });
      });

      document.querySelectorAll(".deleteBtn").forEach((button) => {
        button.addEventListener("click", () => {
          deleteUser(button.dataset.id, button.dataset.name);
        });
      });
    })
    .catch((error) => {
      console.error("Admin lista hiba:", error);

      usersBody.innerHTML = `
                <tr>
                    <td colspan="4">Hiba történt az admin lista betöltésekor.</td>
                </tr>
            `;
    });
}

function updateRole(userId, role) {
  fetch("backend/update_role.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      role: role,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        alert(data.message || "Nem sikerült módosítani a jogosultságot.");
        return;
      }

      loadUsers();
      loadStats();
    })
    .catch((error) => {
      console.error("Jogosultság módosítási hiba:", error);
      alert("Hiba történt a jogosultság módosításakor.");
    });
}
// Felhasználó törlése
function deleteUser(userId, username) {
  const confirmed = confirm(
    `Biztosan törlöd ezt a felhasználót?\n\n${username}`,
  );

  if (!confirmed) return;

  fetch("backend/delete_user.php", {
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
      if (!data.success) {
        alert(data.message || "Nem sikerült törölni a felhasználót.");
        return;
      }

      loadUsers();
      loadStats();
    })
    .catch((error) => {
      console.error("Felhasználó törlési hiba:", error);
      alert("Hiba történt a felhasználó törlésekor.");
    });
}
// Ranglista rekordok betöltése
function loadScores() {
  fetch("backend/get_scores.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        scoresBody.innerHTML = `
                    <tr>
                        <td colspan="6">${data.message || "Nem sikerült betölteni a ranglistát."}</td>
                    </tr>
                `;
        return;
      }

      if (!data.scores || data.scores.length === 0) {
        scoresBody.innerHTML = `
                    <tr>
                        <td colspan="6">Nincs ranglista rekord.</td>
                    </tr>
                `;
        return;
      }

      scoresBody.innerHTML = "";

      data.scores.forEach((score) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                    <td>${score.id}</td>
                    <td>${score.username}</td>
                    <td>${score.score}</td>
                    <td>${score.game_time} mp</td>
                    <td>${score.created_at.substring(0, 10)}</td>
                    <td>
                        <button class="adminActionBtn deleteScoreBtn" data-id="${score.id}">
                            Törlés
                        </button>
                    </td>
                `;

        scoresBody.appendChild(row);
      });

      document.querySelectorAll(".deleteScoreBtn").forEach((button) => {
        button.addEventListener("click", () => {
          deleteScore(button.dataset.id);
        });
      });
    })
    .catch((error) => {
      console.error("Ranglista admin hiba:", error);

      scoresBody.innerHTML = `
                <tr>
                    <td colspan="6">Hiba történt a ranglista rekordok betöltésekor.</td>
                </tr>
            `;
    });
}
// Ranglista rekord törlése
function deleteScore(scoreId) {
  const confirmed = confirm("Biztosan törlöd ezt a ranglista rekordot?");

  if (!confirmed) return;

  fetch("backend/delete_score.php", {
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
      if (!data.success) {
        alert(data.message || "Nem sikerült törölni a ranglista rekordot.");
        return;
      }

      loadScores();
      loadStats();
    })
    .catch((error) => {
      console.error("Ranglista törlési hiba:", error);
      alert("Hiba történt a ranglista rekord törlésekor.");
    });
}
// Admin statisztikák betöltése
function loadStats() {
  fetch("backend/get_stats.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        return;
      }

      userCount.textContent = data.user_count;
      adminCount.textContent = data.admin_count;
      scoreCount.textContent = data.score_count;
    })
    .catch((error) => {
      console.error("Statisztikai hiba:", error);
    });
}
