// ===== Beállítások =====
const difficultySelect = document.getElementById("difficultySelect");
const soundCheck = document.getElementById("soundToggle");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const backBtn = document.getElementById("backBtn");

difficultySelect.value = localStorage.getItem("railDifficulty") || "normal";

soundCheck.checked = localStorage.getItem("railSound") !== "off";

saveSettingsBtn.addEventListener("click", () => {
  localStorage.setItem("railDifficulty", difficultySelect.value);

  localStorage.setItem("railSound", soundCheck.checked ? "on" : "off");

  passwordMessage.style.color = "#7CFC00";
  passwordMessage.textContent = "Beállítások mentve.";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 800);
});

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

const oldPasswordInput = document.getElementById("oldPassword");
const newPasswordInput = document.getElementById("newPassword");
const newPasswordAgainInput = document.getElementById("newPasswordAgain");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const passwordMessage = document.getElementById("passwordMessage");
// Jelszó módosítása
changePasswordBtn.addEventListener("click", async () => {
  const oldPassword = oldPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const newPasswordAgain = newPasswordAgainInput.value;

  if (newPassword !== newPasswordAgain) {
    passwordMessage.textContent = "Az új jelszavak nem egyeznek.";
    return;
  }

  const response = await fetch("backend/update_password.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
    }),
  });

  const result = await response.json();
  passwordMessage.textContent = result.message;
});
