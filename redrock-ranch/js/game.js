// =====================================================
// Redrock Ranch - Játéklogika
// =====================================================
// HTML elemek, hangok, játék beállításai
const heroArm = document.getElementById("heroArm");
const heroBody = document.getElementById("heroBody");
const enemyLayer = document.getElementById("enemyLayer");
const scoreValue = document.getElementById("scoreValue");
const timeValue = document.getElementById("timeValue");
const gameOverPanel = document.getElementById("gameOverPanel");
const finalScore = document.getElementById("finalScore");
const muzzleFlash = document.getElementById("muzzleFlash");
const shootSound = new Audio("assets/audio/shoot.mp3");
const crosshair = document.getElementById("crosshair");
const comboValue = document.getElementById("comboValue");
const horse = document.querySelector("#horse img");
const horseBox = document.getElementById("horse");
const horseSound = new Audio("assets/audio/horse.mp3");
const bossHud = document.getElementById("bossHud");
const bossHpValue = document.getElementById("bossHpValue");
const bossWarning = document.getElementById("bossWarning");
const bgMusic = document.getElementById("bgMusic");
const gameExitZone = document.getElementById("gameExitZone");
const reloadSound = new Audio("assets/audio/reload.mp3");
const emptyClickSound = new Audio("assets/audio/empty_click.mp3");
const musicEnabled = localStorage.getItem("redrockMusicEnabled") !== "false";

const soundEnabled = localStorage.getItem("redrockSoundEnabled") !== "false";

const gameDuration = parseInt(localStorage.getItem("redrockGameTime")) || 60;
shootSound.volume = 0.6;
if (bgMusic) {
  bgMusic.volume = 0.3;
}
if (gameExitZone) {
  gameExitZone.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
if (horseBox) {
  horseBox.addEventListener("mouseenter", () => {
    if (!gameRunning) return;

    crosshair.style.display = "none";
    document.body.style.cursor = "pointer";
  });

  horseBox.addEventListener("mouseleave", () => {
    if (!gameRunning) return;

    document.body.style.cursor = "default";
  });

  horseBox.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!gameRunning) return;

    if (soundEnabled) {
      horseSound.currentTime = 0;
      horseSound.play();
    }

    animateHorse();
  });
}
// Játék állapotváltozók
const bulletsPerMagazine = 6;
let magazinesLeft = 5;
let bulletsLeft = bulletsPerMagazine;
let nextBossAt = 3;
let combo = 0;
let score = 0;
let currentEnemy = null;
let timeLeft = gameDuration;
let gameRunning = true;
let spawnInterval = null;
let defeatedBadEnemies = 0;
let bossActive = false;
let bossHp = 3;
let scoreSaved = false;
/* FŐHŐS TEST ANIMÁCIÓ */

const heroBodyFrames = [
  "assets/img/hero/body.png",
  "assets/img/hero/body2.png",
  "assets/img/hero/body3.png",
];
const horseFrames = [
  "assets/img/horse/horse_a.png",
  "assets/img/horse/horse_b.png",
  "assets/img/horse/horse_c.png",
];

let horseFrameIndex = 0;
// Lőszer kezelés
function updateAmmoHud() {
  const magazineValue = document.getElementById("magazineValue");
  const bulletBar = document.getElementById("bulletBar");

  if (!magazineValue || !bulletBar) return;

  magazineValue.textContent = magazinesLeft;

  bulletBar.innerHTML = "";

  for (let i = 1; i <= bulletsPerMagazine; i++) {
    const bullet = document.createElement("div");
    bullet.className = "bulletIcon";

    if (i > bulletsLeft) {
      bullet.classList.add("empty");
    }

    bulletBar.appendChild(bullet);
  }
}

function playEmptyClick() {
  if (!soundEnabled) return;

  emptyClickSound.currentTime = 0;
  emptyClickSound.play();
}

function reloadMagazine() {
  if (magazinesLeft <= 0) return false;

  magazinesLeft--;
  bulletsLeft = bulletsPerMagazine;

  if (soundEnabled) {
    reloadSound.currentTime = 0;
    reloadSound.play();
  }

  updateAmmoHud();
  return true;
}
// Lövés kezelése
function tryShoot(x, y) {
  if (bulletsLeft <= 0) {
    playEmptyClick();
    return false;
  }

  bulletsLeft--;
  playShootEffect(x, y);

  if (bulletsLeft <= 0 && magazinesLeft > 0) {
    reloadMagazine();
  } else {
    updateAmmoHud();
  }

  return true;
}

function animateHorse() {
  if (!horse || !gameRunning) return;

  horseFrameIndex++;

  if (horseFrameIndex >= horseFrames.length) {
    horseFrameIndex = 0;
  }

  horse.src = horseFrames[horseFrameIndex];
}

setInterval(() => {
  const shouldMove = Math.random() < 0.35;

  if (shouldMove) {
    animateHorse();
  }
}, 1200);

let heroBodyFrameIndex = 0;

function animateHeroBody() {
  if (!heroBody || !gameRunning) return;

  heroBodyFrameIndex++;

  if (heroBodyFrameIndex >= heroBodyFrames.length) {
    heroBodyFrameIndex = 0;
  }

  heroBody.src = heroBodyFrames[heroBodyFrameIndex];
}
// Boss kezelése
function updateBossHud() {
  if (!bossHud || !bossHpValue) return;

  if (bossActive && bossHp > 0) {
    bossHpValue.textContent = bossHp;
    bossHud.classList.remove("hidden");
  } else {
    bossHud.classList.add("hidden");
  }
}

function showBossWarning() {
  if (!bossWarning) return;

  bossWarning.classList.remove("hidden");

  setTimeout(() => {
    bossWarning.classList.add("hidden");
  }, 1500);
}

setInterval(animateHeroBody, 320);
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timeValue.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
// Pontszám mentése
function saveFinalScore() {
  if (scoreSaved) return;

  scoreSaved = true;

  fetch("backend/save_score.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      score: score,
      game_time: gameDuration,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Mentés siker:", data.success);
      console.log("Mentés üzenet:", data.message);
      console.log("Teljes válasz:", data);
    })
    .catch((error) => {
      console.error("Pontszám mentési hiba:", error);
    });
}
// Játék vége
function endGame() {
  gameRunning = false;
  if (crosshair) {
    crosshair.style.display = "none";
  }

  document.body.style.cursor = "default";
  if (spawnInterval) {
    clearInterval(spawnInterval);
  }

  if (currentEnemy) {
    currentEnemy.remove();
    currentEnemy = null;
  }

  finalScore.textContent = score;
  saveFinalScore();
  gameOverPanel.classList.remove("hidden");
}

function updateScore() {
  scoreValue.textContent = score;
}

function updateCombo() {
  if (combo <= 0) {
    comboValue.textContent = "--";
    return;
  }

  comboValue.textContent = "x" + combo;
}
function showBossEscapeMessage() {
  const message = document.createElement("div");

  message.className = "bossEscapeMessage";
  message.innerHTML = `
        <div>BOSS ELSZÖKÖTT!</div>
        <div>-2 PONT</div>
    `;

  document.querySelector(".gameScene").appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2500);
}

function showScorePopup(text, x, y, type) {
  const popup = document.createElement("div");

  popup.className = `scorePopup ${type}`;
  popup.textContent = text;

  popup.style.left = x + "px";
  popup.style.top = y + "px";

  document.querySelector(".gameScene").appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 800);
}

function showHeadshotPopup(x, y, points) {
  const popup = document.createElement("div");

  popup.className = "headshotPopup";

  popup.innerHTML = `
        <div>HEADSHOT</div>
        <div>+${points}</div>
    `;

  popup.style.left = x + "px";
  popup.style.top = y + "px";

  document.querySelector(".gameScene").appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000);
}

function showComboPopup(x, y, multiplier) {
  const popup = document.createElement("div");

  popup.className = "comboPopup";
  popup.textContent = `COMBO x${multiplier}`;

  popup.style.left = x + "px";
  popup.style.top = y + "px";

  document.querySelector(".gameScene").appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000);
}

/* KAR MOZGÁSA */

const shootZone = {
  left: 350,
  top: 225,
  right: 1510,
  bottom: 560,
};
// Egér és célzás
document.addEventListener("mousemove", (event) => {
  if (!gameRunning) {
    crosshair.style.display = "none";
    document.body.style.cursor = "default";
    return;
  }
  crosshair.style.left = event.clientX + "px";
  crosshair.style.top = event.clientY + "px";
  if (!heroArm) return;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const isInsideShootZone =
    mouseX >= shootZone.left &&
    mouseX <= shootZone.right &&
    mouseY >= shootZone.top &&
    mouseY <= shootZone.bottom;

  if (!isInsideShootZone) {
    crosshair.style.display = "none";
    document.body.style.cursor = "default";
    return;
  }

  crosshair.style.display = "block";
  crosshair.style.left = mouseX + "px";
  crosshair.style.top = mouseY + "px";
  document.body.style.cursor = "none";

  const armRect = heroArm.getBoundingClientRect();

  const pivotX = armRect.left + 8;
  const pivotY = armRect.top + armRect.height / 2;

  const dx = mouseX - pivotX;
  const dy = mouseY - pivotY;

  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  angle = Math.max(-45, Math.min(35, angle));

  heroArm.style.transform = `rotate(${angle}deg)`;
});
function isInsideShootZone(x, y) {
  return (
    x >= shootZone.left &&
    x <= shootZone.right &&
    y >= shootZone.top &&
    y <= shootZone.bottom
  );
}
function isInsideEnemyZoneWithMargin(x, y) {
  const marginRatio = 0.1;

  return noBulletHoleZones.some((zone) => {
    const marginX = zone.width * marginRatio;
    const marginY = zone.height * marginRatio;

    return (
      x >= zone.left - marginX &&
      x <= zone.left + zone.width + marginX &&
      y >= zone.top - marginY &&
      y <= zone.top + zone.height + marginY
    );
  });
}
// Lövés effekt
function playShootEffect(x, y) {
  if (soundEnabled) {
    shootSound.currentTime = 0;
    shootSound.play();
  }

  muzzleFlash.style.left = x - 20 + "px";
  muzzleFlash.style.top = y - 20 + "px";
  muzzleFlash.style.display = "block";

  setTimeout(() => {
    muzzleFlash.style.display = "none";
  }, 80);
}
function createBulletHole(x, y) {
  const hole = document.createElement("div");

  hole.className = "bulletHole";

  hole.style.left = x - 10 + "px";
  hole.style.top = y - 10 + "px";

  document.querySelector(".gameScene").appendChild(hole);
}

document.addEventListener("click", (event) => {
  if (musicEnabled && bgMusic && bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }
  if (!gameRunning) return;

  const x = event.clientX;
  const y = event.clientY;

  if (!isInsideShootZone(x, y)) return;

  if (event.target.classList.contains("enemy")) {
    return;
  }

  const clickedSpawnZone = event.target.classList.contains("spawnZone");

  if (tryShoot(x, y)) {
    if (!isInsideEnemyZoneWithMargin(x, y)) {
      createBulletHole(x, y);
    }
  }
});

/* ELLENFELEK */

const spawnZones = [
  { left: 360, top: 230, width: 80, height: 110 },
  { left: 630, top: 230, width: 80, height: 110 },
  { left: 880, top: 230, width: 85, height: 110 },
  { left: 1140, top: 230, width: 80, height: 110 },
  { left: 1390, top: 230, width: 80, height: 110 },

  { left: 365, top: 445, width: 85, height: 110 },
  { left: 625, top: 445, width: 90, height: 110 },
  { left: 1135, top: 445, width: 85, height: 110 },
  { left: 1400, top: 445, width: 95, height: 110 },
];
const noBulletHoleZones = [
  ...spawnZones,

  // Bal alsó ülő ember / szék környéke
  { left: 545, top: 490, width: 95, height: 65 },

  // Középső ajtó felső része
  { left: 870, top: 430, width: 150, height: 75 },
];
/*function drawNoBulletHoleTestZones() {
    noBulletHoleZones.slice(spawnZones.length).forEach(zone => {
        const box = document.createElement("div");

        box.style.position = "absolute";
        box.style.left = zone.left + "px";
        box.style.top = zone.top + "px";
        box.style.width = zone.width + "px";
        box.style.height = zone.height + "px";
        box.style.border = "3px solid red";
        box.style.background = "rgba(255, 0, 0, 0.08)";
        box.style.zIndex = "80";
        box.style.pointerEvents = "none";

        document.querySelector(".gameScene").appendChild(box);
    });
}

drawNoBulletHoleTestZones();*/

const enemies = [
  "1a.png",
  "1b.png",
  "2a.png",
  "2b.png",
  "3a.png",
  "3b.png",
  "4a.png",
  "4b.png",
];
const bossEnemy = {
  file: "boss.png",
  hp: 3,
  points: 5,
};

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
// Új ellenfél létrehozása
function spawnEnemy() {
  if (!gameRunning) return;
  if (!enemyLayer) return;

  if (currentEnemy) {
    if (currentEnemy.dataset.boss === "true") {
      score -= 2;
      updateScore();

      showBossEscapeMessage();
      bossActive = false;
      bossHp = bossEnemy.hp;
      updateBossHud();
      nextBossAt += 3;
    }

    currentEnemy.remove();
    currentEnemy = null;
  }

  const zone = getRandomItem(spawnZones);

  let enemyFile = getRandomItem(enemies);
  let isBoss = false;

  if (defeatedBadEnemies >= nextBossAt && !bossActive) {
    enemyFile = bossEnemy.file;
    isBoss = true;
    bossActive = true;
    bossHp = bossEnemy.hp;
    updateBossHud();
    showBossWarning();
  }

  const enemy = document.createElement("img");
  enemy.src = `assets/img/enemies/${enemyFile}`;
  enemy.className = "enemy";

  enemy.style.left = `${zone.left}px`;
  enemy.style.top = `${zone.top}px`;
  enemy.style.width = `${zone.width}px`;
  enemy.style.height = `${zone.height}px`;
  if (isBoss) {
    enemy.style.width = `${zone.width + 35}px`;
    enemy.style.height = `${zone.height + 35}px`;
    enemy.style.left = `${zone.left - 18}px`;
    enemy.style.top = `${zone.top - 18}px`;
  }

  enemy.dataset.type = enemyFile.includes("b") ? "bad" : "good";
  enemy.dataset.boss = isBoss ? "true" : "false";
  enemy.dataset.hp = isBoss ? bossHp : 1;

  enemy.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!tryShoot(event.clientX, event.clientY)) {
      return;
    }
    const rect = enemy.getBoundingClientRect();
    if (enemy.dataset.boss === "true") {
      bossHp--;
      updateBossHud();

      if (bossHp > 0) {
        showScorePopup(
          "BOSS HP: " + bossHp,
          event.clientX,
          event.clientY,
          "minus",
        );
        return;
      }

      score += bossEnemy.points;
      defeatedBadEnemies++;
      bossActive = false;
      updateBossHud();
      nextBossAt += 3;

      showScorePopup("BOSS +5", event.clientX, event.clientY, "plus");

      updateScore();

      enemy.remove();
      currentEnemy = null;
      return;
    }

    const clickY = event.clientY - rect.top;

    const isHeadshot = clickY < rect.height * 0.35;
    if (enemy.dataset.type === "bad") {
      combo++;

      let earnedPoints = 1;

      if (combo >= 5) {
        earnedPoints = 3;
      } else if (combo >= 3) {
        earnedPoints = 2;
      }

      if (isHeadshot) {
        earnedPoints += 1;
        showHeadshotPopup(event.clientX, event.clientY, earnedPoints);
      } else {
        showScorePopup(
          "+" + earnedPoints,
          event.clientX,
          event.clientY,
          "plus",
        );
      }

      if (combo === 3) {
        showComboPopup(event.clientX + 35, event.clientY - 20, 2);
      }

      if (combo === 5) {
        showComboPopup(event.clientX + 35, event.clientY - 20, 3);
      }

      score += earnedPoints;
      defeatedBadEnemies++;
      updateCombo();
    } else {
      combo = 0;
      updateCombo();

      score -= 1;

      showScorePopup("-1", event.clientX, event.clientY, "minus");
    }

    updateScore();

    enemy.remove();
    currentEnemy = null;
  });

  enemyLayer.appendChild(enemy);
  currentEnemy = enemy;

  setTimeout(
    () => {
      if (currentEnemy === enemy) {
        if (enemy.dataset.boss === "true") {
          bossActive = false;
          bossHp = bossEnemy.hp;
          updateBossHud();
          nextBossAt += 3;
        }

        if (enemy.dataset.type === "bad") {
          score -= 1;
          updateScore();
          combo = 0;
          updateCombo();
          const enemyRect = enemy.getBoundingClientRect();
          showScorePopup(
            "-1",
            enemyRect.left + enemyRect.width / 2,
            enemyRect.top + enemyRect.height / 2,
            "minus",
          );
        }

        enemy.remove();
        currentEnemy = null;
      }
    },
    enemy.dataset.boss === "true" ? 5000 : 3000,
  );
}
updateAmmoHud();
updateTimer();

spawnInterval = setInterval(() => {
  if (gameRunning) {
    spawnEnemy();
  }
}, 3500);

const timerInterval = setInterval(() => {
  if (!gameRunning) {
    clearInterval(timerInterval);
    return;
  }

  timeLeft--;
  updateTimer();

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    endGame();
  }
}, 1000);
