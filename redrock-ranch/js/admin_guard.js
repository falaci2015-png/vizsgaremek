// Admin jogosultság ellenőrzése
fetch("backend/get_user.php")
  .then((response) => response.json())
  .then((data) => {
    if (!data.logged_in || data.role !== "admin") {
      location.href = "index.html";
    }
  })
  .catch(() => {
    location.href = "index.html";
  });
