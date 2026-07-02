// ===== Regisztráció =====
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const passwordAgainInput = document.getElementById("passwordAgain");
const registerBtn = document.getElementById("registerBtn");
const registerMessage = document.getElementById("registerMessage");

registerBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const passwordAgain = passwordAgainInput.value;

  if (password !== passwordAgain) {
    registerMessage.textContent = "A két jelszó nem egyezik.";
    return;
  }

  const response = await fetch("backend/register.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();

  registerMessage.textContent = result.message;

  if (result.success) {
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }
});
