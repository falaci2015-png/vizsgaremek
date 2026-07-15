// Kijelentkezés gomb
const logoutButton = document.getElementById("logout-button");

// Kijelentkezés
async function logout() {
  try {
    const response = await fetch("../backend/logout.php", {
      method: "POST",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "A kijelentkezés nem sikerült.");
    }

    // Sikeres kijelentkezés után vissza a kezdő indexhez
    window.location.href = "../index.php";
  } catch (error) {
    console.error("Kijelentkezési hiba:", error);

    alert("A kijelentkezés közben hiba történt.");
  }
}

// Gomb eseménye
if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
