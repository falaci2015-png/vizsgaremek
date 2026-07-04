CREATE TABLE leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,

    player_name VARCHAR(50) NOT NULL,

    car VARCHAR(20) NOT NULL,

    difficulty VARCHAR(20) NOT NULL,

    finish_time INT NOT NULL,

    money INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM('user','admin')
    DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online TINYINT(1) NOT NULL DEFAULT 0,
    last_active DATETIME DEFAULT NULL
);

-- Alap admin felhasználó
-- Belépés: admin / 1234
INSERT INTO `users` (`username`, `password`, `role`)
VALUES
(
    'admin',
    '$2y$12$rkJ2uz2ucBFwdQIBZHj6GeQAcK/VjbFlxrX0Mpo49292ZtyT0fafm',
    'admin'
);