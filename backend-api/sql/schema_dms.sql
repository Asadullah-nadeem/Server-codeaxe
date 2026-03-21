-- DMS: Document / Media Management System
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(10) UNIQUE DEFAULT NULL,
    file_name VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'imagekit' or 's3'
    size INT DEFAULT 0,
    url TEXT NOT NULL,
    path TEXT DEFAULT NULL,
    status TINYINT(1) DEFAULT 1,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    media_id INT NOT NULL,
    field_changed VARCHAR(50) DEFAULT NULL,
    old_value TEXT DEFAULT NULL,
    new_value TEXT DEFAULT NULL,
    action_type VARCHAR(20) DEFAULT 'EDIT', -- EDIT, DELETE, RESTORE
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- DMS API Keys stored in DB (user requirement)
-- api_scope: 'upload' = upload only | 'admin' = full CRUD
CREATE TABLE IF NOT EXISTS dms_api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    api_key VARCHAR(128) NOT NULL UNIQUE,
    api_scope VARCHAR(20) DEFAULT 'upload', -- 'upload' or 'admin'
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DMS provider credentials (ImageKit / S3 keys stored per environment)
CREATE TABLE IF NOT EXISTS dms_provider_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider VARCHAR(50) NOT NULL, -- 'imagekit' or 's3'
    key_name VARCHAR(100) NOT NULL,
    key_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (provider, key_name)
);

-- Seed a default admin DMS API key
INSERT INTO dms_api_keys (label, api_key, api_scope) VALUES
('Default Admin Key', 'dms_admin_codeaxe_2026_CHANGE_ME_NOW', 'admin'),
('Default Upload Key', 'dms_upload_codeaxe_2026_CHANGE_ME_NOW', 'upload');
