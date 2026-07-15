-- ============================================================
-- UFO Over the City
-- JAVÍTOTT, tiszta telepítő adatbázis
-- Adatbázis neve: ufo_over_the_city
--
-- Védett alap admin:
--   felhasználónév: admin
--   jelszó: 1234
--
-- A telepítés minden táblát újra létrehoz.
-- A kezdő adatok azonosítói 1-től indulnak.
-- Egy alapvárost tartalmaz: Miskolc.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS ufo_over_the_city
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_hungarian_ci;

USE ufo_over_the_city;

DROP TRIGGER IF EXISTS protect_main_admin_update;
DROP TRIGGER IF EXISTS protect_main_admin_delete;

DROP TABLE IF EXISTS leaderboard;
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS city_buildings;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS backgrounds;
DROP TABLE IF EXISTS building_types;
DROP TABLE IF EXISTS users;

-- ============================================================
-- 1. FELHASZNÁLÓK
-- ============================================================

CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    is_online TINYINT(1) NOT NULL DEFAULT 0,
    last_active DATETIME DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_hungarian_ci;

-- A hash az "1234" jelszóhoz tartozik.
INSERT INTO users (
    id, username, password_hash, email, role, is_online, last_active
) VALUES (
    1,
    'admin',
    '$2y$12$mvgpPAWGY0hNTEFJ4wano.bYURwNeDamipcbucqt8G3K6JMiSwFXi',
    'admin@ufo.local',
    'admin',
    0,
    NULL
);

-- ============================================================
-- 2. HÁZTÍPUSOK
-- ============================================================

CREATE TABLE building_types (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    image_filename VARCHAR(255) NOT NULL,
    spawn_x SMALLINT UNSIGNED NOT NULL DEFAULT 125,
    spawn_y SMALLINT UNSIGNED NOT NULL DEFAULT 330,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_building_types_image (image_filename)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_hungarian_ci;

INSERT INTO building_types (id, name, image_filename, spawn_x, spawn_y) VALUES
(1, 'Ház 01', '01.png', 140, 330),
(2, 'Ház 02', '02.png', 90, 375),
(3, 'Ház 03', '03.png', 150, 370),
(4, 'Ház 04', '04.png', 100, 380),
(5, 'Ház 05', '05.png', 125, 270),
(6, 'Ház 06', '06.png', 125, 330),
(7, 'Ház 07', '07.png', 135, 355),
(8, 'Ház 08', '08.png', 110, 330),
(9, 'Ház 09', '09.png', 225, 315),
(10, 'Ház 10', '10.png', 180, 335),
(11, 'Ház 11', '11.png', 145, 350),
(12, 'Ház 12', '12.png', 155, 310),
(13, 'Ház 13', '13.png', 125, 345),
(14, 'Ház 14', '14.png', 200, 335),
(15, 'Ház 15', '15.png', 155, 355),
(16, 'Ház 16', '16.png', 155, 317),
(17, 'Ház 17', '17.png', 160, 345),
(18, 'Ház 18', '18.png', 100, 374),
(19, 'Ház 19', '19.png', 115, 320),
(20, 'Ház 20', '20.png', 125, 360),
(21, 'Ház 21', '21.png', 170, 349),
(22, 'Ház 22', '22.png', 125, 330),
(23, 'Ház 23', '23.png', 180, 315),
(24, 'Ház 24', '24.png', 125, 342),
(25, 'Ház 25', '25.png', 155, 355),
(26, 'Ház 26', '26.png', 145, 270),
(27, 'Ház 27', '27.png', 135, 335),
(28, 'Ház 28', '28.png', 110, 367),
(29, 'Ház 29', '29.png', 125, 327),
(30, 'Ház 30', '30.png', 125, 315);

-- ============================================================
-- 3. HÁTTEREK
-- ============================================================

CREATE TABLE backgrounds (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    image_filename VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_backgrounds_name (name),
    UNIQUE KEY uq_backgrounds_image (image_filename)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_hungarian_ci;

INSERT INTO backgrounds (id, name, image_filename) VALUES
(1, 'Telihold', '01_telihold.png'),
(2, 'Félhold', '02_felhold.png'),
(3, 'Csillagos ég', '03_csillagos_eg.png'),
(4, 'Sci-fi 1', '04_scifi_1.png'),
(5, 'Sci-fi 2', '05_scifi_2.png');

-- ============================================================
-- 4. VÁROSOK
-- ============================================================

CREATE TABLE cities (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    background_id INT UNSIGNED NOT NULL,
    created_by INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_cities_name (name),
    KEY idx_cities_background (background_id),
    KEY idx_cities_creator (created_by),

    CONSTRAINT fk_cities_background
        FOREIGN KEY (background_id) REFERENCES backgrounds(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_cities_creator
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_hungarian_ci;

INSERT INTO cities (id, name, background_id, created_by) VALUES
(1, 'Miskolc', 1, 1);

-- ============================================================
-- 5. A VÁROS HÁZAINAK SORRENDJE
-- ============================================================

CREATE TABLE city_buildings (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    city_id INT UNSIGNED NOT NULL,
    position TINYINT UNSIGNED NOT NULL,
    building_type_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_city_position (city_id, position),
    KEY idx_city_buildings_type (building_type_id),

    CONSTRAINT fk_city_buildings_city
        FOREIGN KEY (city_id) REFERENCES cities(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT fk_city_buildings_type
        FOREIGN KEY (building_type_id) REFERENCES building_types(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT chk_city_building_position
        CHECK (position BETWEEN 1 AND 20)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_hungarian_ci;

INSERT INTO city_buildings (id, city_id, position, building_type_id) VALUES
(1, 1, 1, 3),
(2, 1, 2, 17),
(3, 1, 3, 8),
(4, 1, 4, 25),
(5, 1, 5, 12),
(6, 1, 6, 1),
(7, 1, 7, 29),
(8, 1, 8, 6),
(9, 1, 9, 21),
(10, 1, 10, 10),
(11, 1, 11, 15),
(12, 1, 12, 27),
(13, 1, 13, 4),
(14, 1, 14, 19),
(15, 1, 15, 30),
(16, 1, 16, 7),
(17, 1, 17, 23),
(18, 1, 18, 14),
(19, 1, 19, 2),
(20, 1, 20, 26);

-- ============================================================
-- 6. FELHASZNÁLÓI BEÁLLÍTÁSOK
-- A PHP által használt összes mezővel és alapértékkel.
-- ============================================================

CREATE TABLE user_settings (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    selected_city_id INT UNSIGNED NOT NULL DEFAULT 1,
    selected_background_id INT UNSIGNED NOT NULL DEFAULT 1,
    difficulty ENUM('easy', 'normal', 'hard', 'brutal') NOT NULL DEFAULT 'normal',
    game_duration_seconds SMALLINT UNSIGNED NOT NULL DEFAULT 60,
    music_enabled TINYINT(1) NOT NULL DEFAULT 1,
    effects_enabled TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_user_settings_user (user_id),
    KEY idx_user_settings_city (selected_city_id),
    KEY idx_user_settings_background (selected_background_id),

    CONSTRAINT fk_user_settings_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT fk_user_settings_city
        FOREIGN KEY (selected_city_id) REFERENCES cities(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_user_settings_background
        FOREIGN KEY (selected_background_id) REFERENCES backgrounds(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT chk_user_settings_duration
        CHECK (game_duration_seconds IN (30, 60, 120))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_hungarian_ci;

-- Az admin is azonnal használható alapbeállításokat kap.
INSERT INTO user_settings (
    id, user_id, selected_city_id, selected_background_id,
    difficulty, game_duration_seconds, music_enabled, effects_enabled
) VALUES (
    1, 1, 1, 1, 'normal', 60, 1, 1
);

-- ============================================================
-- 7. RANGLISTA
-- Kezdetben üres. Az első eredmény az 1-es ID-t kapja.
-- ============================================================

CREATE TABLE leaderboard (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    city_id INT UNSIGNED NOT NULL,
    score INT UNSIGNED NOT NULL DEFAULT 0,
    game_duration_seconds SMALLINT UNSIGNED NOT NULL,
    played_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_leaderboard_ranking (city_id, game_duration_seconds, score),
    KEY idx_leaderboard_user (user_id),

    CONSTRAINT fk_leaderboard_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT fk_leaderboard_city
        FOREIGN KEY (city_id) REFERENCES cities(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT chk_leaderboard_duration
        CHECK (game_duration_seconds IN (30, 60, 120))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_hungarian_ci;

-- ============================================================
-- 8. A VÉDETT FŐ ADMIN
-- A név, jelszó, e-mail és szerepkör nem módosítható.
-- Az is_online és last_active mezők változhatnak, mert a PHP
-- ezeket belépéskor, aktivitáskor és kilépéskor frissíti.
-- ============================================================

DELIMITER $$

CREATE TRIGGER protect_main_admin_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    IF
        (OLD.id = 1 OR OLD.username = 'admin')
        AND (
            NEW.username <> OLD.username
            OR NEW.password_hash <> OLD.password_hash
            OR NEW.role <> OLD.role
            OR NOT (NEW.email <=> OLD.email)
        )
    THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A vedett alap admin nem modosithato.';
    END IF;
END$$

CREATE TRIGGER protect_main_admin_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
    IF OLD.id = 1 OR OLD.username = 'admin' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A vedett alap admin nem torolheto.';
    END IF;
END$$

DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Telepítés kész.
-- Első azonosítók:
-- users = 1, cities = 1, user_settings = 1,
-- city_buildings = 1, backgrounds = 1, building_types = 1.
-- A leaderboard üres, ezért az első eredmény ID-ja 1 lesz.
-- ============================================================
