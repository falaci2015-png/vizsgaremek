CREATE DATABASE IF NOT EXISTS redrock_ranch
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE redrock_ranch;
/*DROP TABLE IF EXISTS leaderboard;
DROP TABLE IF EXISTS users;*/

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    game_time INT NOT NULL DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Alap admin felhasználó
-- Belépés: admin / 1234

INSERT INTO users
(
    username,
    password_hash,
    role
)
VALUES
(
    'admin',
    '$2y$12$rkJ2uz2ucBFwdQIBZHj6GeQAcK/VjbFlxrX0Mpo49292ZtyT0fafm',
    'admin'
);