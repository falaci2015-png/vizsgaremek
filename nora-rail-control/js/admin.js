// ===== Admin felület =====
const statsContainer = document.getElementById("statsContainer");
const usersContainer = document.getElementById("usersContainer");
const leaderboardAdminContainer = document.getElementById(
  "leaderboardAdminContainer",
);
// Admin jogosultság ellenőrzése
async function protectAdminPage() {
  const response = await fetch("backend/get_user.php");
  const result = await response.json();

  if (!result.loggedIn || result.user.role !== "admin") {
    window.location.href = "index.html";
    return false;
  }

  return true;
}
// Statisztikák betöltése
async function loadStats() {
  const response = await fetch("backend/admin_stats.php");
  const result = await response.json();

  if (!result.success) {
    statsContainer.innerHTML = result.message;
    return;
  }

  statsContainer.innerHTML = `
    <div class="statsCard">
        <div class="statsIcon">👥</div>
        <div>
            <div class="statsLabel">Felhasználók</div>
            <div class="statsNumber">${result.stats.users}</div>
        </div>
    </div>

    <div class="statsCard">
        <div class="statsIcon">🛡️</div>
        <div>
            <div class="statsLabel">Adminok</div>
            <div class="statsNumber">${result.stats.admins}</div>
        </div>
    </div>

    <div class="statsCard">
        <div class="statsIcon">🏆</div>
        <div>
            <div class="statsLabel">Eredmények</div>
            <div class="statsNumber">${result.stats.leaderboard}</div>
        </div>
    </div>
`;
}

async function loadUsers() {
  const response = await fetch("backend/admin_users.php");
  const result = await response.json();

  if (!result.success) {
    usersContainer.innerHTML = result.message;
    return;
  }

  let html = `
    <div class="adminCounter">
        ${result.users.length} felhasználó
    </div>
    `;

  result.users.forEach((user) => {
    const nextRole = user.role === "admin" ? "user" : "admin";
    const roleText = user.role === "admin" ? "Legyen user" : "Legyen admin";

    html += `
        <div class="adminItem">
            <strong>${user.username}</strong><br>
            Szerep: ${user.role}<br>
            <small>${user.created_at}</small><br>

            <button onclick="updateUserRole(${user.id}, '${nextRole}')">
    ${roleText}
</button>

<button onclick="deleteUser(${user.id})">
    Törlés
</button>
        </div>
    `;
  });

  usersContainer.innerHTML = html;
}
// Ranglista betöltése
async function loadLeaderboardAdmin() {
  const response = await fetch("backend/admin_leaderboard.php");
  const result = await response.json();

  if (!result.success) {
    leaderboardAdminContainer.innerHTML = result.message;
    return;
  }

  let html = `
    <div class="adminCounter">
        ${result.records.length} ranglista rekord
    </div>
`;

  result.records.forEach((record) => {
    html += `
            <div class="adminItem">
                <strong>${record.username}</strong><br>
                ${record.difficulty} | ${record.score} pont<br>
                <small>${record.created_at}</small><br>
                <button onclick="deleteScore(${record.id})">
                Törlés
            </button>
            </div>
        `;
  });

  leaderboardAdminContainer.innerHTML = html;
}
async function updateUserRole(userId, role) {
  await fetch("backend/admin_update_role.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      role: role,
    }),
  });

  loadStats();
  loadUsers();
}
async function deleteUser(userId) {
  if (!confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) {
    return;
  }

  const response = await fetch("backend/admin_delete_user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
    }),
  });

  const result = await response.json();

  alert(result.message);

  loadStats();
  loadUsers();
}

async function deleteScore(scoreId) {
  if (!confirm("Biztosan törölni szeretnéd ezt a ranglista rekordot?")) {
    return;
  }

  const response = await fetch("backend/admin_delete_score.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scoreId: scoreId,
    }),
  });

  const result = await response.json();

  alert(result.message);

  loadStats();
  loadLeaderboardAdmin();
}
protectAdminPage().then((isAdmin) => {
  if (isAdmin) {
    loadStats();
    loadUsers();
    loadLeaderboardAdmin();
  }
});
