use mathsALaMaison;

-- Table User
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(16) NOT NULL UNIQUE,
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(512) NOT NULL,
    point INT NOT NULL CHECK (point >= 0) DEFAULT 0,
    isPremium BOOLEAN NOT NULL DEFAULT 0,
    nombrePartie INT NOT NULL CHECK (nombrePartie >= 0) DEFAULT 0,
    nombreVictoire INT NOT NULL CHECK (nombreVictoire >= 0) DEFAULT 0,
    photoDeProfil INT NOT NULL DEFAULT 1,
    specialRole ENUM('admin', 'user') DEFAULT 'user'
);

-- Table Questions
CREATE TABLE Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typeQuestion VARCHAR(512),
    question VARCHAR(512),
    typeReponse VARCHAR(64),
    reponse VARCHAR(1024),
    correction VARCHAR(1024),
    image_data LONGBLOB	
);

-- Table Sessions
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expired_at TIMESTAMP NULL,
    ip_address VARCHAR(45),
    device_info VARCHAR(255),
    last_login DATETIME,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE Settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  keyName VARCHAR(100) UNIQUE NOT NULL,
  value VARCHAR(255) NOT NULL
);

CREATE TABLE verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    pseudo VARCHAR(255) DEFAULT NULL,
    code_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    token VARCHAR(255) DEFAULT NULL
);