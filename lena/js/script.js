/* =========================
   VILÁGOK ADATAI
========================= */
// Hangfájlok előkészítése
const shootSound = new Audio("assets/audio/shoot.mp3");
const hitSound = new Audio("assets/audio/hit.mp3");
const gameOverSound = new Audio("assets/audio/gameover.mp3");
const victorySound = new Audio("assets/audio/victory.mp3");
// Bejelentkezett felhasználó azonosítója
let loggedInUserId = null;
// A játék világainak képei, szövegei és pályaadatai
const worlds = {
  erdo: {
    name: "Erdő",
    mission:
      "Üdvözöllek, {player}! A boszorkányok uralják az erdőt. Győzd le őket, majd számolj le a végső gonosszal!",

    background: "assets/img/backgrounds/erdos_hatter.png",

    lena: [
      "assets/img/lena/erdo/lenae1.png",
      "assets/img/lena/erdo/lenae2.png",
      "assets/img/lena/erdo/lenae3.png",
      "assets/img/lena/erdo/lenae4.png",
    ],

    lenaHurt: [
      "assets/img/lena/erdo/lenae1_hurt.png",
      "assets/img/lena/erdo/lenae2_hurt.png",
      "assets/img/lena/erdo/lenae3_hurt.png",
      "assets/img/lena/erdo/lenae4_hurt.png",
    ],
    lenaHurtJump: "assets/img/lena/erdo/lenae5_hurt.png",

    enemy: [
      "assets/img/enemies/erdo/ellene1.png",
      "assets/img/enemies/erdo/ellene2.png",
    ],
  },

  havas: {
    name: "Havas",
    mission:
      "Üdvözöllek, {player}! Juss át a jeges pusztaság veszélyein, és győzd le a fagy urát!",

    background: "assets/img/backgrounds/havas_hatter.png",

    lena: [
      "assets/img/lena/havas/lenah1.png",
      "assets/img/lena/havas/lenah2.png",
      "assets/img/lena/havas/lenah3.png",
      "assets/img/lena/havas/lenah4.png",
    ],
    lenaHurt: [
      "assets/img/lena/havas/lenah1_hurt.png",
      "assets/img/lena/havas/lenah2_hurt.png",
      "assets/img/lena/havas/lenah3_hurt.png",
      "assets/img/lena/havas/lenah4_hurt.png",
    ],
    lenaHurtJump: "assets/img/lena/havas/lenah5_hurt.png",

    enemy: [
      "assets/img/enemies/havas/ellenh1.png",
      "assets/img/enemies/havas/ellenh2.png",
    ],
  },

  mars: {
    name: "Mars",
    mission:
      "Üdvözöllek, {player}! A marsi robotok elfoglalták a vidéket. Semmisítsd meg őket és a főegységet!",

    background: "assets/img/backgrounds/mars_hatter.png",

    lena: [
      "assets/img/lena/mars/lenam1.png",
      "assets/img/lena/mars/lenam2.png",
      "assets/img/lena/mars/lenam3.png",
      "assets/img/lena/mars/lenam4.png",
    ],
    lenaHurt: [
      "assets/img/lena/mars/lenam1_hurt.png",
      "assets/img/lena/mars/lenam2_hurt.png",
      "assets/img/lena/mars/lenam3_hurt.png",
      "assets/img/lena/mars/lenam4_hurt.png",
    ],
    lenaHurtJump: "assets/img/lena/mars/lenam5_hurt.png",

    enemy: [
      "assets/img/enemies/mars/ellenm1.png",
      "assets/img/enemies/mars/ellenm2.png",
    ],
  },
};

/* =========================
   ALAPÉRTELMEZETT ADATOK
========================= */
// Alapértelmezett pálya beállítása
if (!localStorage.getItem("selectedWorld")) {
  localStorage.setItem("selectedWorld", "erdo");
}
// Alapértelmezett játékosnév beállítása
if (!localStorage.getItem("playerName")) {
  localStorage.setItem("playerName", "Játékos1");
}
// Alapértelmezett nehézség beállítása
if (!localStorage.getItem("difficulty")) {
  localStorage.setItem("difficulty", "normal");
}
// Alapértelmezett hangbeállítás
if (!localStorage.getItem("sound")) {
  localStorage.setItem("sound", "on");
}

/* =========================
   MENÜ OLDAL
========================= */

const menuWrapper = document.getElementById("menuWrapper");

if (menuWrapper) {
  checkLogin();

  initializeMenu();
}
// Bejelentkezés ellenőrzése
function checkLogin() {
  fetch("backend/get_user.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        window.location.href = "login.html";
      }
    });
}

/* =========================
   MENÜ INDÍTÁS
========================= */
// Menü inicializálása és mentett beállítások betöltése
function initializeMenu() {
  const playerName = localStorage.getItem("playerName");

  const selectedWorld = localStorage.getItem("selectedWorld");

  const difficulty = localStorage.getItem("difficulty");

  const sound = localStorage.getItem("sound");

  const playerInput = document.getElementById("playerNameInput");

  const worldSelect = document.getElementById("worldSelect");

  const difficultySelect = document.getElementById("difficultySelect");

  const soundSelect = document.getElementById("soundSelect");

  if (playerInput) {
    playerInput.value = playerName;

    playerInput.disabled = true;

    playerInput.title = "A játékosnév a bejelentkezett felhasználó neve.";
  }

  if (worldSelect) {
    worldSelect.value = selectedWorld;

    worldSelect.addEventListener("change", updatePreview);
  }

  if (difficultySelect) {
    difficultySelect.value = difficulty;
  }

  if (soundSelect) {
    soundSelect.value = sound;
  }

  updatePreview();

  startMenuAnimations();
  loadLeaderboard();
  loadLoggedInUser();
}

/* =========================
   PANEL VÁLTÁS
========================= */
// Menüpanelen belüli váltás kezelése
function showPanel(panelId, button) {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.remove("activePanel");
  });

  document.querySelectorAll(".menuBtn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(panelId).classList.add("activePanel");

  button.classList.add("active");
}

/* =========================
   BEÁLLÍTÁSOK MENTÉSE
========================= */
// Játékbeállítások mentése
function saveSettings() {
  const playerName = document.getElementById("playerNameInput").value.trim();

  const world = document.getElementById("worldSelect").value;

  const difficulty = document.getElementById("difficultySelect").value;

  const sound = document.getElementById("soundSelect").value;

  localStorage.setItem("playerName", playerName || "Játékos1");

  localStorage.setItem("selectedWorld", world);

  localStorage.setItem("difficulty", difficulty);

  localStorage.setItem("sound", sound);

  updatePreview();

  alert("Beállítások elmentve!");
}

/* =========================
   START PANEL FRISSÍTÉS
========================= */
// Start panel előnézetének frissítése
function updatePreview() {
  const selectedWorld =
    document.getElementById("worldSelect")?.value ||
    localStorage.getItem("selectedWorld");

  const playerName =
    document.getElementById("playerNameInput")?.value ||
    localStorage.getItem("playerName");

  const world = worlds[selectedWorld];

  document.body.style.backgroundImage = `url("${world.background}")`;

  const currentPlayer = document.getElementById("currentPlayerName");

  if (currentPlayer) {
    currentPlayer.textContent = playerName;
  }

  const currentWorld = document.getElementById("currentWorldName");

  if (currentWorld) {
    currentWorld.textContent = world.name;
  }

  const welcome = document.getElementById("welcomeText");

  if (welcome) {
    welcome.textContent = `Üdvözöllek kedves ${playerName}!`;
  }
}

/* =========================
   MENÜ ANIMÁCIÓ
========================= */

let lenaFrame = 0;
let enemyFrame = 0;

function startMenuAnimations() {
  const lena = document.getElementById("menuLena");

  const enemy = document.getElementById("menuEnemy");

  if (!lena || !enemy) return;

  setInterval(() => {
    const world = worlds[localStorage.getItem("selectedWorld")];

    lena.src = world.lena[lenaFrame];

    lenaFrame++;

    if (lenaFrame >= world.lena.length) {
      lenaFrame = 0;
    }
  }, 250);

  setInterval(() => {
    const world = worlds[localStorage.getItem("selectedWorld")];

    enemy.src = world.enemy[enemyFrame];

    enemyFrame++;

    if (enemyFrame >= world.enemy.length) {
      enemyFrame = 0;
    }
  }, 400);
}

/* =========================
   JÁTÉK OLDAL
========================= */
// Játékoldal elemeinek inicializálása
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("scoreDisplay");

const lifeDisplay = document.getElementById("lifeDisplay");
const bossHpDisplay = document.getElementById("bossHpDisplay");

const worldDisplay = document.getElementById("worldDisplay");
const difficultyDisplay = document.getElementById("difficultyDisplay");
const gameOverPanel = document.getElementById("gameOverPanel");
const restartButton = document.getElementById("restartButton");
const finalScore = document.getElementById("finalScore");
const victoryPanel = document.getElementById("victoryPanel");

const victoryScore = document.getElementById("victoryScore");

const victoryRestartButton = document.getElementById("victoryRestartButton");

const victoryMenuButton = document.getElementById("victoryMenuButton");
const menuButton = document.getElementById("menuButton");
let backgroundInterval;
let enemyShootInterval;
// Játék indítása és kezdeti állapotok beállítása
if (gameArea) {
  fetch("backend/get_user.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        window.location.href = "login.html";
      }
    });
  restartButton.addEventListener("click", () => {
    location.reload();
  });
  victoryRestartButton.addEventListener("click", () => {
    location.reload();
  });
  menuButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  victoryMenuButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  const player = document.getElementById("player");

  const enemy = document.getElementById("enemy");

  const selectedWorld = localStorage.getItem("selectedWorld");

  const currentWorld = worlds[selectedWorld];

  gameArea.style.backgroundImage = `url("${currentWorld.background}")`;
  const missionText = document.getElementById("missionText");

  if (missionText) {
    const playerName = localStorage.getItem("playerName");

    missionText.textContent = currentWorld.mission.replace(
      "{player}",
      playerName,
    );

    missionText.style.display = "block";

    setTimeout(() => {
      missionText.style.display = "none";
    }, 5000);
  }

  player.src = currentWorld.lena[0];

  enemy.src = currentWorld.enemy[0];

  /* =========================
   LÉNA ANIMÁCIÓ
========================= */

  let lenaFrame = 0;

  setInterval(() => {
    lenaFrame++;

    const lenaFrames =
      playerLives === 1 ? currentWorld.lenaHurt : currentWorld.lena;

    if (lenaFrame >= lenaFrames.length) {
      lenaFrame = 0;
    }

    if (playerLives === 1 && isJumping) {
      player.src = currentWorld.lenaHurtJump;
    } else {
      player.src = lenaFrames[lenaFrame];
    }
  }, 250);

  /* =========================
       ELLENSÉG ANIMÁCIÓ
    ========================= */

  let enemyFrame = 0;

  setInterval(() => {
    enemyFrame++;

    if (isBossFight) {
      const bossFrames = [
        "assets/img/enemies/boss/boss1.png",
        "assets/img/enemies/boss/boss2.png",
        "assets/img/enemies/boss/boss3.png",
        "assets/img/enemies/boss/boss4.png",
      ];

      if (enemyFrame >= bossFrames.length) {
        enemyFrame = 0;
      }

      enemy.src = bossFrames[enemyFrame];

      return;
    }

    if (enemyFrame >= currentWorld.enemy.length) {
      enemyFrame = 0;
    }

    enemy.src = currentWorld.enemy[enemyFrame];
  }, 400);

  /* =========================
       HÁTTÉR SCROLL
    ========================= */

  let backgroundX = 0;

  backgroundInterval = setInterval(() => {
    backgroundX -= 2;

    gameArea.style.backgroundPosition = `${backgroundX}px center`;
  }, 30);

  /* =========================
       ELSŐ ELLENSÉGES LÖVÉS
    ========================= */
  createEnemyProjectile();

  enemyShootInterval = setInterval(() => {
    if (isGameOver) {
      return;
    }

    createEnemyProjectile();
  }, 1500);
}

/* =========================
   UGRÁS RENDSZER
========================= */
// Játékállapot változók
let isJumping = false;
let score = 0;
let enemyCount = 0;
let isBossFight = false;
let bossHp = 10;
let playerLives = 2;
let isGameOver = false;
if (gameArea) {
  setTimeout(() => {
    updateHUD();
  }, 100);
}

const difficulty = localStorage.getItem("difficulty");

let maxEnemies = 3;

if (difficulty === "easy") {
  maxEnemies = 1;
}

if (difficulty === "normal") {
  maxEnemies = 3;
}

if (difficulty === "hard") {
  maxEnemies = 9;
}
// Ugrás végrehajtása
function jump() {
  if (isGameOver) {
    return;
  }

  if (isJumping) {
    return;
  }

  const player = document.getElementById("player");

  if (!player) {
    return;
  }

  isJumping = true;

  player.style.transition = "bottom 0.3s ease";

  player.style.bottom = "260px";

  setTimeout(() => {
    player.style.bottom = "75px";
  }, 500);

  setTimeout(() => {
    isJumping = false;
  }, 1000);
}

/* =========================
   BILLENTYŰK
========================= */
// Billentyűzet vezérlés
window.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();

    jump();
  }

  if (event.code === "ControlLeft") {
    createPlayerProjectile();
  }
});

window.focus();

/* =========================
   MOBIL GOMBOK
========================= */
// Mobil vezérlőgombok kezelése
const jumpButton = document.getElementById("jumpButton");

if (jumpButton) {
  jumpButton.addEventListener("click", jump);
}

const shootButton = document.getElementById("shootButton");

if (shootButton) {
  shootButton.addEventListener("click", () => {
    createPlayerProjectile();
  });
}

/* =========================
   ELLENSÉG LÖVEDÉK
========================= */
// Ellenséges lövedék létrehozása
function createEnemyProjectile() {
  const gameArea = document.getElementById("gameArea");

  const enemy = document.getElementById("enemy");

  const player = document.getElementById("player");

  if (!gameArea || !enemy || !player) {
    return;
  }

  const projectile = document.createElement("div");

  projectile.classList.add("enemyProjectile");

  projectile.style.left = enemy.offsetLeft - 20 + "px";

  let projectileTop = 40;

  const selectedWorld = localStorage.getItem("selectedWorld");

  if (selectedWorld === "erdo") {
    projectileTop = 70;
  }

  if (selectedWorld === "mars") {
    projectileTop = 70;
  }

  if (selectedWorld === "havas") {
    projectileTop = 60;
  }

  projectile.style.top = enemy.offsetTop + projectileTop + "px";

  gameArea.appendChild(projectile);
  const sound = localStorage.getItem("sound");

  if (sound === "on") {
    shootSound.currentTime = 0;
    shootSound.play();
  }

  let position = enemy.offsetLeft - 20;

  const moveInterval = setInterval(() => {
    position -= 10;

    projectile.style.left = position + "px";

    /* =====================
               ÜTKÖZÉSVIZSGÁLAT
            ===================== */

    const projectileRect = projectile.getBoundingClientRect();

    const playerRect = player.getBoundingClientRect();

    const hit =
      projectileRect.left < playerRect.right &&
      projectileRect.right > playerRect.left &&
      projectileRect.top < playerRect.bottom &&
      projectileRect.bottom > playerRect.top;

    if (hit) {
      if (isGameOver) {
        return;
      }

      console.log("TALÁLAT!");
      playerLives--;
      const sound = localStorage.getItem("sound");

      if (sound === "on") {
        hitSound.currentTime = 0;
        hitSound.play();
      }
      updateHUD();
      projectile.remove();

      clearInterval(moveInterval);

      return;
    }

    if (position < -20) {
      clearInterval(moveInterval);

      projectile.remove();
    }
  }, 30);
}

/* =========================
   JÁTÉKOS LÖVÉK
========================= */
// Játékos lövedék létrehozása
function createPlayerProjectile() {
  if (isGameOver) {
    return;
  }

  const gameArea = document.getElementById("gameArea");

  const player = document.getElementById("player");

  if (!gameArea || !player) {
    return;
  }

  const projectile = document.createElement("div");

  projectile.style.position = "absolute";

  projectile.style.width = "32px";

  projectile.style.height = "16px";

  projectile.style.backgroundImage = "url('assets/img/bullet/lena.png')";

  projectile.style.backgroundSize = "contain";

  projectile.style.backgroundRepeat = "no-repeat";

  projectile.style.backgroundPosition = "center";

  projectile.style.left = player.offsetLeft + 140 + "px";

  projectile.style.top = player.offsetTop + 40 + "px";

  gameArea.appendChild(projectile);
  const sound = localStorage.getItem("sound");

  if (sound === "on") {
    shootSound.currentTime = 0;
    shootSound.play();
  }
  let position = player.offsetLeft + 140;

  const moveInterval = setInterval(() => {
    position += 15;

    projectile.style.left = position + "px";

    /* =====================
               ELLENSÉG TALÁLAT
            ===================== */

    const enemy = document.getElementById("enemy");

    if (enemy) {
      const projectileRect = projectile.getBoundingClientRect();

      const enemyRect = enemy.getBoundingClientRect();

      const hit =
        projectileRect.left < enemyRect.right &&
        projectileRect.right > enemyRect.left &&
        projectileRect.top < enemyRect.bottom &&
        projectileRect.bottom > enemyRect.top;

      if (isBossFight && hit) {
        bossHp--;
        const sound = localStorage.getItem("sound");

        if (sound === "on") {
          hitSound.currentTime = 0;
          hitSound.play();
        }

        console.log("Boss HP: " + bossHp);
        updateHUD();

        projectile.remove();

        clearInterval(moveInterval);

        if (bossHp <= 0) {
          clearInterval(backgroundInterval);
          clearInterval(enemyShootInterval);
          score += 10;
          const sound = localStorage.getItem("sound");

          if (sound === "on") {
            victorySound.currentTime = 0;
            victorySound.play();
          }
          saveScore();

          console.log("GYŐZELEM!");

          enemy.style.display = "none";
          const player = document.getElementById("player");

          player.style.display = "none";
          isGameOver = true;

          gameOverPanel.style.display = "none";

          victoryScore.textContent = "Pontszám: " + score;

          victoryPanel.style.display = "block";
        }

        return;
      }

      if (hit) {
        const sound = localStorage.getItem("sound");

        if (sound === "on") {
          hitSound.currentTime = 0;
          hitSound.play();
        }
        score++;
        enemyCount++;
        updateHUD();

        console.log("ELLENSÉG LEGYŐZVE!");

        console.log("Pontszám: " + score);

        console.log("Legyőzött ellenfelek: " + enemyCount);

        /* =====================
                       ÚJ ELLENSÉG
                    ===================== */

        if (enemyCount < maxEnemies) {
          setTimeout(() => {
            enemy.style.display = "block";
          }, 1000);
        } else {
          console.log("BOSS KÖVETKEZIK!");

          isBossFight = true;

          bossHp = 10;
          updateHUD();

          enemy.style.display = "block";

          enemy.src = "assets/img/enemies/boss/boss1.png";
        }

        projectile.remove();

        if (!isBossFight) {
          enemy.style.display = "none";
        }

        clearInterval(moveInterval);

        return;
      }
    }

    if (position > gameArea.offsetWidth) {
      clearInterval(moveInterval);

      projectile.remove();
    }
  }, 20);
}
// Játékinformációk frissítése a HUD-on
function updateHUD() {
  console.log("Életek:", playerLives);

  scoreDisplay.textContent = "Pontszám: " + score;

  const selectedWorld = localStorage.getItem("selectedWorld");

  worldDisplay.textContent = "Pálya: " + worlds[selectedWorld].name;
  let difficultyText = "";
  let enemyText = "";

  if (difficulty === "easy") {
    difficultyText = "Könnyű";
    enemyText = "1 ellenfél + 1 boss";
  }

  if (difficulty === "normal") {
    difficultyText = "Normál";
    enemyText = "3 ellenfél + 1 boss";
  }

  if (difficulty === "hard") {
    difficultyText = "Nehéz";
    enemyText = "9 ellenfél + 1 boss";
  }

  difficultyDisplay.textContent =
    "Nehézség: " + difficultyText + " (" + enemyText + ")";
  if (isBossFight) {
    bossHpDisplay.textContent = "Boss HP: " + bossHp;
  } else {
    bossHpDisplay.textContent = "Boss HP: -";
  }

  if (playerLives === 2) {
    lifeDisplay.textContent = "Élet: 2/2";
  }

  if (playerLives === 1) {
    lifeDisplay.textContent = "Élet: 1/2";
  }

  if (playerLives <= 0 && !isGameOver) {
    const sound = localStorage.getItem("sound");

    if (sound === "on") {
      gameOverSound.currentTime = 0;
      gameOverSound.play();
    }
    clearInterval(backgroundInterval);
    clearInterval(enemyShootInterval);

    isGameOver = true;

    const player = document.getElementById("player");

    const enemy = document.getElementById("enemy");

    player.style.display = "none";

    enemy.style.display = "none";

    lifeDisplay.textContent = "Élet: 0/2";
    finalScore.textContent = "Pontszám: " + score;

    gameOverPanel.style.display = "block";
  }
}
// Eredmény mentése az adatbázisba
function saveScore() {
  const selectedWorld = localStorage.getItem("selectedWorld");

  const difficulty = localStorage.getItem("difficulty");

  let difficultyText = "";

  if (difficulty === "easy") {
    difficultyText = "Könnyű";
  }

  if (difficulty === "normal") {
    difficultyText = "Normál";
  }

  if (difficulty === "hard") {
    difficultyText = "Nehéz";
  }

  const formData = new FormData();

  formData.append("score", score);
  formData.append("world", worlds[selectedWorld].name);
  formData.append("difficulty", difficultyText);

  fetch("backend/save_score.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    });
}
// Ranglista betöltése
function loadLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");

  if (!leaderboardList) {
    return;
  }

  fetch("backend/get_leaderboard.php")
    .then((response) => response.json())
    .then((leaderboard) => {
      if (leaderboard.length === 0) {
        leaderboardList.textContent = "Még nincs mentett eredmény.";

        return;
      }

      leaderboardList.innerHTML = "";

      leaderboard.forEach((item, index) => {
        const row = document.createElement("p");

        row.textContent =
          index +
          1 +
          ". " +
          item.username +
          " – " +
          item.score +
          " pont – " +
          item.world +
          " – " +
          item.difficulty +
          " – " +
          item.played_at;

        leaderboardList.appendChild(row);
      });
    });
}
// Ranglista törlése (admin)
function clearLeaderboard() {
  if (!confirm("Biztosan törlöd a ranglistát?")) {
    return;
  }

  fetch("backend/delete_leaderboard.php")
    .then((response) => response.text())
    .then((data) => {
      alert(data);

      loadLeaderboard();
    });
}
// Bejelentkezett felhasználó adatainak betöltése
function loadLoggedInUser() {
  fetch("backend/get_user.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        return;
      }
      loggedInUserId = data.user_id;
      const adminBox = document.getElementById("adminBox");
      const leaderboardAdminControls = document.getElementById(
        "leaderboardAdminControls",
      );

      if (adminBox) {
        if (data.role === "admin") {
          adminBox.style.display = "block";
          if (leaderboardAdminControls) {
            leaderboardAdminControls.style.display = "block";
          }

          loadAdminStats();
          loadUsers();
        } else {
          adminBox.style.display = "none";
          if (leaderboardAdminControls) {
            leaderboardAdminControls.style.display = "none";
          }
        }
      }
      localStorage.setItem("playerName", data.username);
      const playerNameInput = document.getElementById("playerNameInput");

      if (playerNameInput) {
        playerNameInput.value = data.username;
      }
      const loginInfo = document.getElementById("loginInfo");

      if (loginInfo) {
        loginInfo.textContent = "Bejelentkezve: " + data.username;
      }

      const currentPlayerName = document.getElementById("currentPlayerName");

      if (currentPlayerName) {
        currentPlayerName.textContent = data.username;
      }

      const welcomeText = document.getElementById("welcomeText");

      if (welcomeText) {
        welcomeText.textContent = "Üdvözöllek kedves " + data.username + "!";
      }
    });
}
// Felhasználói jelszó módosítása
function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value;

  const newPassword = document.getElementById("newPassword").value;

  if (!oldPassword || !newPassword) {
    alert("Add meg a régi és az új jelszót is!");

    return;
  }

  const formData = new FormData();

  formData.append("oldPassword", oldPassword);
  formData.append("newPassword", newPassword);

  fetch("backend/change_password.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);

      document.getElementById("oldPassword").value = "";
      document.getElementById("newPassword").value = "";
    });
}
// Felhasználók listájának betöltése
function loadUsers() {
  const usersList = document.getElementById("usersList");

  if (!usersList) {
    return;
  }

  fetch("backend/get_users.php")
    .then((response) => response.json())
    .then((users) => {
      usersList.innerHTML = "";

      if (users.length === 0) {
        usersList.textContent = "Nincs megjeleníthető felhasználó.";

        return;
      }

      users.forEach((user) => {
        const row = document.createElement("div");

        row.className = "userRow";

        const info = document.createElement("div");

        info.className = "userInfo";

        info.textContent = user.username + " (" + user.role + ")";

        row.appendChild(info);

        row.textContent =
          user.username + " – " + user.role + " – " + user.created_at + " ";

        if (
          user.username !== "admin" &&
          Number(user.id) !== Number(loggedInUserId)
        ) {
          const roleButton = document.createElement("button");

          if (user.role === "admin") {
            roleButton.textContent = "Userré tesz";

            roleButton.onclick = function () {
              changeRole(user.id, "user");
            };
          } else {
            roleButton.textContent = "Adminná tesz";

            roleButton.onclick = function () {
              changeRole(user.id, "admin");
            };
          }

          row.appendChild(roleButton);

          const deleteButton = document.createElement("button");

          deleteButton.textContent = "Törlés";

          deleteButton.onclick = function () {
            deleteUser(user.id);
          };

          row.appendChild(deleteButton);
        }

        usersList.appendChild(row);
      });
    });
}
// Felhasználó törlése
function deleteUser(userId) {
  if (!confirm("Biztosan törlöd ezt a felhasználót?")) {
    return;
  }

  const formData = new FormData();

  formData.append("userId", userId);

  fetch("backend/delete_user.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);

      loadUsers();
      loadAdminStats();
    });
}
// Felhasználói jogosultság módosítása
function changeRole(userId, role) {
  if (!confirm("Biztosan módosítod a felhasználó jogosultságát?")) {
    return;
  }

  const formData = new FormData();

  formData.append("userId", userId);
  formData.append("role", role);

  fetch("backend/change_role.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);

      loadUsers();
      loadAdminStats();
    });
}
function loadAdminStats() {
  const adminStats = document.getElementById("adminStats");

  if (!adminStats) {
    return;
  }

  fetch("backend/get_admin_stats.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        return;
      }

      adminStats.innerHTML =
        "<strong>Statisztika</strong><br><br>" +
        "Felhasználók száma: " +
        data.stats.users +
        "<br>" +
        "Adminok száma: " +
        data.stats.admins +
        "<br>" +
        "Ranglista rekordok: " +
        data.stats.scores;
    });
}
