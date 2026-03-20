-- Client Requests Table
CREATE TABLE IF NOT EXISTS client_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    budget VARCHAR(100) DEFAULT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dashboard UI Text Configuration
CREATE TABLE IF NOT EXISTS dashboard_ui (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(50) NOT NULL UNIQUE, -- 'dashboard' or 'send-request'
    title VARCHAR(255) NOT NULL,
    subtitle TEXT
);

INSERT INTO dashboard_ui (page_key, title, subtitle) VALUES
('dashboard', 'Client Dashboard', 'Manage your requests, track progress, and collaborate with our team.'),
('send-request', 'Start a New Project', 'Submit a detailed request for your next digital product or service.');
