<?php
// Felhasználók listájának lekérdezése
session_start();

require_once "db.php";

header("Content-Type: application/json; charset=UTF-8");
// Admin jogosultság ellenőrzése
if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {

    echo json_encode([]);

    exit;
}
// Felhasználók lekérdezése
$sql = "
SELECT
    id,
    username,
    role,
    created_at
FROM users
ORDER BY username ASC
";

$result =
    $conn->query($sql);

$users = [];

while ($row = $result->fetch_assoc()) {

    $users[] = $row;
}

echo json_encode($users);
