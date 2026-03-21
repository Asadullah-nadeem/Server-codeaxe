-- Client Chat Messages Table
CREATE TABLE IF NOT EXISTS client_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    sender_type ENUM('user', 'admin') NOT NULL,
    sender_id INT NOT NULL, -- user_id if 'user', admin_id if 'admin'
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES client_requests(id) ON DELETE CASCADE
);
