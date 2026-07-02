// ===== Ranglista =====
const lists = {
  easy: document.getElementById("easyList"),
  normal: document.getElementById("normalList"),
  hard: document.getElementById("hardList"),
};

async function loadList(difficulty) {
  const response = await fetch(
    `backend/get_leaderboard.php?difficulty=${difficulty}`,
  );

  const result = await response.json();

  if (!result.success || result.leaderboard.length === 0) {
    lists[difficulty].innerHTML = "<p>Nincs még eredmény.</p>";
    return;
  }

  let html = "<ol>";

  result.leaderboard.forEach((entry, index) => {
    let medal = "";

    if (index === 0) medal = "🥇 ";
    else if (index === 1) medal = "🥈 ";
    else if (index === 2) medal = "🥉 ";

    const rankTitle = getRankTitle(entry.score);

    html += `
    <li>
        <strong>${medal}${entry.username}</strong><br>

        <span style="
            color:#ffd166;
            font-size:12px;
            font-weight:bold;
        ">
            ${rankTitle}
        </span><br>

        ${entry.score} pont<br>

        <small>
            ${entry.trains_passed} vonat |
            ${entry.correct_routes} jó |
            ${entry.wrong_routes} hiba
        </small>
    </li>
`;
  });

  html += "</ol>";

  lists[difficulty].innerHTML = html;
}
// Minősítés meghatározása pontszám alapján
function getRankTitle(score) {
  if (score >= 100) {
    return "VASÚTI IGAZGATÓ";
  }

  if (score >= 50) {
    return "ÁLLOMÁSFŐNÖK";
  }

  if (score >= 20) {
    return "FORGALMISTA";
  }

  if (score >= 0) {
    return "TANULÓ IRÁNYÍTÓ";
  }

  return "PÁLYAKEZDŐ GYAKORNOK";
}

loadList("easy");
loadList("normal");
loadList("hard");
