CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online TINYINT(1) NOT NULL DEFAULT 0,
    last_active DATETIME DEFAULT NULL
);

CREATE TABLE leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    difficulty ENUM('easy', 'normal', 'hard') NOT NULL,
    score INT NOT NULL,
    trains_passed INT NOT NULL,
    correct_routes INT NOT NULL,
    wrong_routes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Alap admin felhasználó
-- Belépés: admin / 1234

INSERT INTO `users`
(
    `username`,
    `password_hash`,
    `role`
)
VALUES
(
    'admin',
    '$2y$12$rkJ2uz2ucBFwdQIBZHj6GeQAcK/VjbFlxrX0Mpo49292ZtyT0fafm',
    'admin'
);