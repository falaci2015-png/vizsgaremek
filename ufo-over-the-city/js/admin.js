// Admin menü gombjai
const menuButtons = document.querySelectorAll(".admin-menu-button");

// Admin tartalmi szakaszok
const adminSections = document.querySelectorAll(".admin-section");

// Aktuális szakasz címe
const sectionTitle = document.getElementById("section-title");

// Kijelentkezés gomb
const logoutButton = document.getElementById("logout-button");

// A menüpontokhoz tartozó magyar címek
const sectionTitles = {
  stats: "Statisztika",
  users: "Felhasználók",
  scores: "Ranglista",
  cities: "Városok",
};

// Admin menüpont megnyitása
function openAdminSection(sectionName) {
  // Aktív gombjelölés eltávolítása
  menuButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Minden tartalmi rész elrejtése
  adminSections.forEach((section) => {
    section.classList.remove("active");
  });

  // Kiválasztott menügomb megkeresése
  const selectedButton = document.querySelector(
    `[data-section="${sectionName}"]`,
  );

  // Kiválasztott tartalmi rész megkeresése
  const selectedSection = document.getElementById(`${sectionName}-section`);

  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  if (selectedSection) {
    selectedSection.classList.add("active");
  }

  if (sectionTitle && sectionTitles[sectionName]) {
    sectionTitle.textContent = sectionTitles[sectionName];
  }

  // Statisztika megnyitásakor friss adatokat kérünk
  if (sectionName === "stats") {
    loadStats();
  }
  if (sectionName === "users") {
    loadUsers();
  }
  if (sectionName === "cities") {
    loadCities();
  }
}

// Menügombok kattintásának kezelése
menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sectionName = button.dataset.section;

    openAdminSection(sectionName);
  });
});
// *************************************
// Felhasználók
// *************************************

const usersTableBody = document.getElementById("users-table-body");

const refreshUsersButton = document.getElementById("refresh-users-button");

const usersMessage = document.getElementById("users-message");
// *************************************
// Városok
// *************************************

const cityList = document.getElementById("city-list");

const citiesMessage = document.getElementById("cities-message");
const newCityButton = document.getElementById("new-city-button");
const cityNameInput = document.getElementById("city-name-input");

const cityBuildingCount = document.getElementById("city-building-count");

const cityBuildingsList = document.getElementById("city-buildings-list");

const saveCityButton = document.getElementById("save-city-button");

const deleteCityButton = document.getElementById("delete-city-button");
const buildingSelectorModal = document.getElementById(
  "building-selector-modal",
);

const buildingSelectorGrid = document.getElementById("building-selector-grid");

const closeBuildingSelectorButton = document.getElementById(
  "close-building-selector",
);

// Az éppen cserélni kívánt házkártya
let selectedBuildingItem = null;
// Van-e nem mentett módosítás
let cityModified = false;

// Jelenleg kiválasztott város azonosítója
let selectedCityId = null;
// Felhasználók betöltése az adatbázisból
async function loadUsers() {
  usersTableBody.innerHTML = "";
  usersMessage.textContent = "";

  try {
    const response = await fetch("../backend/get_users.php");

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A felhasználók nem tölthetők be.");
    }

    if (data.users.length === 0) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="5">
            Nincs megjeleníthető felhasználó.
          </td>
        </tr>
      `;

      return;
    }

    data.users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.id}</td>

        <td>${user.username}</td>

        <td>
          <select
            class="admin-role-select"
            data-user-id="${user.id}">

            <option
              value="user"
              ${user.role === "user" ? "selected" : ""}>
              Felhasználó
            </option>

            <option
              value="admin"
              ${user.role === "admin" ? "selected" : ""}>
              Admin
            </option>

          </select>
        </td>

        <td>${new Date(user.created_at).toLocaleString("hu-HU")}</td>

        <td>
          <button
            class="admin-small-button save-role-button"
            type="button"
            data-user-id="${user.id}">

            MENTÉS

          </button>

          <button
            class="admin-small-button delete-user-button"
            type="button"
            data-user-id="${user.id}"
            data-username="${user.username}">

            TÖRLÉS

          </button>
        </td>
      `;

      usersTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Felhasználók betöltési hiba:", error);

    usersMessage.style.color = "#ffb3b3";
    usersMessage.textContent = error.message;
  }
}
// Városok betöltése
async function loadCities() {
  cityList.innerHTML = "";

  citiesMessage.textContent = "";

  try {
    const response = await fetch("../backend/get_cities.php");

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A városok nem tölthetők be.");
    }

    if (data.cities.length === 0) {
      cityList.innerHTML = `
        <p class="city-empty-message">
          Nincs létrehozott város.
        </p>
      `;

      return;
    }

    data.cities.forEach((city) => {
      const button = document.createElement("button");

      button.className = "admin-menu-button";

      button.textContent = city.name;

      button.dataset.cityId = city.id;

      cityList.appendChild(button);
    });
  } catch (error) {
    console.error(error);

    citiesMessage.style.color = "#ffb3b3";

    citiesMessage.textContent = error.message;
  }
}
// Kiválasztott város és házainak betöltése
async function loadCityBuildings(cityId) {
  citiesMessage.textContent = "";

  cityBuildingsList.innerHTML = `
    <p class="city-empty-message">
      Betöltés...
    </p>
  `;

  try {
    const response = await fetch(
      `../backend/get_city_buildings.php?city_id=${cityId}`,
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A város házai nem tölthetők be.");
    }

    selectedCityId = Number(data.city.id);

    cityNameInput.value = data.city.name;

    cityBuildingCount.textContent = `${data.building_count} / 20`;

    deleteCityButton.disabled = false;

    setCityModified(false);

    // Kiválasztott városgomb megjelölése
    cityList.querySelectorAll("button").forEach((button) => {
      button.classList.toggle(
        "active",
        Number(button.dataset.cityId) === selectedCityId,
      );
    });

    cityBuildingsList.innerHTML = "";

    if (data.buildings.length === 0) {
      cityBuildingsList.innerHTML = `
        <p class="city-empty-message">
          Ehhez a városhoz még nincsenek házak rendelve.
        </p>
      `;

      return;
    }

    data.buildings.forEach((building) => {
      const item = document.createElement("div");

      item.className = "city-building-item";

      item.dataset.cityBuildingId = building.city_building_id;
      item.dataset.buildingTypeId = building.building_type_id;

      item.innerHTML = `
        <div class="city-building-position">
          ${building.position}.
        </div>

        <div class="city-building-preview">
          <img
            src="../assets/buildings/${building.image_filename}"
            alt="${building.name}">
        </div>

        <div class="city-building-info">
          <strong>${building.name}</strong>

          <span>${building.image_filename}</span>

          <small>
            Spawn: ${building.spawn_x} / ${building.spawn_y}
          </small>
        </div>

        <div class="city-building-controls">
          <button
            class="city-move-button move-up-button"
            type="button"
            title="Mozgatás felfelé">
            ▲
          </button>

          <button
            class="city-move-button move-down-button"
            type="button"
            title="Mozgatás lefelé">
            ▼
          </button>

          <button
            class="city-change-button"
            type="button"
            title="Ház cseréje">
            CSERE
          </button>
        </div>
      `;

      cityBuildingsList.appendChild(item);
    });
  } catch (error) {
    console.error("Város betöltési hiba:", error);

    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = error.message;

    cityBuildingsList.innerHTML = `
      <p class="city-empty-message">
        A város adatai nem tölthetők be.
      </p>
    `;
  }
}
// Város kiválasztása a bal oldali listából
if (cityList) {
  cityList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-city-id]");

    if (!button) {
      return;
    }

    const cityId = Number(button.dataset.cityId);

    loadCityBuildings(cityId);
  });
}
// Házak sorrendjének módosítása a szerkesztőben
if (cityBuildingsList) {
  cityBuildingsList.addEventListener("click", (event) => {
    const changeButton = event.target.closest(".city-change-button");

    // CSERE gomb
    if (changeButton) {
      selectedBuildingItem = changeButton.closest(".city-building-item");

      if (!selectedBuildingItem) {
        return;
      }

      buildingSelectorModal.classList.add("active");

      loadBuildingTypes();

      return;
    }

    const moveButton = event.target.closest(".city-move-button");

    if (!moveButton) {
      return;
    }
    const currentItem = moveButton.closest(".city-building-item");

    if (!currentItem) {
      return;
    }

    // Mozgatás egy hellyel felfelé
    if (moveButton.classList.contains("move-up-button")) {
      const previousItem = currentItem.previousElementSibling;

      if (previousItem) {
        cityBuildingsList.insertBefore(currentItem, previousItem);
      }
    }

    // Mozgatás egy hellyel lefelé
    if (moveButton.classList.contains("move-down-button")) {
      const nextItem = currentItem.nextElementSibling;

      if (nextItem) {
        cityBuildingsList.insertBefore(nextItem, currentItem);
      }
    }

    updateBuildingPositions();
    setCityModified(true);
  });
}
// A megjelenített házsorszámok frissítése
function updateBuildingPositions() {
  const buildingItems = cityBuildingsList.querySelectorAll(
    ".city-building-item",
  );

  buildingItems.forEach((item, index) => {
    const positionElement = item.querySelector(".city-building-position");

    if (positionElement) {
      positionElement.textContent = `${index + 1}.`;
    }

    // Az új sorrendet eltároljuk az elemen
    item.dataset.position = index + 1;
  });
}
// A szerkesztő mentési állapotának frissítése
function setCityModified(modified) {
  cityModified = modified;

  if (!saveCityButton) {
    return;
  }

  if (modified) {
    saveCityButton.disabled = false;

    saveCityButton.textContent = "💾 VÁROS MENTÉSE";

    saveCityButton.classList.add("save-needed");

    citiesMessage.style.color = "#ffd966";

    citiesMessage.textContent = "⚠ Nem mentett módosítások.";
  } else {
    saveCityButton.disabled = true;

    saveCityButton.textContent = "VÁROS MENTÉSE";

    saveCityButton.classList.remove("save-needed");

    citiesMessage.textContent = "";
  }
}
// A város házsorrendjének mentése az adatbázisba
async function saveCityBuildings() {
  if (!selectedCityId || !cityModified) {
    return;
  }
  const cityName = cityNameInput.value.trim();

  if (cityName === "") {
    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = "A város nevét kötelező megadni.";

    return;
  }

  if (cityName.length > 40) {
    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = "A város neve legfeljebb 40 karakter lehet.";

    return;
  }
  const buildingItems = cityBuildingsList.querySelectorAll(
    ".city-building-item",
  );

  // Minden városnak pontosan 20 házból kell állnia
  if (buildingItems.length !== 20) {
    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = "A város csak pontosan 20 házzal menthető.";

    return;
  }
  const buildings = Array.from(buildingItems).map((item) => {
    return {
      building_type_id: Number(item.dataset.buildingTypeId),
    };
  });

  saveCityButton.disabled = true;
  saveCityButton.textContent = "MENTÉS...";

  try {
    const response = await fetch("../backend/update_city_buildings.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        city_id: selectedCityId,
        city_name: cityName,
        buildings: buildings,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A város mentése sikertelen.");
    }
    await loadCities();
    setCityModified(false);
    cityList.querySelectorAll("button").forEach((button) => {
      button.classList.toggle(
        "active",
        Number(button.dataset.cityId) === selectedCityId,
      );
    });

    citiesMessage.style.color = "#8fff8f";
    citiesMessage.textContent = data.message;
  } catch (error) {
    console.error("Városmentési hiba:", error);

    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = error.message;

    // Hiba esetén maradjon aktív a mentés
    saveCityButton.disabled = false;
    saveCityButton.textContent = "💾 VÁROS MENTÉSE";
    saveCityButton.classList.add("save-needed");
  }
}
// Új város létrehozása a kiválasztott város másolatából
async function createCity() {
  if (!selectedCityId) {
    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = "Előbb válassz ki egy mintavárost.";

    return;
  }

  const cityName = prompt("Add meg az új város nevét:");

  // Mégse gomb
  if (cityName === null) {
    return;
  }

  const trimmedCityName = cityName.trim();

  if (trimmedCityName === "") {
    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = "A város nevét kötelező megadni.";

    return;
  }

  if (trimmedCityName.length > 40) {
    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = "A város neve legfeljebb 40 karakter lehet.";

    return;
  }

  newCityButton.disabled = true;
  newCityButton.textContent = "LÉTREHOZÁS...";

  try {
    const response = await fetch("../backend/create_city.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: trimmedCityName,
        template_city_id: selectedCityId,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Az új város létrehozása sikertelen.");
    }

    await loadCities();

    await loadCityBuildings(data.city_id);

    citiesMessage.style.color = "#8fff8f";
    citiesMessage.textContent = data.message;
  } catch (error) {
    console.error("Városlétrehozási hiba:", error);

    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = error.message;
  } finally {
    newCityButton.disabled = false;
    newCityButton.textContent = "ÚJ VÁROS";
  }
}
// A 30 választható háztípus betöltése
async function loadBuildingTypes() {
  buildingSelectorGrid.innerHTML = `
    <p class="city-empty-message">
      Házak betöltése...
    </p>
  `;

  try {
    const response = await fetch("../backend/get_building_types.php");

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A háztípusok nem tölthetők be.");
    }

    buildingSelectorGrid.innerHTML = "";

    data.building_types.forEach((buildingType) => {
      const button = document.createElement("button");

      button.className = "building-selector-item";
      button.type = "button";

      button.dataset.buildingTypeId = buildingType.id;
      button.dataset.name = buildingType.name;
      button.dataset.imageFilename = buildingType.image_filename;
      button.dataset.spawnX = buildingType.spawn_x;
      button.dataset.spawnY = buildingType.spawn_y;

      button.innerHTML = `
        <img
          src="../assets/buildings/${buildingType.image_filename}"
          alt="${buildingType.name}">

        <strong>${buildingType.name}</strong>

        <span>${buildingType.image_filename}</span>
      `;

      buildingSelectorGrid.appendChild(button);
    });
  } catch (error) {
    console.error("Háztípus-betöltési hiba:", error);

    buildingSelectorGrid.innerHTML = `
      <p class="city-empty-message">
        ${error.message}
      </p>
    `;
  }
}
// Kiválasztott háztípus behelyezése a városba
if (buildingSelectorGrid) {
  buildingSelectorGrid.addEventListener("click", (event) => {
    const selectedTypeButton = event.target.closest(".building-selector-item");

    if (!selectedTypeButton || !selectedBuildingItem) {
      return;
    }

    const buildingTypeId = Number(selectedTypeButton.dataset.buildingTypeId);

    const buildingName = selectedTypeButton.dataset.name;
    const imageFilename = selectedTypeButton.dataset.imageFilename;
    const spawnX = selectedTypeButton.dataset.spawnX;
    const spawnY = selectedTypeButton.dataset.spawnY;

    // Az új háztípus azonosítójának eltárolása
    selectedBuildingItem.dataset.buildingTypeId = buildingTypeId;

    // Előnézeti kép frissítése
    const previewImage = selectedBuildingItem.querySelector(
      ".city-building-preview img",
    );

    if (previewImage) {
      previewImage.src = `../assets/buildings/${imageFilename}`;

      previewImage.alt = buildingName;
    }

    // Ház adatainak frissítése
    const nameElement = selectedBuildingItem.querySelector(
      ".city-building-info strong",
    );

    const filenameElement = selectedBuildingItem.querySelector(
      ".city-building-info span",
    );

    const spawnElement = selectedBuildingItem.querySelector(
      ".city-building-info small",
    );

    if (nameElement) {
      nameElement.textContent = buildingName;
    }

    if (filenameElement) {
      filenameElement.textContent = imageFilename;
    }

    if (spawnElement) {
      spawnElement.textContent = `Spawn: ${spawnX} / ${spawnY}`;
    }

    // Mentés szükséges
    setCityModified(true);

    // Házválasztó bezárása
    buildingSelectorModal.classList.remove("active");

    selectedBuildingItem = null;
  });
}
// Kiválasztott város törlése
async function deleteCity() {
  if (!selectedCityId) {
    return;
  }

  if (selectedCityId === 1) {
    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = "Az alapváros nem törölhető.";

    return;
  }

  const cityName = cityNameInput.value.trim();

  const confirmed = confirm(
    `Biztosan törölni szeretnéd ezt a várost?\n\n${cityName}`,
  );

  if (!confirmed) {
    return;
  }

  deleteCityButton.disabled = true;
  deleteCityButton.textContent = "TÖRLÉS...";

  try {
    const response = await fetch("../backend/delete_city.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        city_id: selectedCityId,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A város törlése sikertelen.");
    }

    selectedCityId = null;

    cityNameInput.value = "";
    cityBuildingCount.textContent = "0 / 20";

    cityBuildingsList.innerHTML = `
      <p class="city-empty-message">
        Válassz ki egy várost a szerkesztéshez.
      </p>
    `;

    setCityModified(false);

    deleteCityButton.disabled = true;

    await loadCities();

    citiesMessage.style.color = "#8fff8f";
    citiesMessage.textContent = data.message;
  } catch (error) {
    console.error("Várostörlési hiba:", error);

    citiesMessage.style.color = "#ffb3b3";
    citiesMessage.textContent = error.message;

    deleteCityButton.disabled = false;
  } finally {
    deleteCityButton.textContent = "VÁROS TÖRLÉSE";
  }
}
// Felhasználói műveletek kezelése
if (usersTableBody) {
  usersTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    const userId = Number(button.dataset.userId);

    // Jogosultság mentése
    if (button.classList.contains("save-role-button")) {
      const roleSelect = usersTableBody.querySelector(
        `.admin-role-select[data-user-id="${userId}"]`,
      );

      if (!roleSelect) {
        return;
      }

      usersMessage.textContent = "";

      try {
        const response = await fetch("../backend/update_role.php", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: userId,
            role: roleSelect.value,
          }),
        });

        const data = await response.json();

        usersMessage.style.color = data.success ? "#8fff8f" : "#ffb3b3";
        usersMessage.textContent = data.message;

        if (data.success) {
          await loadUsers();
          await loadStats();
        }
      } catch (error) {
        console.error("Jogosultságmódosítási hiba:", error);

        usersMessage.style.color = "#ffb3b3";
        usersMessage.textContent = "Kapcsolódási hiba.";
      }

      return;
    }

    // Felhasználó törlése
    if (button.classList.contains("delete-user-button")) {
      const username = button.dataset.username;

      const confirmed = confirm(
        `Biztosan törölni szeretnéd ezt a felhasználót?\n\n${username}`,
      );

      if (!confirmed) {
        return;
      }

      usersMessage.textContent = "";

      try {
        const response = await fetch("../backend/delete_user.php", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: userId,
          }),
        });

        const data = await response.json();

        usersMessage.style.color = data.success ? "#8fff8f" : "#ffb3b3";
        usersMessage.textContent = data.message;

        if (data.success) {
          await loadUsers();
          await loadStats();
        }
      } catch (error) {
        console.error("Felhasználótörlési hiba:", error);

        usersMessage.style.color = "#ffb3b3";
        usersMessage.textContent = "Kapcsolódási hiba.";
      }
    }
  });
}
// Admin statisztikák lekérése
async function loadStats() {
  try {
    const response = await fetch("../backend/get_stats.php");

    if (!response.ok) {
      throw new Error("A statisztika nem tölthető be.");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Statisztikai hiba történt.");
    }

    document.getElementById("user-count").textContent = data.user_count ?? 0;

    document.getElementById("admin-count").textContent = data.admin_count ?? 0;

    document.getElementById("online-count").textContent =
      data.online_count ?? 0;

    document.getElementById("score-count").textContent = data.score_count ?? 0;
  } catch (error) {
    console.error("Statisztikai hiba:", error);

    document.getElementById("user-count").textContent = "-";
    document.getElementById("admin-count").textContent = "-";
    document.getElementById("online-count").textContent = "-";
    document.getElementById("score-count").textContent = "-";
  }
}

// Kijelentkezés
async function logout() {
  try {
    const response = await fetch("../backend/logout.php", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("A kijelentkezés nem sikerült.");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A kijelentkezés nem sikerült.");
    }

    // Sikeres kijelentkezés után vissza a főmenübe
    window.location.href = "../index.php";
  } catch (error) {
    console.error("Kijelentkezési hiba:", error);

    alert("A kijelentkezés közben hiba történt.");
  }
}

// Kijelentkezés gomb eseménye
if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
if (refreshUsersButton) {
  refreshUsersButton.addEventListener("click", loadUsers);
}
// Város mentése gomb
if (saveCityButton) {
  saveCityButton.addEventListener("click", saveCityBuildings);
}
// Új város gomb
if (newCityButton) {
  newCityButton.addEventListener("click", createCity);
}
// Városnév módosításakor mentés szükséges
if (cityNameInput) {
  cityNameInput.addEventListener("input", () => {
    if (selectedCityId) {
      setCityModified(true);
    }
  });
}
// Város törlése gomb
if (deleteCityButton) {
  deleteCityButton.addEventListener("click", deleteCity);
}
// Házválasztó bezárása
if (closeBuildingSelectorButton) {
  closeBuildingSelectorButton.addEventListener("click", () => {
    buildingSelectorModal.classList.remove("active");
    selectedBuildingItem = null;
  });
}

// Bezárás a sötét háttérre kattintva
if (buildingSelectorModal) {
  buildingSelectorModal.addEventListener("click", (event) => {
    if (event.target === buildingSelectorModal) {
      buildingSelectorModal.classList.remove("active");
      selectedBuildingItem = null;
    }
  });
}
// Oldal betöltésekor a statisztika lekérése
loadStats();
