// ===== Beállítások =====
fetch("backend/get_user.php")
  .then((response) => response.json())
  .then((data) => {
    if (!data.logged_in) {
      location.href = "login.html";
      return;
    }

    playerName.value = data.username;
  })
  .catch(() => {
    location.href = "login.html";
  });
const musicEnabled = document.getElementById("musicEnabled");
const soundEnabled = document.getElementById("soundEnabled");
const gameTime = document.getElementById("gameTime");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const backBtn = document.getElementById("backBtn");
const playerName = document.getElementById("playerName");

const savedMusic = localStorage.getItem("redrockMusicEnabled");
const savedSound = localStorage.getItem("redrockSoundEnabled");
const savedTime = localStorage.getItem("redrockGameTime");
const savedPlayerName = localStorage.getItem("redrockPlayerName");
const oldPassword = document.getElementById("oldPassword");
const newPassword = document.getElementById("newPassword");
const newPasswordAgain = document.getElementById("newPasswordAgain");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const passwordMessage = document.getElementById("passwordMessage");
musicEnabled.checked = savedMusic !== "false";
soundEnabled.checked = savedSound !== "false";
gameTime.value = savedTime || "60";
/*playerName.value = savedPlayerName || "Játékos";*/

saveSettingsBtn.addEventListener("click", () => {
  localStorage.setItem("redrockMusicEnabled", musicEnabled.checked);
  localStorage.setItem("redrockSoundEnabled", soundEnabled.checked);
  localStorage.setItem("redrockGameTime", gameTime.value);
  localStorage.setItem(
    "redrockPlayerName",
    playerName.value.trim() || "Játékos",
  );

  alert("Beállítások mentve!");
});

backBtn.addEventListener("click", () => {
  location.href = "index.html";
});
// Jelszó módosítása
changePasswordBtn.addEventListener("click", () => {
  fetch("backend/update_password.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      old_password: oldPassword.value.trim(),
      new_password: newPassword.value.trim(),
      new_password_again: newPasswordAgain.value.trim(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      passwordMessage.textContent = data.message;

      if (data.success) {
        oldPassword.value = "";
        newPassword.value = "";
        newPasswordAgain.value = "";
      }
    })
    .catch((error) => {
      console.error("Jelszó módosítás hiba:", error);
      passwordMessage.textContent = "Hiba történt a jelszó módosításakor.";
    });
});
