// ===== Ranglista =====
const leaderboardBody = document.getElementById("leaderboardBody");

fetch("backend/get_leaderboard.php")
  .then((response) => response.json())
  .then((data) => {
    if (!data.success || !data.leaderboard || data.leaderboard.length === 0) {
      leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="4">Még nincs ranglista adat.</td>
                </tr>
            `;
      return;
    }

    leaderboardBody.innerHTML = "";

    data.leaderboard.forEach((item, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${index + 1}.</td>
                <td>${item.player_name}</td>
                <td>${item.score}</td>
                <td>${item.game_time} mp</td>
                <td>${item.created_at.substring(0, 10)}</td>
            `;

      leaderboardBody.appendChild(row);
    });
  })
  .catch((error) => {
    console.error("Ranglista hiba:", error);

    leaderboardBody.innerHTML = `
            <tr>
                <td colspan="4">Hiba történt a ranglista betöltésekor.</td>
            </tr>
        `;
  });
