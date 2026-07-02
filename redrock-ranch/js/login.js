// ===== Bejelentkezés =====
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerPageBtn = document.getElementById("registerPageBtn");
const loginMessage = document.getElementById("loginMessage");

loginBtn.addEventListener("click", () => {
  login();
});

password.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    login();
  }
});

registerPageBtn.addEventListener("click", () => {
  location.href = "register.html";
});
// Bejelentkezési folyamat
function login() {
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();

  if (usernameValue === "" || passwordValue === "") {
    loginMessage.textContent = "Add meg a felhasználónevet és a jelszót!";
    return;
  }

  fetch("backend/login.php", {
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
        loginMessage.textContent = data.message || "Sikertelen belépés.";
        return;
      }

      location.href = "index.html";
    })
    .catch((error) => {
      console.error("Belépési hiba:", error);
      loginMessage.textContent = "Hiba történt belépés közben.";
    });
}
const projectExitZone = document.getElementById("projectExitZone");

if (projectExitZone) {
  projectExitZone.addEventListener("click", () => {
    location.href = "../index.html";
  });
}
