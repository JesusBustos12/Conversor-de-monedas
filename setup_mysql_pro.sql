-- ==========================================
-- SCRIPT DE INICIALIZACIÓN: CURRENCYHUB DB
-- ==========================================

-- 1. DDL: DEFINICIÓN DE BASE DE DATOS Y TABLAS
DROP DATABASE IF EXISTS currencyhub_db;
CREATE DATABASE currencyhub_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE currencyhub_db;

-- Tabla de Usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,       -- Se guardará con bcrypt
    pic_url LONGTEXT,                     -- Soporta Base64 o URLs largas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Auditoría de Accesos
CREATE TABLE login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    email_attempted VARCHAR(255),
    ip_address VARCHAR(45),
    status ENUM('SUCCESS', 'FAILED') NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla de Historial de Conversiones
CREATE TABLE conversions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    amount DECIMAL(18, 4) NOT NULL,
    result DECIMAL(18, 4) NOT NULL,
    rate VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. OPTIMIZACIÓN: ÍNDICES DE RENDIMIENTO
CREATE INDEX idx_logs_user ON login_logs(user_id);
CREATE INDEX idx_conv_user_date ON conversions(user_id, created_at DESC);

-- ==========================================
-- INSTRUCCIONES:
-- 1. Abre MySQL Workbench.
-- 2. Conéctate como 'root'.
-- 3. Copia y ejecuta este script completo (Ctrl+Shift+Enter).
-- 4. El backend usará las credenciales configuradas en .env o docker-compose.
-- ==========================================
