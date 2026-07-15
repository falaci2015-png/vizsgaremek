// A 1920 × 1080-as játékteret automatikusan a böngészőablakhoz igazítja
function resizeGame() {
  const world = document.getElementById("world");

  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;

  // Mindig azt az arányt választjuk, amellyel az egész játék elfér
  const scale = Math.min(scaleX, scaleY);

  const scaledWidth = 1920 * scale;
  const scaledHeight = 1080 * scale;

  const offsetX = (window.innerWidth - scaledWidth) / 2;
  const offsetY = (window.innerHeight - scaledHeight) / 2;

  world.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

window.addEventListener("load", resizeGame);
window.addEventListener("resize", resizeGame);

// **********DEBUG kapcsoló**********
const DEBUG_BUILDINGS = false;
// **********DEBUG kapcsoló**********

let cityX = 0;
let singleCityWidth = 0;
// UFO függőleges mozgása
const UFO_TOP_Y = 250;
// A sugár az UFO alsó részétől indul
const UFO_BEAM_TOP_Y = 330;
const UFO_VERTICAL_LIMIT = 20;
const UFO_VERTICAL_SPEED = 1;
const personAnimationIntervals = [];

let ufoY = 0;
let ufoFloatAngle = 0;
let isSpacePressed = false;
let beamWasActive = false;
let score = 0;
// Játékidő (a Beállítások oldalról)
// Ha még nincs mentve semmi, akkor 60 mp az alapértelmezett.
// A játékidőt induláskor az adatbázisból felülírjuk.
let timeLeft = 60;
let timerInterval = null;
let gameEnded = false;
let peopleSpawnTimeout = null;
let gameSettingsLoaded = false;
// *************************************
// A játék aktuális beállításai
// (adatbázisból töltjük be induláskor)
// *************************************

let gameSettings = {
  city_id: 1,
  city_name: "Metropolis",

  background_id: 1,
  background_name: "",
  background_filename: "",

  difficulty: "normal",

  game_duration_seconds: 60,

  music_enabled: true,
  effects_enabled: true,
};
// *************************************
// Játékbeállítások betöltése adatbázisból
// *************************************

async function loadGameSettings() {
  try {
    const response = await fetch("../backend/get_game_settings.php");

    const data = await response.json();

    if (!data.success) {
      console.error("Beállítások betöltési hiba:", data.message);
      return;
    }
    // Az adatbázisból érkező teljes beállításcsomag
    gameSettings = data.settings;

    // Játékidő
    timeLeft = gameSettings.game_duration_seconds;

    // HUD frissítése
    updateTimeDisplay();
    updateHudSettings();
    gameSettingsLoaded = true;
  } catch (error) {
    console.error("Játékbeállítások betöltési hiba:", error);
  }
}
// Eredmény mentése a ranglistába
async function saveScore() {
  try {
    const response = await fetch("../backend/save_score.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        score: score,
      }),
    });

    const data = await response.json();

    const message = document.getElementById("score-save-message");

    if (!message) {
      return;
    }

    message.style.color = data.success ? "#7fffb7" : "#ff8a8a";
    message.textContent = data.message;
  } catch (error) {
    const message = document.getElementById("score-save-message");

    if (message) {
      message.style.color = "#ff8a8a";
      message.textContent = "Kapcsolódási hiba.";
    }

    console.error(error);
  }
}
// Az ember elrablásához szükséges folyamatos sugárzási idő
const CAPTURE_TIME = 2000;

// Az éppen célba vett ház pozíciója és a célzás kezdete
let captureTargetPosition = null;
let captureStartedAt = null;
// Az aktuálisan célzott ember és a fölötte megjelenő töltésjelző
let captureTargetPerson = null;
let captureProgressBar = null;
// ******************************
// Hangok
// ******************************

// Háttérzene
const backgroundMusic = new Audio("../assets/audio/background_music.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.35;

// UFO lebegő hang
const ufoSound = new Audio("../assets/audio/ufo.mp3");
ufoSound.loop = true;
ufoSound.volume = 0.25;

// Sugár
const beamSound = new Audio("../assets/audio/beam.mp3");
beamSound.loop = true;
beamSound.volume = 0.45;

// Rendőrségi sziréna
const sirenSound = new Audio("../assets/audio/siren.mp3");
sirenSound.volume = 0.2;
sirenSound.loop = true;

// Súgó
const helpSound = new Audio("../assets/audio/help.mp3");
helpSound.volume = 0.1;
// A hangbeállítások az adatbázisból betöltött objektumból érkeznek
function isMusicEnabled() {
  return gameSettings.music_enabled === true;
}

function areEffectsEnabled() {
  return gameSettings.effects_enabled === true;
}
// Rendőrségi hírsáv üzenetei
const policeMessages = [
  "FIGYELEM! UFO-K LEPTÉK EL A VÁROST!",
  "MINDENKI MARADJON OTTHON ÉS ZÁRJA BE AZ AJTÓKAT!",
  "KERÜLJÉK A NYÍLT UTCÁKAT ÉS A HÁZTETŐKET!",
  "ÚJABB UFO-ÉSZLELÉSEK ÉRKEZTEK A BELVÁROSBÓL!",
  "A RENDŐRSÉG MINDENKIT NYUGALOMRA INT!",
  "AZONNAL HAGYJÁK EL A VESZÉLYEZTETETT TERÜLETET!",
  "NE NÉZZENEK KÖZVETLENÜL AZ UFO FÉNYSUGARÁBA!",
  "A HATÓSÁGOK DOLGOZNAK A HELYZET MEGOLDÁSÁN!",
  "ISMERETLEN REPÜLŐ OBJEKTUMOK A VÁROS FELETT!",
  "MINDENKI KERESSEN BIZTONSÁGOS MENEDÉKET!",
];

let previousPoliceMessageIndex = -1;
let soundsStarted = false;

function startGameSounds() {
  if (soundsStarted) {
    return;
  }

  soundsStarted = true;
  startGameTimer();

  // Háttérzene csak akkor indul, ha engedélyezve van
  if (isMusicEnabled()) {
    backgroundMusic.play().catch((error) => {
      console.log("A háttérzene nem indult el:", error);
    });
  }

  // Az UFO hangja hangeffektnek számít
  if (areEffectsEnabled()) {
    ufoSound.play().catch((error) => {
      console.log("Az UFO hangja nem indult el:", error);
    });
  }
}

fetch("../backend/get_city.php")
  .then((response) => response.json())

  .then((city) => {
    const container = document.getElementById("city");

    city.forEach((building) => {
      // Egy ház teljes doboza
      const buildingBox = document.createElement("div");
      buildingBox.className = "building";

      // Fejlesztői címke
      if (DEBUG_BUILDINGS) {
        const label = document.createElement("div");

        label.className = "building-label";

        label.textContent = `${building.image_filename} | pozíció: ${building.position}`;

        buildingBox.appendChild(label);
      }

      // Házkép
      const img = document.createElement("img");

      img.src = "../assets/buildings/" + building.image_filename;

      buildingBox.appendChild(img);
      // Fejlesztés alatt minden házon megjelenik egy próbaember
      /*const person = document.createElement("img");

      person.className = "person";
      person.alt = "Integető ember";*/
      // Minden házhoz létrejön egy ember,
      // de induláskor még rejtve marad
      const person = document.createElement("img");

      person.className = "person";
      person.alt = "Integető ember";

      // Az azonos ház felismerése a három várospéldányban
      person.dataset.position = building.position;

      // Véletlenszerű embertípus: 1, 2 vagy 3
      const personType = Math.floor(Math.random() * 3) + 1;

      person.dataset.personType = personType;

      person.src = `../assets/characters/people/type_0${personType}/${personType}_1.png`;

      // Az ember helye az adatbázisból érkezik
      person.style.left = `${building.spawn_x}px`;
      person.style.top = `${building.spawn_y}px`;

      buildingBox.appendChild(person);

      // A ház mindig bekerül a városba,
      // akkor is, ha éppen nincs rajta ember
      container.appendChild(buildingBox);
    });
    // Egy teljes város szélessége
    const cityWidth = city.length * 320;
    singleCityWidth = cityWidth;

    // Az elkészült várost még kétszer lemásoljuk:
    // 1–20 | 1–20 | 1–20
    const originalCity = container.innerHTML;

    container.innerHTML = originalCity + originalCity + originalCity;
    // A három várospéldány összes emberének külön animációja
    document.querySelectorAll(".person").forEach((person) => {
      const personType = person.dataset.personType;

      let currentFrame = Math.floor(Math.random() * 4) + 1;
      const animationSpeed = Math.floor(Math.random() * 121) + 220;

      person.src = `../assets/characters/people/type_0${personType}/${personType}_${currentFrame}.png`;

      const animationInterval = setInterval(() => {
        currentFrame++;

        if (currentFrame > 4) {
          currentFrame = 1;
        }

        person.src = `../assets/characters/people/type_0${personType}/${personType}_${currentFrame}.png`;
      }, animationSpeed);
      // Az intervallum azonosítóját eltároljuk,
      // hogy játék végén le tudjuk állítani.
      personAnimationIntervals.push(animationInterval);
    });
    // Véletlenszerű emberek megjelenítése
    // Véletlenszerű emberek megjelenítése
    function showRandomPeople() {
      const allPeople = document.querySelectorAll(".person");

      // A jelenlegi emberek elhalványulnak
      allPeople.forEach((person) => {
        person.classList.remove("is-visible");
      });

      // Rövid üres szünet után új emberek jelennek meg
      setTimeout(() => {
        // Egyszerre 2–5 különböző házon jelenik meg ember
        const visibleCount = Math.floor(Math.random() * 4) + 2;
        const selectedPositions = new Set();

        while (selectedPositions.size < visibleCount) {
          const randomPosition = Math.floor(Math.random() * city.length) + 1;

          selectedPositions.add(String(randomPosition));
        }

        // Mindhárom várospéldány megfelelő embere megjelenik
        allPeople.forEach((person) => {
          if (selectedPositions.has(person.dataset.position)) {
            person.classList.add("is-visible");
          }
        });
      }, 700);

      // 5–10 másodperc múlva új embercsoport következik
      const nextChange = Math.floor(Math.random() * 5001) + 5000;

      peopleSpawnTimeout = setTimeout(showRandomPeople, nextChange);
    }

    showRandomPeople();
    // A három várospéldány teljes szélessége
    const totalCityWidth = cityWidth * 3;

    container.style.width = `${totalCityWidth}px`;

    const movingCity = document.getElementById("moving-city");
    const road = document.getElementById("road");

    movingCity.style.width = `${totalCityWidth}px`;
    road.style.width = `${totalCityWidth}px`;

    // A középső várospéldányból indulunk
    cityX = -cityWidth;
    movingCity.style.transform = `translateX(${cityX}px)`;
  });
// Fejlesztői városmozgatás
const pressedKeys = {};

window.addEventListener("keydown", (event) => {
  if (!gameSettingsLoaded || gameEnded) {
    return;
  }
  startGameSounds();
  pressedKeys[event.key.toLowerCase()] = true;

  if (event.code === "Space") {
    event.preventDefault();
    isSpacePressed = true;
  }
});
// Ha egy hangbeállítást kikapcsoltak, a hozzá tartozó hangot leállítjuk
// Figyeli, hogy előző képkockában aktív volt-e a sugár

function applySavedSoundSettings() {
  if (!isMusicEnabled()) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  if (!areEffectsEnabled()) {
    ufoSound.pause();
    ufoSound.currentTime = 0;

    beamSound.pause();
    beamSound.currentTime = 0;

    sirenSound.pause();
    sirenSound.currentTime = 0;

    helpSound.pause();
    helpSound.currentTime = 0;
  }
}
// A másodperceket 01:00 formátumra alakítja
function formatGameTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

// Frissíti az időt és a figyelmeztető színeket
function updateTimeDisplay() {
  const timeValue = document.getElementById("time-value");

  if (!timeValue) {
    return;
  }

  timeValue.textContent = formatGameTime(timeLeft);

  timeValue.classList.remove("time-warning", "time-danger");

  if (timeLeft <= 5) {
    timeValue.classList.add("time-danger");
  } else if (timeLeft <= 15) {
    timeValue.classList.add("time-warning");
  }
}
// A játék adatainak megjelenítése a HUD-ban
// és a kiválasztott háttér alkalmazása
function updateHudSettings() {
  const cityName = document.getElementById("city-name");
  const difficultyValue = document.getElementById("difficulty-value");
  const world = document.getElementById("world");

  const difficultyNames = {
    easy: "Könnyű",
    normal: "Normál",
    hard: "Nehéz",
    brutal: "Brutális",
  };

  // Városnév az adatbázisból
  if (cityName) {
    cityName.textContent = gameSettings.city_name;
    cityName.title = gameSettings.city_name;
  }

  // Nehézség az adatbázisból
  if (difficultyValue) {
    difficultyValue.textContent =
      difficultyNames[gameSettings.difficulty] || "Normál";
  }

  // Háttérkép az adatbázisból
  if (world && gameSettings.background_filename) {
    world.style.backgroundImage = `url("../assets/backgrounds/${gameSettings.background_filename}")`;
  }
}

// Az első vezérlőgomb lenyomásakor elindul a visszaszámlálás
function startGameTimer() {
  if (timerInterval || gameEnded) {
    return;
  }

  updateTimeDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;

    updateTimeDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      gameEnded = true;

      resetCaptureProgress();

      beamSound.pause();
      beamSound.currentTime = 0;
      // Minden játékhang leállítása
      backgroundMusic.pause();
      ufoSound.pause();
      beamSound.pause();
      sirenSound.pause();
      helpSound.pause();

      // Rendőrségi futószöveg leállítása
      const policeAlertText = document.getElementById("police-alert-text");

      if (policeAlertText) {
        policeAlertText.style.animation = "none";
      }

      // Új emberek megjelenésének leállítása
      if (peopleSpawnTimeout) {
        clearTimeout(peopleSpawnTimeout);
      }
      // Az emberanimációk teljes leállítása
      personAnimationIntervals.forEach((intervalId) => {
        clearInterval(intervalId);
      });
      // Minden ember eltűnik
      document.querySelectorAll(".person").forEach((person) => {
        person.classList.remove("is-visible");
      });

      // Játék vége panel megjelenítése
      const overlay = document.getElementById("game-over-overlay");

      if (overlay) {
        overlay.classList.add("is-visible");
      }

      const finalScore = document.getElementById("final-score");

      if (finalScore) {
        finalScore.textContent = score;
      }
      saveScore();
    }
  }, 1000);
}
// Véletlenszerű, de nem egymás után ismétlődő rendőrségi üzenet
function showNextPoliceMessage() {
  const policeAlertText = document.getElementById("police-alert-text");

  if (!policeAlertText) {
    return;
  }

  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * policeMessages.length);
  } while (
    policeMessages.length > 1 &&
    randomIndex === previousPoliceMessageIndex
  );

  previousPoliceMessageIndex = randomIndex;
  policeAlertText.textContent = policeMessages[randomIndex];

  // A CSS-animáció újraindítása az új szöveggel
  policeAlertText.style.animation = "none";

  void policeAlertText.offsetWidth;

  policeAlertText.style.animation = "policeTicker 14s linear";

  playRandomSiren();
}
// A rendőrségi felhívások egy részénél megszólal a sziréna
function playRandomSiren() {
  // Előző sziréna biztos leállítása
  sirenSound.pause();
  sirenSound.currentTime = 0;

  if (!areEffectsEnabled()) {
    return;
  }

  // Körülbelül minden harmadik üzenetnél szól
  const shouldPlaySiren = Math.random() < 0.45;

  if (shouldPlaySiren) {
    sirenSound.play().catch(() => {});

    // A sziréna legfeljebb 7 másodpercig szól
    setTimeout(() => {
      sirenSound.pause();
      sirenSound.currentTime = 0;
    }, 7000);
  }
}
// Megszakított sugárzásnál törli az elrablási folyamatot
function resetCaptureProgress() {
  captureTargetPosition = null;
  captureStartedAt = null;
  captureTargetPerson = null;

  // A korábbi töltésjelző eltávolítása
  if (captureProgressBar) {
    captureProgressBar.remove();
    captureProgressBar = null;
  }
}
// Létrehozza az elrablási töltésjelzőt kizárólag az aktuális ember fölött
function createCaptureProgressBar(person) {
  if (captureProgressBar) {
    captureProgressBar.remove();
  }

  const building = person.parentElement;

  captureProgressBar = document.createElement("div");
  captureProgressBar.className = "capture-progress";

  const progressFill = document.createElement("div");
  progressFill.className = "capture-progress-fill";

  const progressText = document.createElement("span");
  progressText.className = "capture-progress-text";
  progressText.textContent = "0%";

  captureProgressBar.appendChild(progressFill);
  captureProgressBar.appendChild(progressText);

  // A csík az aktuális ember fölé kerül
  captureProgressBar.style.left = `${
    person.offsetLeft + person.offsetWidth / 2
  }px`;

  captureProgressBar.style.top = `${person.offsetTop - 28}px`;

  building.appendChild(captureProgressBar);
}

// Frissíti az aktuális ember fölötti százalékot
function updateCaptureProgress(percent) {
  if (!captureProgressBar) {
    return;
  }

  const progressFill = captureProgressBar.querySelector(
    ".capture-progress-fill",
  );

  const progressText = captureProgressBar.querySelector(
    ".capture-progress-text",
  );

  const safePercent = Math.min(100, Math.max(0, percent));

  progressFill.style.width = `${safePercent}%`;
  progressText.textContent = `${Math.floor(safePercent)}%`;
}

// Ellenőrzi, hogy van-e látható ember a sugár alatt
function capturePersonUnderBeam(beam) {
  const beamRect = beam.getBoundingClientRect();

  const visiblePeople = document.querySelectorAll(".person.is-visible");

  let targetedPerson = null;

  // Megkeressük a sugár alatt álló látható embert
  for (const person of visiblePeople) {
    const personRect = person.getBoundingClientRect();

    const personCenterX = personRect.left + personRect.width / 2;

    const isInsideBeamWidth =
      personCenterX >= beamRect.left && personCenterX <= beamRect.right;

    const isInsideBeamHeight =
      personRect.bottom >= beamRect.top && personRect.top <= beamRect.bottom;

    if (isInsideBeamWidth && isInsideBeamHeight) {
      targetedPerson = person;
      break;
    }
  }

  // Ha nincs ember a sugár alatt, megszakad a folyamat
  if (!targetedPerson) {
    resetCaptureProgress();
    return;
  }

  const targetedPosition = targetedPerson.dataset.position;

  // Új ember került a sugár alá: elindul a 2 másodperces mérés
  if (captureTargetPerson !== targetedPerson) {
    resetCaptureProgress();

    captureTargetPosition = targetedPosition;
    captureTargetPerson = targetedPerson;
    captureStartedAt = performance.now();

    createCaptureProgressBar(targetedPerson);
    updateCaptureProgress(0);

    return;
  }

  // Még nem telt el a szükséges 2 másodperc
  const elapsedTime = performance.now() - captureStartedAt;

  // Elrablási folyamat százalékban
  const capturePercent = (elapsedTime / CAPTURE_TIME) * 100;

  updateCaptureProgress(capturePercent);

  if (elapsedTime < CAPTURE_TIME) {
    return;
  }

  // Mindhárom várospéldány megfelelő embere eltűnik
  document.querySelectorAll(".person").forEach((person) => {
    if (person.dataset.position === targetedPosition) {
      person.classList.remove("is-visible");
    }
  });

  // Pontszám növelése
  score++;

  const scoreValue = document.getElementById("score-value");

  if (scoreValue) {
    scoreValue.textContent = score;

    // Sikeres elrabláskor röviden felvillan a pontszám
    scoreValue.classList.remove("score-pop");

    void scoreValue.offsetWidth;

    scoreValue.classList.add("score-pop");
  }

  // Segélykiáltás csak a sikeres elrablás pillanatában
  if (areEffectsEnabled()) {
    helpSound.currentTime = 0;
    helpSound.play().catch(() => {});
  }

  // Elrablás után töröljük az aktuális célzást
  resetCaptureProgress();
}

applySavedSoundSettings();
updateTimeDisplay();
updateHudSettings();
// Első rendőrségi üzenet beállítása
showNextPoliceMessage();

const policeAlertText = document.getElementById("police-alert-text");

if (policeAlertText) {
  // Minden teljes lefutás után új véletlenszerű üzenet következik
  policeAlertText.addEventListener("animationend", () => {
    showNextPoliceMessage();
  });
}

window.addEventListener("keyup", (event) => {
  pressedKeys[event.key.toLowerCase()] = false;

  if (event.code === "Space") {
    isSpacePressed = false;
  }
});

function moveCityForDebug() {
  if (gameEnded) {
    return;
  }
  const movingCity = document.getElementById("moving-city");

  // Normál és gyors mozgatási sebesség
  const speed = pressedKeys["shift"] ? 25 : 5;
  const movingLeft = pressedKeys["a"] || pressedKeys["arrowleft"];

  const movingRight = pressedKeys["d"] || pressedKeys["arrowright"];

  const movingUp = pressedKeys["w"] || pressedKeys["arrowup"];

  const movingDown = pressedKeys["s"] || pressedKeys["arrowdown"];

  // Balra mozgatás
  if (movingLeft) {
    cityX += speed;
  }

  // Jobbra mozgatás
  if (movingRight) {
    cityX -= speed;
  }
  // UFO mozgatása: a jelenlegi hely a plafon,
  // innen legfeljebb 20 px-t mehet lefelé
  if (movingUp) {
    ufoY = Math.max(0, ufoY - UFO_VERTICAL_SPEED);
  }

  if (movingDown) {
    ufoY = Math.min(UFO_VERTICAL_LIMIT, ufoY + UFO_VERTICAL_SPEED);
  }
  // Végtelenített város: mindig visszaugrunk a középső példányba
  if (singleCityWidth > 0) {
    if (cityX <= -singleCityWidth * 2) {
      cityX += singleCityWidth;
    }

    if (cityX >= 0) {
      cityX -= singleCityWidth;
    }
  }
  movingCity.style.transform = `translateX(${cityX}px)`;
  const ufo = document.getElementById("ufo");
  const beam = document.getElementById("ufo-beam");

  if (ufo) {
    // Finom gravitációs lebegés
    ufoFloatAngle += 0.015;

    const floatOffset = Math.sin(ufoFloatAngle) * 3;

    ufo.style.top = `${UFO_TOP_Y + ufoY + floatOffset}px`;
  }

  if (beam) {
    // A sugár követi az UFO függőleges helyzetét
    beam.style.top = `${UFO_BEAM_TOP_Y + ufoY}px`;

    // Sugár csak teljesen álló helyzetben működhet
    const isMoving = movingLeft || movingRight || movingUp || movingDown;

    const beamActive = !gameEnded && isSpacePressed && !isMoving;

    beam.classList.toggle("is-active", beamActive);
    // Aktív sugárnál folyamatosan mérjük az ember célzásának idejét
    if (beamActive) {
      capturePersonUnderBeam(beam);
    } else {
      // Space felengedése vagy mozgás esetén újra kell kezdeni a 2 másodpercet
      resetCaptureProgress();
    }

    // Sugárhang indítása
    if (beamActive && !beamWasActive && areEffectsEnabled()) {
      beamSound.currentTime = 0;
      beamSound.play().catch(() => {});
    }

    // Sugárhang leállítása
    if (!beamActive && beamWasActive) {
      beamSound.pause();
      beamSound.currentTime = 0;
    }

    // Elmentjük az aktuális állapotot
    beamWasActive = beamActive;
  }
  requestAnimationFrame(moveCityForDebug);
}
// A játék indulásakor betöltjük
// a felhasználó adatbázisban tárolt beállításait.
loadGameSettings();
moveCityForDebug();
