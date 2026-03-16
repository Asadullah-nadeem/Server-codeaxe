CREATE TABLE IF NOT EXISTS home_section_headers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(50) NOT NULL UNIQUE,
    section_index VARCHAR(10) NULL,
    label VARCHAR(255) NOT NULL,
    title VARCHAR(255) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO home_section_headers (section_key, section_index, label, title, description) VALUES 
('system_status', NULL, 'System Status', NULL, NULL),
('partners', NULL, 'Partners', NULL, NULL),
('capabilities', '01', 'CAPABILITIES', 'Engineering Services', 'Full-stack development services built on modern, scalable architecture.'),
('featured_work', '02', 'FEATURED WORK', 'Selected Projects', 'Systems built for performance, reliability, and scale.'),
('why_codeaxe', '03', 'WHY CODEAXE', 'Engineering Principles', NULL),
('technologies', NULL, 'Best Technologies We Use', NULL, NULL);
