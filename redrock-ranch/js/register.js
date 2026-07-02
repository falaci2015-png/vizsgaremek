// ===== Regisztráció =====
const username = document.getElementById("username");
const password = document.getElementById("password");
const passwordAgain = document.getElementById("passwordAgain");
const registerBtn = document.getElementById("registerBtn");
const loginPageBtn = document.getElementById("loginPageBtn");
const registerMessage = document.getElementById("registerMessage");

registerBtn.addEventListener("click", () => {
  register();
});

passwordAgain.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    register();
  }
});

loginPageBtn.addEventListener("click", () => {
  location.href = "login.html";
});
// Bejelentkezési folyamat
function register() {
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();
  const passwordAgainValue = passwordAgain.value.trim();

  if (
    usernameValue === "" ||
    passwordValue === "" ||
    passwordAgainValue === ""
  ) {
    registerMessage.textContent = "Minden mező kitöltése kötelező!";
    return;
  }

  if (passwordValue !== passwordAgainValue) {
    registerMessage.textContent = "A két jelszó nem egyezik!";
    return;
  }

  fetch("backend/register.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usernameValue,
      password: passwordValue,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        registerMessage.textContent =
          data.message || "Sikertelen regisztráció.";
        return;
      }

      registerMessage.textContent = "Sikeres regisztráció! Átirányítás...";

      setTimeout(() => {
        location.href = "login.html";
      }, 1000);
    })
    .catch((error) => {
      console.error("Regisztrációs hiba:", error);
      registerMessage.textContent = "Hiba történt regisztráció közben.";
    });
}
const projectExitZone = document.getElementById("projectExitZone");

if (projectExitZone) {
  projectExitZone.addEventListener("click", () => {
    location.href = "../index.html";
  });
}
