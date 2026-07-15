// *************************************
// UFO Over the City
// Ranglista betöltése
// *************************************

const tableBody = document.querySelector("#leaderboard-table tbody");
const refreshButton = document.getElementById("refresh-button");
// Csak az admin láthatja a törlési műveleteket
const isAdmin = document.body.dataset.isAdmin === "1";

// Az oszlopok száma adminnál 7, normál játékosnál 6
const leaderboardColumnCount = isAdmin ? 7 : 6;

// *************************************
// Dátum formázása
// *************************************
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("hu-HU");
}

// *************************************
// Ranglista betöltése
// *************************************
async function loadLeaderboard() {
  tableBody.innerHTML = "";

  try {
    const response = await fetch("../backend/get_leaderboard.php");

    const data = await response.json();

    if (!data.success) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="${leaderboardColumnCount}" class="leaderboard-message">
                        Nem sikerült betölteni a ranglistát.
                    </td>
                </tr>
            `;

      return;
    }

    if (data.leaderboard.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="${leaderboardColumnCount}" class="leaderboard-message">
                        Még nincs egyetlen eredmény sem.
                    </td>
                </tr>
            `;

      return;
    }

    data.leaderboard.forEach((player, index) => {
      const row = document.createElement("tr");

      // Dobogós helyezések
      if (index === 0) row.classList.add("rank-1");
      if (index === 1) row.classList.add("rank-2");
      if (index === 2) row.classList.add("rank-3");

      let place = index + 1;

      if (index === 0) place = "🥇";
      if (index === 1) place = "🥈";
      if (index === 2) place = "🥉";

      row.innerHTML = `

                <td>${place}</td>

                <td>${player.player_name}</td>

                <td>${player.city_name}</td>

                <td>${player.score}</td>

                <td>${player.game_duration_seconds} mp</td>

                <td>${formatDate(player.played_at)}</td>
                 ${
                   isAdmin
                     ? `
                      <td>
                        <button
                          class="delete-score-button"
                          type="button"
                         data-score-id="${player.id}"
                         data-player-name="${player.player_name}">

                         TÖRLÉS

                       </button>
                   </td>
      `
                     : ""
                 }

            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);

    tableBody.innerHTML = `
            <tr>
                <td colspan="${leaderboardColumnCount}" class="leaderboard-message">
                    Kapcsolódási hiba.
                </td>
            </tr>
        `;
  }
}
// *************************************
// Ranglista rekord törlése
// *************************************
async function deleteScore(scoreId, playerName) {
  const confirmed = confirm(
    `"${playerName}" eredményét biztosan törölni szeretnéd?`,
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch("../backend/delete_score.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        score_id: scoreId,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A törlés sikertelen.");
    }

    // Ranglista újratöltése
    loadLeaderboard();
  } catch (error) {
    alert(error.message);
  }
}

// *************************************
// Frissítés gomb
// *************************************
refreshButton.addEventListener("click", loadLeaderboard);
// *************************************
// Törlés gomb kezelése
// *************************************
tableBody.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-score-button");

  if (!deleteButton) {
    return;
  }

  deleteScore(
    Number(deleteButton.dataset.scoreId),
    deleteButton.dataset.playerName,
  );
});

// *************************************
// Oldal betöltése
// *************************************
loadLeaderboard();
