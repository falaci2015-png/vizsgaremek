// Beállítási elemek
const musicEnabled = document.getElementById("music-enabled");
const effectsEnabled = document.getElementById("effects-enabled");
const difficultySelect = document.getElementById("difficulty-select");
const gameTimeSelect = document.getElementById("game-time-select");
const saveGameSettingsButton = document.getElementById("save-game-settings");

const gameSettingsMessage = document.getElementById("game-settings-message");

const passwordForm = document.getElementById("password-form");

const passwordMessage = document.getElementById("password-message");
const citySelect = document.getElementById("city-select");
const backgroundSelect = document.getElementById("background-select");
// ********** Városok és hátterek betöltése **********
async function loadSettingLists() {
  try {
    const response = await fetch("../backend/get_settings_lists.php");

    const data = await response.json();

    if (!data.success) {
      return;
    }

    // ********** Városok **********
    citySelect.innerHTML = "";

    data.cities.forEach((city) => {
      const option = document.createElement("option");

      option.value = city.id;
      option.textContent =
        city.name.length > 21 ? city.name.substring(0, 21) + "..." : city.name;

      // A teljes név maradjon tooltipként
      option.title = city.name;

      // A város alapértelmezett hátterének azonosítója
      option.dataset.backgroundId = city.background_id;

      citySelect.appendChild(option);
    });

    // ********** Hátterek **********
    backgroundSelect.innerHTML = "";

    data.backgrounds.forEach((background) => {
      const option = document.createElement("option");

      option.value = background.id;
      option.textContent = background.name;

      backgroundSelect.appendChild(option);
    });
  } catch (error) {
    console.error("A listák betöltése nem sikerült:", error);
  }
}
// ********** Játékbeállítások betöltése adatbázisból **********
async function loadGameSettings() {
  try {
    const response = await fetch("../backend/load_settings.php");

    const data = await response.json();

    if (!data.success) {
      return;
    }

    const settings = data.settings;

    // Hangbeállítások
    musicEnabled.checked = settings.music_enabled;
    effectsEnabled.checked = settings.effects_enabled;

    // Város
    if (citySelect) {
      citySelect.value = settings.city_id;
    }

    // Háttér

    if (backgroundSelect) {
      backgroundSelect.value = settings.background_id;
    }

    // Nehézség
    difficultySelect.value = settings.difficulty;

    // Játékidő
    gameTimeSelect.value = settings.game_duration_seconds;
  } catch (error) {
    console.error("Beállítások betöltési hiba:", error);
  }
}

// ********** Játékbeállítások mentése adatbázisba **********
async function saveGameSettings() {
  gameSettingsMessage.textContent = "";

  try {
    const response = await fetch("../backend/save_settings.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        city_id: Number(citySelect.value),
        background_id: Number(backgroundSelect.value),
        difficulty: difficultySelect.value,
        game_duration_seconds: Number(gameTimeSelect.value),
        music_enabled: musicEnabled.checked,
        effects_enabled: effectsEnabled.checked,
      }),
    });

    const data = await response.json();

    if (data.success) {
      gameSettingsMessage.style.color = "#8fff8f";
      gameSettingsMessage.textContent = data.message;
    } else {
      gameSettingsMessage.style.color = "#ffb3b3";
      gameSettingsMessage.textContent = data.message;
    }
  } catch (error) {
    console.error("Beállítások mentési hiba:", error);

    gameSettingsMessage.style.color = "#ffb3b3";
    gameSettingsMessage.textContent = "Kapcsolódási hiba.";
  }
}

// Saját jelszó módosítása
async function updatePassword(event) {
  event.preventDefault();

  const oldPassword = document.getElementById("old-password").value;

  const newPassword = document.getElementById("new-password").value;

  const newPasswordAgain = document.getElementById("new-password-again").value;

  passwordMessage.textContent = "";

  // Böngészőoldali ellenőrzés
  if (newPassword !== newPasswordAgain) {
    passwordMessage.style.color = "#ffb3b3";

    passwordMessage.textContent = "Az új jelszavak nem egyeznek.";

    return;
  }

  try {
    const response = await fetch("../backend/update_password.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        old_password: oldPassword,

        new_password: newPassword,

        new_password_again: newPasswordAgain,
      }),
    });

    const data = await response.json();

    if (data.success) {
      passwordMessage.style.color = "#8fff8f";

      passwordMessage.textContent = data.message;

      passwordForm.reset();
    } else {
      passwordMessage.style.color = "#ffb3b3";

      passwordMessage.textContent = data.message;
    }
  } catch (error) {
    console.error("Jelszómódosítási hiba:", error);

    passwordMessage.style.color = "#ffb3b3";

    passwordMessage.textContent = "Kapcsolódási hiba.";
  }
}

// Játékbeállítások mentése gomb
if (saveGameSettingsButton) {
  saveGameSettingsButton.addEventListener("click", saveGameSettings);
}

// Jelszómódosító űrlap
if (passwordForm) {
  passwordForm.addEventListener("submit", updatePassword);
}

// Az oldal indulásakor először a listák töltődnek be,
// utána a felhasználó mentett beállításai.
(async () => {
  await loadSettingLists();

  await loadGameSettings();
})();
