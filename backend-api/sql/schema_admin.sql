-- Admin Panel Schema
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin', 'demo') DEFAULT 'admin',
    api_token VARCHAR(255) UNIQUE DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Initial Superadmin
-- Default username: superadmin
-- Default password: adminpassword (hashed using bcrypt)
INSERT INTO admins (name, username, email, password, role) VALUES
('Super Admin', 'superadmin', 'superadmin@codeaxe.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin');

-- Seed Demo Admin
-- Default username: demoadmin
-- Default password: demopassword (hashed using bcrypt)
INSERT INTO admins (name, username, email, password, role) VALUES
('Demo View Only', 'demoadmin', 'demo@codeaxe.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'demo');
