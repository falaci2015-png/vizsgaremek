// Bejelentkezés ellenőrzése
fetch("backend/get_user.php")
  .then((response) => response.json())
  .then((data) => {
    if (!data.logged_in) {
      location.href = "login.html";
    }
  })
  .catch(() => {
    location.href = "login.html";
  });
