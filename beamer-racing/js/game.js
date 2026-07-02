// Bejelentkezés és játék inicializálása
fetch("backend/get_user.php")
  .then((response) => response.json())
  .then((user) => {
    if (!user.logged_in) {
      window.location.href = "login.html";
      return;
    }

    localStorage.setItem("playerName", user.username);
    localStorage.setItem("userRole", user.role);
  });
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

    document.body.style.display = "block";
  })
  .catch(() => {
    window.location.replace("login.html");
  });
// Játék elemeinek inicializálása
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const timeValue = document.getElementById("timeValue");
const speedValue = document.getElementById("speedValue");
const moneyValue = document.getElementById("moneyValue");
const backToMenuBtn = document.getElementById("backToMenuBtn");

const selectedCar = localStorage.getItem("selectedCar") || "A";
const playerName = localStorage.getItem("playerName") || "Vendég";

const carNameValue = document.getElementById("carNameValue");
const difficultyValue = document.getElementById("difficultyValue");
const progressFill = document.getElementById("progressFill");
const endGamePanel = document.getElementById("endGamePanel");

const endGameTitle = document.getElementById("endGameTitle");
const endPlayerNameValue = document.getElementById("endPlayerNameValue");

const endTimeValue = document.getElementById("endTimeValue");

const endMoneyValue = document.getElementById("endMoneyValue");
const endCarValue = document.getElementById("endCarValue");

const endDifficultyValue = document.getElementById("endDifficultyValue");

const restartBtn = document.getElementById("restartBtn");

const menuBtn = document.getElementById("menuBtn");

const TRACK_LENGTH = 15000;
let screenShake = 0;
const SHAKE_POWER = 8;

let distanceTravelled = 0;
let raceFinished = false;
let finalTimeText = "00:00:00";
let crashed = false;

const carDisplayNames = {
  A: "Falcon",
  B: "Viper",
};

carNameValue.textContent = carDisplayNames[selectedCar] || "Falcon";

const selectedDifficulty =
  localStorage.getItem("selectedDifficulty") || "normal";

const difficultyDisplayNames = {
  easy: "Könnyű",
  normal: "Normál",
  hard: "Nehéz",
};

difficultyValue.textContent =
  difficultyDisplayNames[selectedDifficulty] || "Normál";
// Képek és hangok betöltése
const roadImage = new Image();
roadImage.src = "assets/img/road/erdo.png";
const concreteBlockImage = new Image();
concreteBlockImage.src = "assets/img/obstacles/concrete_block.png";
const moneyImage = new Image();
moneyImage.src = "assets/img/money/money.png";
const engineSound = new Audio("assets/audio/car/car_engine.mp3");
const crashSound = new Audio("assets/audio/car/car_crashes.mp3");
const moneySound = new Audio("assets/audio/money/money.mp3");
engineSound.loop = true;
engineSound.volume = 0.8;
engineSound.playbackRate = 0.4;

crashSound.volume = 0.2;

moneySound.volume = 0.7;
const soundEnabled = localStorage.getItem("soundEnabled") !== "false";

engineSound.muted = !soundEnabled;
crashSound.muted = !soundEnabled;
moneySound.muted = !soundEnabled;

const carFrames = [];
const carPrefix = selectedCar.toLowerCase() === "b" ? "autob" : "autoa";
const goText = document.getElementById("goText");

for (let i = 1; i <= 5; i++) {
  const img = new Image();
  img.src = `assets/img/cars/${carPrefix}${i}.png`;
  carFrames.push(img);
}

let canvasWidth = 0;
let canvasHeight = 0;

let scrollY = 0;
let speed = 0;
let money = 0;
let startTime = performance.now();

const minSpeed = 0;
// Nehézségi beállítások
const difficultySettings = {
  easy: {
    obstacleCount: 12,
    moneyCount: 30,
    maxSpeed: 13,
  },
  normal: {
    obstacleCount: 20,
    moneyCount: 25,
    maxSpeed: 15,
  },
  hard: {
    obstacleCount: 30,
    moneyCount: 20,
    maxSpeed: 18,
  },
};

const currentDifficultySettings =
  difficultySettings[selectedDifficulty] || difficultySettings.normal;

const maxSpeed = currentDifficultySettings.maxSpeed;
const acceleration = 0.35;
const brake = 0.45;

const car = {
  width: 92,
  height: 218,
  x: 0,
  y: 0,
  moveSpeed: 8,
  frame: 0,
  frameTimer: 0,
  frameDelay: 8,
};
const OBSTACLE_COUNT = currentDifficultySettings.obstacleCount;

const obstacles = [];

const obstacleSettings = {
  width: 120,
  height: 70,
};
const MONEY_COUNT = currentDifficultySettings.moneyCount;

const moneyPiles = [];
const floatingTexts = [];

const moneySettings = {
  width: 70,
  height: 70,
  value: 100,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};
// Játéktér méretezése
function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  car.width = Math.max(64, Math.min(92, canvasWidth * 0.11));
  car.height = car.width * 2.37;

  car.x = canvasWidth / 2 - car.width / 2;
  car.y = canvasHeight - car.height - 34;

  keepCarOnRoad();
}

function getRoadWidth() {
  return Math.min(500, canvasWidth * 0.52);
}

function getRoadLeft() {
  return canvasWidth / 2 - getRoadWidth() / 2;
}

function getRoadRight() {
  return canvasWidth / 2 + getRoadWidth() / 2;
}

function keepCarOnRoad() {
  const leftLimit = getRoadLeft() + 18;
  const rightLimit = getRoadRight() - car.width - 18;

  if (car.x < leftLimit) {
    car.x = leftLimit;
  }

  if (car.x > rightLimit) {
    car.x = rightLimit;
  }
}
// Sebesség frissítése
function updateSpeed() {
  if (raceFinished) {
    return;
  }

  if (keys.ArrowUp) {
    speed += acceleration;

    if (engineSound.paused) {
      engineSound.play();
    }
  }

  if (keys.ArrowDown) {
    speed -= brake;
  }

  if (speed < minSpeed) {
    speed = minSpeed;
  }

  if (speed > maxSpeed) {
    speed = maxSpeed;
  }
}
// Motorhang frissítése
function updateEngineSound() {
  if (raceFinished) {
    engineSound.pause();
    engineSound.currentTime = 0;
    return;
  }

  if (speed <= 0) {
    engineSound.playbackRate = 0.4;
    return;
  }

  const speedRatio = speed / maxSpeed;

  const targetRate = 0.4 + speedRatio * 6.2;

  engineSound.playbackRate = Math.min(targetRate, 4.0);
}
// Játékos autó mozgatása
function updateCar() {
  // Ha áll az autó, ne lehessen jobbra-balra mozogni
  if (speed <= 0 || raceFinished) {
    return;
  }

  if (keys.ArrowLeft) {
    car.x -= car.moveSpeed;
  }

  if (keys.ArrowRight) {
    car.x += car.moveSpeed;
  }

  keepCarOnRoad();
}

function updateProgressBar() {
  const percent = Math.min(100, (distanceTravelled / TRACK_LENGTH) * 100);

  progressFill.style.width = percent + "%";
}
// HUD frissítése
function updateHud() {
  if (raceFinished) {
    timeValue.textContent = finalTimeText;
    speedValue.textContent = "0 km/h";
    moneyValue.textContent = money + "$";
    return;
  }
  const elapsed = Math.floor((performance.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  timeValue.textContent = `00:${minutes}:${seconds}`;
  speedValue.textContent = Math.round(speed * 10) + " km/h";
  moneyValue.textContent = money + "$";
}
// Háttér kirajzolása
function drawBackground() {
  if (!raceFinished) {
    scrollY += speed;
  }
  scrollY %= canvasHeight;

  ctx.drawImage(roadImage, 0, scrollY, canvasWidth, canvasHeight);
  ctx.drawImage(
    roadImage,
    0,
    scrollY - canvasHeight,
    canvasWidth,
    canvasHeight,
  );
}
// Autó kirajzolása
function drawCar() {
  let currentImage;

  if (crashed) {
    currentImage = carFrames[4];
  } else {
    car.frameTimer++;

    if (car.frameTimer >= car.frameDelay) {
      car.frameTimer = 0;
      car.frame++;

      if (car.frame >= 4) {
        car.frame = 0;
      }
    }

    currentImage = carFrames[car.frame];
  }

  if (currentImage.complete && currentImage.naturalWidth > 0) {
    ctx.drawImage(currentImage, car.x, car.y, car.width, car.height);
  }
}
function getRandomRoadX(objectWidth) {
  const roadLeft = getRoadLeft() + 22;
  const roadRight = getRoadRight() - objectWidth - 22;

  return Math.random() * (roadRight - roadLeft) + roadLeft;
}
// Akadályok létrehozása
function generateObstacles() {
  obstacles.length = 0;

  const startY = -600;
  const spacing = TRACK_LENGTH / OBSTACLE_COUNT;

  for (let i = 0; i < OBSTACLE_COUNT; i++) {
    obstacles.push({
      width: obstacleSettings.width,
      height: obstacleSettings.height,
      x: getRandomRoadX(obstacleSettings.width),
      y: startY - i * spacing,
    });
  }
}
// Pénzkupacok létrehozása
function generateMoneyPiles() {
  moneyPiles.length = 0;

  const startY = -400;
  const spacing = TRACK_LENGTH / MONEY_COUNT;

  for (let i = 0; i < MONEY_COUNT; i++) {
    moneyPiles.push({
      width: moneySettings.width,
      height: moneySettings.height,
      x: getRandomRoadX(moneySettings.width),
      y: startY - i * spacing,
      collected: false,
    });
  }
}
function updateMoneyPiles() {
  if (raceFinished) {
    return;
  }

  moneyPiles.forEach((moneyPile) => {
    moneyPile.y += speed;
  });
}

function drawMoneyPiles() {
  if (!moneyImage.complete) {
    return;
  }

  moneyPiles.forEach((moneyPile) => {
    if (moneyPile.collected) {
      return;
    }

    ctx.drawImage(
      moneyImage,
      moneyPile.x,
      moneyPile.y,
      moneyPile.width,
      moneyPile.height,
    );
  });
}
// Pénz felvétele
function checkMoneyCollection() {
  if (raceFinished) {
    return;
  }

  const carHitbox = {
    x: car.x + 12,
    y: car.y + 18,
    width: car.width - 24,
    height: car.height - 36,
  };

  moneyPiles.forEach((moneyPile) => {
    if (moneyPile.collected) {
      return;
    }

    const moneyHitbox = {
      x: moneyPile.x + 8,
      y: moneyPile.y + 8,
      width: moneyPile.width - 16,
      height: moneyPile.height - 16,
    };

    const collected =
      carHitbox.x < moneyHitbox.x + moneyHitbox.width &&
      carHitbox.x + carHitbox.width > moneyHitbox.x &&
      carHitbox.y < moneyHitbox.y + moneyHitbox.height &&
      carHitbox.y + carHitbox.height > moneyHitbox.y;

    if (collected) {
      moneyPile.collected = true;
      money += moneySettings.value;
      floatingTexts.push({
        x: moneyPile.x + moneyPile.width / 2,
        y: moneyPile.y,
        text: "+" + moneySettings.value + "$",
        life: 60,
      });

      moneySound.currentTime = 0;
      moneySound.play();
    }
  });
}
function updateObstacles() {
  if (raceFinished) {
    return;
  }

  obstacles.forEach((obstacle) => {
    obstacle.y += speed;
  });
}

function drawObstacles() {
  if (!concreteBlockImage.complete) {
    return;
  }

  obstacles.forEach((obstacle) => {
    ctx.drawImage(
      concreteBlockImage,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height,
    );
  });
}
// Ütközésvizsgálat
function checkObstacleCollision() {
  if (raceFinished) {
    return;
  }

  const carHitbox = {
    x: car.x + car.width * 0.28,
    y: car.y + car.height * 0.18,
    width: car.width * 0.44,
    height: car.height * 0.68,
  };

  for (const obstacle of obstacles) {
    const obstacleHitbox = {
      x: obstacle.x + obstacle.width * 0.22,
      y: obstacle.y + obstacle.height * 0.25,
      width: obstacle.width * 0.56,
      height: obstacle.height * 0.5,
    };

    const collision =
      carHitbox.x < obstacleHitbox.x + obstacleHitbox.width &&
      carHitbox.x + carHitbox.width > obstacleHitbox.x &&
      carHitbox.y < obstacleHitbox.y + obstacleHitbox.height &&
      carHitbox.y + carHitbox.height > obstacleHitbox.y;

    if (collision) {
      screenShake = 20;

      crashed = true;
      car.frame = 4;
      raceFinished = true;
      speed = 0;

      engineSound.pause();
      engineSound.currentTime = 0;

      crashSound.currentTime = 0;
      crashSound.play();

      setTimeout(() => {
        showGameOverPanel();
      }, 250);

      return;
    }
  }
}
function updateFloatingTexts() {
  floatingTexts.forEach((text) => {
    text.y -= 1.2;
    text.life--;
  });

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    if (floatingTexts[i].life <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}

function drawFloatingTexts() {
  floatingTexts.forEach((text) => {
    ctx.save();

    ctx.globalAlpha = text.life / 60;
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "gold";
    ctx.textAlign = "center";

    ctx.fillText(text.text, text.x, text.y);

    ctx.restore();
  });
}
// Játék fő ciklusa
function gameLoop() {
  ctx.save();

  if (screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * SHAKE_POWER;

    const shakeY = (Math.random() - 0.5) * SHAKE_POWER;

    ctx.translate(shakeX, shakeY);

    screenShake--;
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  updateSpeed();
  updateEngineSound();

  if (!raceFinished) {
    distanceTravelled += speed;
  }
  if (distanceTravelled >= TRACK_LENGTH && !raceFinished) {
    raceFinished = true;

    speed = 0;

    engineSound.pause();
    engineSound.currentTime = 0;

    showVictoryPanel();
  }

  drawBackground();
  updateObstacles();
  drawObstacles();

  updateMoneyPiles();
  drawMoneyPiles();
  updateFloatingTexts();
  drawFloatingTexts();

  updateCar();

  checkMoneyCollection();
  checkObstacleCollision();

  drawCar();

  updateHud();
  updateProgressBar();
  ctx.restore();

  requestAnimationFrame(gameLoop);
}
// Billentyűzet vezérlés
window.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
    event.preventDefault();
  }
});
// Mobil irányítás kezelése
function bindMobileButton(buttonId, keyName) {
  const button = document.getElementById(buttonId);

  button.addEventListener("pointerdown", () => {
    keys[keyName] = true;
  });

  button.addEventListener("pointerup", () => {
    keys[keyName] = false;
  });

  button.addEventListener("pointerleave", () => {
    keys[keyName] = false;
  });
}

bindMobileButton("btnUp", "ArrowUp");
bindMobileButton("btnDown", "ArrowDown");
bindMobileButton("btnLeft", "ArrowLeft");
bindMobileButton("btnRight", "ArrowRight");

backToMenuBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
generateObstacles();
generateMoneyPiles();
goText.style.display = "block";

setTimeout(() => {
  goText.style.display = "none";
}, 1000);
roadImage.onload = gameLoop;
// Győzelmi panel megjelenítése
function showVictoryPanel() {
  finalTimeText = timeValue.textContent;
  endGameTitle.textContent = "GYŐZTÉL!";
  endPlayerNameValue.textContent = playerName;

  endTimeValue.textContent = timeValue.textContent;

  endMoneyValue.textContent = money + "$";
  endCarValue.textContent = carDisplayNames[selectedCar] || "Falcon";

  endDifficultyValue.textContent =
    difficultyDisplayNames[selectedDifficulty] || "Normál";

  endGamePanel.classList.remove("hidden");
  const raceResult = {
    player_name: playerName,
    car: carDisplayNames[selectedCar] || "Falcon",
    difficulty: difficultyDisplayNames[selectedDifficulty] || "Normál",

    finish_time: Math.floor((performance.now() - startTime) / 1000),

    money: money,
  };

  fetch("backend/save_score.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(raceResult),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Mentés:", data);
    })
    .catch((error) => {
      console.error("Mentési hiba:", error);
    });
}

restartBtn.addEventListener("click", () => {
  location.reload();
});

menuBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
// Vereség panel megjelenítése
function showGameOverPanel() {
  finalTimeText = timeValue.textContent;

  endGameTitle.textContent = "VESZTETTÉL!";
  endPlayerNameValue.textContent = playerName;

  endTimeValue.textContent = finalTimeText;

  endMoneyValue.textContent = money + "$";
  endCarValue.textContent = carDisplayNames[selectedCar] || "Falcon";

  endDifficultyValue.textContent =
    difficultyDisplayNames[selectedDifficulty] || "Normál";

  endGamePanel.classList.remove("hidden");
  const raceResult = {
    player: playerName,
    car: carDisplayNames[selectedCar] || "Falcon",
    difficulty: difficultyDisplayNames[selectedDifficulty] || "Normál",
    time: finalTimeText,
    money: money,
    result: "loss",
  };

  console.log("Versenyeredmény:", raceResult);
}
