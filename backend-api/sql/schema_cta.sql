CREATE TABLE IF NOT EXISTS home_cta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    badge VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    button_label VARCHAR(255) NOT NULL,
    button_link VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO home_cta (badge, title, description, button_label, button_link) VALUES 
('Ready to build?', 'Let''s engineer your next system.', 'From architecture to deployment — we handle the full stack.', 'Start Your Project', '/contact');
