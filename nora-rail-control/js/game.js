// =====================================================
// Rail Control - Játéklogika
// =====================================================
// HTML elemek
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const noraMessage = document.getElementById("noraMessage");
const noraPortrait = document.getElementById("noraPortrait");
const timerMessage = document.getElementById("timerMessage");
const scoreValue = document.getElementById("scoreValue");
const trainCount = document.getElementById("trainCount");
const trainTypeElement = document.getElementById("trainType");
// Játék képek
const targetTrackElement = document.getElementById("targetTrack");
const passengerTrainImage = new Image();
passengerTrainImage.src = "assets/img/trains/szemely.png";
const cargoTrainImage = new Image();
cargoTrainImage.src = "assets/img/trains/teher.png";
const expressTrainImage = new Image();
expressTrainImage.src = "assets/img/trains/gyors.png";
const stationImage = new Image();
stationImage.src = "assets/img/station/station.png";
const soundEnabled = localStorage.getItem("railSound") !== "off";
// Hangok
const signalSound = new Audio("assets/audio/signal_toggle.mp3");
const switchSound = new Audio("assets/audio/switch_change.mp3");
const correctSound = new Audio("assets/audio/correct_route.mp3");
const wrongSound = new Audio("assets/audio/wrong_route.mp3");
const delaySound = new Audio("assets/audio/delay_penalty.mp3");
const arrivalSound = new Audio("assets/audio/train_arrival.mp3");
const crashSound = new Audio("assets/audio/crash.mp3");
const shiftCompleteSound = new Audio("assets/audio/shift_complete.mp3");
const shiftFailedSound = new Audio("assets/audio/shift_failed.mp3");
const ambientSound = new Audio("assets/audio/station_ambient.mp3");

ambientSound.loop = true;
ambientSound.volume = 0.08;
switchSound.volume = 0.1;

function playSound(sound) {
  if (!soundEnabled) {
    return;
  }

  sound.currentTime = 0;
  sound.play().catch(() => {});
}
const signalLeftBtn = document.getElementById("signalLeftBtn");
const signalRightBtn = document.getElementById("signalRightBtn");
const switchBtn = document.getElementById("switchBtn");
const gameOverPanel = document.getElementById("gameOverPanel");
const menuButton = document.getElementById("menuButton");
const exitBtn = document.getElementById("exitBtn");
const trainInfoList = document.getElementById("trainInfoList");
// Játék állapotváltozók
let noraMoodLocked = false;
let score = 0;
let trainsPassed = 0;
let correctRoutes = 0;
let wrongRoutes = 0;
let correctStreak = 0;
let wrongStreak = 0;
let gameOver = false;
let shiftTimeLeft = 60;
let shiftFinished = false;
let shiftTimer = null;
let leftSignalGreen = false;
let rightSignalGreen = false;
// Nehézségi beállítások
const selectedDifficulty = localStorage.getItem("railDifficulty") || "normal";
const difficultySettings = {
  easy: {
    maxActiveTrains: 1,
    spawnDelay: 5200,
    speedMultiplier: 0.75,
  },

  normal: {
    maxActiveTrains: 2,
    spawnDelay: 5200,
    speedMultiplier: 0.75,
  },

  hard: {
    maxActiveTrains: 3,
    spawnDelay: 5200,
    speedMultiplier: 0.75,
  },
};

const currentDifficulty =
  difficultySettings[selectedDifficulty] || difficultySettings.normal;

const leftSignal = {
  x: 70,
  y: 310,
  radius: 18,
};

const rightSignal = {
  x: 0,
  y: 400,
  radius: 18,
};

let leftSwitchPosition = 2;

const leftSwitch = {
  x: 180,
  y: 400,
  radius: 24,
};

const trackY = {
  1: 230,
  2: 380,
  3: 530,
};

const trains = [];
let lastSpawnTime = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  rightSignal.x = canvas.width - 70;
  rightSignal.y = 310;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
// Új vonat létrehozása
function createTrain() {
  const types = ["Személy", "Teher", "Gyors"];

  const selectedType = types[Math.floor(Math.random() * types.length)];

  let selectedTargetTrack = 2;
  let baseSpeed = 5;

  if (selectedType === "Személy") {
    selectedTargetTrack = Math.floor(Math.random() * 3) + 1;

    baseSpeed = 5;
  }

  if (selectedType === "Teher") {
    const tracks = [2, 3];

    selectedTargetTrack = tracks[Math.floor(Math.random() * tracks.length)];

    baseSpeed = 3;
  }

  if (selectedType === "Gyors") {
    selectedTargetTrack = 1;
    baseSpeed = 8;
  }

  return {
    x: -260,
    y: 380,
    targetY: 380,
    width: 220,
    height: 36,
    speed: baseSpeed * currentDifficulty.speedMultiplier,
    type: selectedType,
    targetTrack: selectedTargetTrack,
    activeSwitchTrack: leftSwitchPosition,
    route: null,
    routeIndex: 0,
    finished: false,
    passedLeftSignalHandled: false,
    passedRightSignalHandled: false,
    waitingTimeLeft: 0,
    waitingTimeRight: 0,
    delayPenaltyGivenLeft: false,
    delayPenaltyGivenRight: false,
  };
}
// Vonat indítása
function spawnTrain(force = false) {
  if (shiftFinished || gameOver) {
    return;
  }

  const now = performance.now();

  if (trains.length >= currentDifficulty.maxActiveTrains) {
    return;
  }

  if (!force) {
    if (now - lastSpawnTime < currentDifficulty.spawnDelay) {
      return;
    }
  }

  const hadNoTrains = trains.length === 0;

  trains.push(createTrain());
  playSound(arrivalSound);

  updateTrainInfoPanel();
  lastSpawnTime = now;

  if (force || hadNoTrains) {
    updateMissionText();
  }
}
// Nóra aktuális feladata
function updateMissionText() {
  if (noraMoodLocked || gameOver || shiftFinished) {
    return;
  }

  if (trains.length === 0) {
    noraPortrait.src = "assets/img/nora/nora_normal.png";

    noraMessage.textContent =
      "Jelenleg nincs érkező vonat. Figyeljük a pályaudvart.";

    trainTypeElement.textContent = "-";
    targetTrackElement.textContent = "-";

    return;
  }

  const nextTrain = trains[0];

  trainTypeElement.textContent = nextTrain.type;

  targetTrackElement.textContent = nextTrain.targetTrack;

  if (nextTrain.type === "Gyors") {
    noraPortrait.src = "assets/img/nora/nora_normal.png";
  } else if (nextTrain.type === "Teher") {
    noraPortrait.src = "assets/img/nora/nora_normal.png";
  } else {
    noraPortrait.src = "assets/img/nora/nora_normal.png";
  }

  noraMessage.textContent = `${nextTrain.type} vonat érkezik! Irányítsd a ${nextTrain.targetTrack}. vágányra!`;
}
// Műszak visszaszámláló
function startShiftTimer() {
  shiftTimer = setInterval(() => {
    if (gameOver || shiftFinished) {
      clearInterval(shiftTimer);
      return;
    }

    shiftTimeLeft--;

    timerMessage.textContent = `Hátralévő idő: ${shiftTimeLeft} mp`;
    timerMessage.classList.remove("timerNormal", "timerWarning", "timerDanger");

    if (shiftTimeLeft > 30) {
      timerMessage.classList.add("timerNormal");
    } else if (shiftTimeLeft > 10) {
      timerMessage.classList.add("timerWarning");
    } else {
      timerMessage.classList.add("timerDanger");
    }

    if (shiftTimeLeft <= 0) {
      finishShift();
    }
  }, 1000);
}
// Műszak lezárása
function finishShift() {
  shiftFinished = true;
  gameOver = true;
  if (score >= 0) {
    playSound(shiftCompleteSound);
  } else {
    playSound(shiftFailedSound);
  }
  clearInterval(shiftTimer);
  saveScore();

  if (score >= 100) {
    noraPortrait.src = "assets/img/nora/nora_happy.png";
    noraMessage.textContent = "Kiváló műszak volt! Profi forgalomirányítás!";
  } else if (score >= 50) {
    noraPortrait.src = "assets/img/nora/nora_happy.png";
    noraMessage.textContent = "Szép munka! A forgalom nagy része rendben ment.";
  } else if (score >= 0) {
    noraPortrait.src = "assets/img/nora/nora_normal.png";
    noraMessage.textContent = "Lezártuk a műszakot. Van még mit gyakorolni.";
  } else {
    noraPortrait.src = "assets/img/nora/nora_angry.png";
    noraMessage.textContent =
      "Ez most nem sikerült jól. A vasúti forgalom nem játék!";
  }

  gameOverPanel.style.display = "block";

  gameOverPanel.querySelector("h2").textContent = "MŰSZAK VÉGE";
  let rankTitle = "";

  if (score >= 100) {
    rankTitle = "VASÚTI IGAZGATÓ";
  } else if (score >= 50) {
    rankTitle = "ÁLLOMÁSFŐNÖK";
  } else if (score >= 20) {
    rankTitle = "FORGALMISTA";
  } else if (score >= 0) {
    rankTitle = "TANULÓ IRÁNYÍTÓ";
  } else {
    rankTitle = "PÁLYAKEZDŐ GYAKORNOK";
  }

  gameOverPanel.querySelector("p").innerHTML =
    `Átengedett vonatok: <strong>${trainsPassed}</strong><br>
     Helyes irányítások: <strong>${correctRoutes}</strong><br>
     Hibás irányítások: <strong>${wrongRoutes}</strong><br>
     Pontszám: <strong>${score}</strong><br><br>

     <span style="color:#ffd166;font-size:18px;">
     Minősítés
     </span><br>

     <strong style="font-size:22px;color:#ffd166;">
     ${rankTitle}
     </strong>`;
}

function updateTrainInfoPanel() {
  if (trains.length === 0) {
    trainInfoList.innerHTML = "Nincs érkező vonat";

    return;
  }

  let html = "";

  trains.forEach((train, index) => {
    html += `
            <div class="trainInfoItem">
                ${index + 1}. ${train.type}
                → ${train.targetTrack}. vágány
            </div>
        `;
  });

  trainInfoList.innerHTML = html;
}

function drawBallastLine(x1, y1, x2, y2) {
  ctx.strokeStyle = "rgba(45, 48, 52, 0.95)";
  ctx.lineWidth = 34;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawSleepers(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const length = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.floor(length / 38);

  const angle = Math.atan2(dy, dx);
  const sleeperAngle = angle + Math.PI / 2;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    const x = x1 + dx * t;
    const y = y1 + dy * t;

    const half = 13;

    ctx.strokeStyle = "rgba(90, 65, 42, 0.9)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(
      x + Math.cos(sleeperAngle) * half,
      y + Math.sin(sleeperAngle) * half,
    );
    ctx.lineTo(
      x - Math.cos(sleeperAngle) * half,
      y - Math.sin(sleeperAngle) * half,
    );
    ctx.stroke();
  }
}

function drawRailLine(x1, y1, x2, y2) {
  drawBallastLine(x1, y1, x2, y2);
  drawSleepers(x1, y1, x2, y2);

  ctx.strokeStyle = "#d6d6d6";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x1, y1 - 5);
  ctx.lineTo(x2, y2 - 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x1, y1 + 5);
  ctx.lineTo(x2, y2 + 5);
  ctx.stroke();
}

function drawStationArea() {
  const stationWidth = 1100;
  const stationHeight = 470;

  const stationX = canvas.width / 2 - stationWidth / 2;

  const stationY = 45;

  ctx.drawImage(stationImage, stationX, stationY, stationWidth, stationHeight);
}

function drawStationBuilding(x, y, width, height) {
  // épület árnyék
  ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
  ctx.fillRect(x + 8, y + 8, width, height);

  // fő fal
  ctx.fillStyle = "rgba(126, 94, 68, 0.95)";
  ctx.fillRect(x, y, width, height);

  // tető
  ctx.fillStyle = "rgba(38, 45, 48, 0.98)";
  ctx.beginPath();
  ctx.moveTo(x - 18, y);
  ctx.lineTo(x + width / 2, y - 38);
  ctx.lineTo(x + width + 18, y);
  ctx.closePath();
  ctx.fill();

  // tető él
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // középső óra rész
  ctx.fillStyle = "rgba(90, 62, 45, 1)";
  ctx.fillRect(x + width / 2 - 38, y - 18, 76, 52);

  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(x + width / 2, y + 5, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1b1f20";
  ctx.font = "bold 11px Arial";
  ctx.textAlign = "center";
  ctx.fillText("12", x + width / 2, y + 9);

  // ablakok
  for (let i = 0; i < 7; i++) {
    const wx = x + 38 + i * ((width - 76) / 6);

    ctx.fillStyle = "rgba(45, 68, 78, 0.95)";
    ctx.fillRect(wx - 14, y + 24, 28, 34);

    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.lineWidth = 1;
    ctx.strokeRect(wx - 14, y + 24, 28, 34);
  }

  // alsó díszcsík
  ctx.fillStyle = "rgba(255, 209, 102, 0.28)";
  ctx.fillRect(x, y + height - 8, width, 4);
}

function drawPlatform(x, y, width, label) {
  const height = 34;

  // árnyék
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(x + 8, y + 8, width, height);

  // peron alap
  ctx.fillStyle = "rgba(165, 160, 130, 0.88)";
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);

  // peron tető / sötét sáv
  ctx.fillStyle = "rgba(40, 46, 48, 0.75)";
  ctx.fillRect(x, y, width, 8);

  // padok / kis részletek
  for (let i = 0; i < 4; i++) {
    const bx = x + 70 + i * 140;

    ctx.fillStyle = "rgba(95, 62, 38, 0.9)";
    ctx.fillRect(bx, y + 18, 46, 5);

    ctx.fillStyle = "rgba(30,30,30,0.8)";
    ctx.fillRect(bx + 4, y + 23, 4, 8);
    ctx.fillRect(bx + 36, y + 23, 4, 8);
  }

  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.font = "bold 13px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, x + width / 2, y + 25);
}
// Pálya kirajzolása
function drawTracks() {
  ctx.fillStyle = "#3b4a45";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const leftX = 80;
  const rightX = canvas.width - 80;

  const track1Y = 250;
  const track2Y = 400;
  const track3Y = 550;

  const switchLeftX = 420;
  const switchRightX = canvas.width - 420;
  drawStationArea();

  drawRailLine(leftX, track1Y, rightX, track1Y);
  drawRailLine(-350, track2Y, canvas.width + 350, track2Y);
  drawRailLine(leftX, track3Y, rightX, track3Y);

  drawRailLine(leftX, track2Y, switchLeftX, track1Y);
  drawRailLine(leftX, track2Y, switchLeftX, track3Y);

  drawRailLine(switchRightX, track1Y, rightX, track2Y);
  drawRailLine(switchRightX, track3Y, rightX, track2Y);

  drawTrackLabel("1. VÁGÁNY", canvas.width / 2, 251);
  drawTrackLabel("2. VÁGÁNY", canvas.width / 2, 401);
  drawTrackLabel("3. VÁGÁNY", canvas.width / 2, 550);

  drawSignal(leftSignal, leftSignalGreen, "J1");
  drawSignal(rightSignal, rightSignalGreen, "J2");
  drawSwitch();
}
function drawTrackLabel(text, x, y) {
  const paddingX = 18;
  const paddingY = 8;

  ctx.font = "bold 26px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textWidth = ctx.measureText(text).width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = 38;

  ctx.fillStyle = "rgba(8, 12, 13, 0.78)";
  ctx.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);

  ctx.strokeStyle = "rgba(255, 209, 102, 0.45)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);

  ctx.fillStyle = "#ffd166";
  ctx.shadowColor = "rgba(0,0,0,0.85)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillText(text, x, y + 1);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function drawSignal(signal, isGreen, label) {
  ctx.fillStyle = isGreen ? "lime" : "red";

  ctx.beginPath();
  ctx.arc(signal.x, signal.y, signal.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, signal.x, signal.y - 28);
}

function drawSwitch() {
  ctx.fillStyle = "#ffd166";

  ctx.beginPath();
  ctx.arc(leftSwitch.x, leftSwitch.y, leftSwitch.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("V1", leftSwitch.x, leftSwitch.y - 4);

  ctx.font = "bold 14px Arial";
  ctx.fillText(leftSwitchPosition, leftSwitch.x, leftSwitch.y + 14);
}

function drawTrain(train) {
  let image = passengerTrainImage;

  if (train.type === "Teher") {
    image = cargoTrainImage;
  }

  if (train.type === "Gyors") {
    image = expressTrainImage;
  }

  const trainWidth = 220;
  const trainHeight = 36;

  ctx.drawImage(image, train.x, train.y - 10, trainWidth, trainHeight);
}

function buildRoute(trackNumber) {
  const leftX = 80;
  const rightX = canvas.width - 80;
  const switchLeftX = 420;
  const switchRightX = canvas.width - 420;

  const track1Y = 250;
  const track2Y = 400;
  const track3Y = 550;

  if (trackNumber === 1) {
    return [
      { x: -320, y: track2Y },
      { x: leftX, y: track2Y },
      { x: switchLeftX, y: track1Y },
      { x: switchRightX, y: track1Y },
      { x: rightX, y: track2Y },
      { x: canvas.width + 160, y: track2Y },
    ];
  }

  if (trackNumber === 3) {
    return [
      { x: -320, y: track2Y },
      { x: leftX, y: track2Y },
      { x: switchLeftX, y: track3Y },
      { x: switchRightX, y: track3Y },
      { x: rightX, y: track2Y },
      { x: canvas.width + 160, y: track2Y },
    ];
  }

  return [
    { x: -320, y: track2Y },
    { x: leftX, y: track2Y },
    { x: rightX, y: track2Y },
    { x: canvas.width + 160, y: track2Y },
  ];
}

function moveTrainOnRoute(train) {
  if (!train.route || train.route.length === 0) {
    return;
  }

  const targetPoint = train.route[train.routeIndex];

  if (!targetPoint) {
    train.finished = true;
    return;
  }

  const dx = targetPoint.x - train.x;
  const dy = targetPoint.y - train.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= train.speed) {
    train.x = targetPoint.x;
    train.y = targetPoint.y;
    train.routeIndex++;
    return;
  }

  train.x += (dx / distance) * train.speed;
  train.y += (dy / distance) * train.speed;
}
// Vonat mozgatása és forgalmi logika
function updateTrain(train) {
  const leftStopPosition = leftSignal.x - train.width - 0;

  const rightStopPosition = rightSignal.x - train.width - 12;

  const trainPassedLeftSignal = train.x > leftSignal.x + leftSignal.radius;
  if (trainPassedLeftSignal && !train.passedLeftSignalHandled) {
    leftSignalGreen = false;
    train.passedLeftSignalHandled = true;
    updateControlPanel();
  }

  const trainPassedRightSignal = train.x > rightSignal.x + rightSignal.radius;

  if (!train.route && !trainPassedLeftSignal) {
    train.activeSwitchTrack = leftSwitchPosition;
  }

  if (!leftSignalGreen && !trainPassedLeftSignal) {
    if (train.x < leftStopPosition) {
      train.x += train.speed;
    }

    if (train.x > leftStopPosition) {
      train.x = leftStopPosition;
    }
    if (train.x >= leftStopPosition - 5) {
      train.waitingTimeLeft += 1 / 60;

      if (
        train.waitingTimeLeft > 5 &&
        train.waitingTimeLeft < 5.2 &&
        !noraMoodLocked
      ) {
        noraPortrait.src = "assets/img/nora/nora_angry.png";

        noraMessage.textContent = "Figyelem! Egy vonat túl sokat várakozik.";

        noraMoodLocked = true;

        setTimeout(() => {
          noraMoodLocked = false;
          updateMissionText();
        }, 3000);
      }

      if (train.waitingTimeLeft >= 10 && !train.delayPenaltyGivenLeft) {
        train.delayPenaltyGivenLeft = true;

        score -= 2;
        playSound(delaySound);
        scoreValue.textContent = score;

        noraPortrait.src = "assets/img/nora/nora_angry.png";

        noraMessage.textContent = "Késés miatt pontlevonás történt!";

        noraMoodLocked = true;

        setTimeout(() => {
          noraMoodLocked = false;
          updateMissionText();
        }, 3000);
      }
    }
    return;
  }

  if (!train.route) {
    train.activeSwitchTrack = leftSwitchPosition;
    train.route = buildRoute(train.activeSwitchTrack);
    train.routeIndex = 1;
  }

  if (!rightSignalGreen && !trainPassedRightSignal) {
    moveTrainOnRoute(train);

    if (train.x > rightStopPosition) {
      train.x = rightStopPosition;
    }
    if (train.x >= rightStopPosition - 5) {
      train.waitingTimeRight += 1 / 60;

      if (
        train.waitingTimeRight > 5 &&
        train.waitingTimeRight < 5.2 &&
        !noraMoodLocked
      ) {
        noraPortrait.src = "assets/img/nora/nora_angry.png";

        noraMessage.textContent = "Figyelem! Egy vonat túl sokat várakozik.";

        noraMoodLocked = true;

        setTimeout(() => {
          noraMoodLocked = false;
          updateMissionText();
        }, 3000);
      }

      if (train.waitingTimeRight >= 10 && !train.delayPenaltyGivenRight) {
        train.delayPenaltyGivenRight = true;

        score -= 2;
        playSound(delaySound);
        scoreValue.textContent = score;

        noraPortrait.src = "assets/img/nora/nora_angry.png";

        noraMessage.textContent = "Késés miatt pontlevonás történt!";

        noraMoodLocked = true;

        setTimeout(() => {
          noraMoodLocked = false;
          updateMissionText();
        }, 3000);
      }
    }
    return;
  }

  moveTrainOnRoute(train);
}
// Vonat célba érkezése
function checkTrainExit() {
  for (let i = trains.length - 1; i >= 0; i--) {
    const train = trains[i];

    if (train.finished || train.x > canvas.width + 150) {
      if (train.activeSwitchTrack === train.targetTrack) {
        score += 10;
        playSound(correctSound);
        correctRoutes++;
        correctStreak++;
        wrongStreak = 0;

        if (correctStreak === 3) {
          noraPortrait.src = "assets/img/nora/nora_happy.png";
          noraMessage.textContent =
            "Kiváló munka! Három vonat egymás után jól ment tovább.";

          noraMoodLocked = true;

          setTimeout(() => {
            noraMoodLocked = false;
            updateMissionText();
          }, 3000);
        }

        noraPortrait.src = "assets/img/nora/nora_happy.png";
        noraMessage.textContent =
          "Szép munka! A vonat a megfelelő vágányra érkezett.";
        noraMoodLocked = true;
        setTimeout(() => {
          noraMoodLocked = false;
          updateMissionText();
        }, 3000);
      } else {
        score -= 10;
        playSound(wrongSound);
        wrongRoutes++;
        wrongStreak++;
        correctStreak = 0;

        if (wrongStreak === 2) {
          noraPortrait.src = "assets/img/nora/nora_angry.png";
          noraMessage.textContent =
            "Figyelj jobban! Kezd káosz kialakulni a pályaudvaron.";

          noraMoodLocked = true;

          setTimeout(() => {
            noraMoodLocked = false;
            updateMissionText();
          }, 3000);
        }

        noraPortrait.src = "assets/img/nora/nora_angry.png";
        noraMessage.textContent =
          "Hibás irányítás! A vonat rossz vágányra érkezett.";

        noraMoodLocked = true;

        setTimeout(() => {
          noraMoodLocked = false;
          updateMissionText();
        }, 3000);
      }
      trainsPassed++;

      trains.splice(i, 1);
      updateTrainInfoPanel();

      scoreValue.textContent = score;
      trainCount.textContent = trainsPassed;

      leftSignalGreen = false;
      rightSignalGreen = false;
      leftSwitchPosition = 2;
      updateControlPanel();
    }
  }
}
// Ütközés ellenőrzése
function checkTrainCollision() {
  for (let i = 0; i < trains.length; i++) {
    for (let j = i + 1; j < trains.length; j++) {
      const a = trains[i];
      const b = trains[j];

      const collision =
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

      if (collision) {
        gameOver = true;
        playSound(crashSound);
        document.body.classList.add("screenShake");

        setTimeout(() => {
          document.body.classList.remove("screenShake");
        }, 600);
        score -= 50;
        scoreValue.textContent = score;
        noraPortrait.src = "assets/img/nora/nora_angry.png";
        noraMessage.textContent = "ÜTKÖZÉS! A forgalom összeomlott!";
        gameOverPanel.style.display = "block";
        trains.length = 0;
        updateTrainInfoPanel();

        gameOverPanel.querySelector("h2").textContent = "ÜTKÖZÉS!";
        gameOverPanel.querySelector("p").innerHTML =
          `Baleset történt a pályaudvaron.<br>
     Pontlevonás: <strong>-50</strong><br>
     Végső pontszám: <strong>${score}</strong>`;
        leftSignalGreen = false;
        rightSignalGreen = false;
        leftSwitchPosition = 2;
        updateControlPanel();
        updateTrainInfoPanel();
        return;
      }
    }
  }
}
// Fő játékciklus
function gameLoop() {
  if (gameOver) {
    return;
  }
  drawTracks();

  spawnTrain();

  trains.forEach((train) => {
    updateTrain(train);
    drawTrain(train);
  });

  checkTrainExit();
  checkTrainCollision();

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
});
function updateControlPanel() {
  signalLeftBtn.textContent = "J1";
  signalRightBtn.textContent = "J2";

  switchBtn.textContent = "V1 → " + leftSwitchPosition + ". vágány";

  signalLeftBtn.classList.toggle("activeGreen", leftSignalGreen);
  signalRightBtn.classList.toggle("activeGreen", rightSignalGreen);

  signalLeftBtn.classList.toggle("activeRed", !leftSignalGreen);
  signalRightBtn.classList.toggle("activeRed", !rightSignalGreen);
}

signalLeftBtn.addEventListener("click", () => {
  leftSignalGreen = !leftSignalGreen;
  playSound(signalSound);
  updateControlPanel();
});

signalRightBtn.addEventListener("click", () => {
  rightSignalGreen = !rightSignalGreen;
  playSound(signalSound);
  updateControlPanel();
});

switchBtn.addEventListener("click", () => {
  leftSwitchPosition++;

  if (leftSwitchPosition > 3) {
    leftSwitchPosition = 1;
  }

  playSound(switchSound);
  updateControlPanel();
});

exitBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
menuButton.addEventListener("click", () => {
  window.location.href = "index.html";
});
// Eredmény mentése
async function saveScore() {
  try {
    const response = await fetch("./backend/save_score.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        difficulty: selectedDifficulty,
        score: score,
        trainsPassed: trainsPassed,
        correctRoutes: correctRoutes,
        wrongRoutes: wrongRoutes,
      }),
    });

    const result = await response.json();
    console.log("Eredmény mentése:", result);
  } catch (error) {
    console.error("Mentési hiba:", error);
  }
}

updateControlPanel();

if (soundEnabled) {
  ambientSound.play().catch(() => {});
}

spawnTrain(true);
startShiftTimer();
gameLoop();
