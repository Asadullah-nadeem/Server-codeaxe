CREATE TABLE IF NOT EXISTS nav_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- e.g., 'main', 'portfolio', 'info'
    label VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS footer_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'company', 'portfolio', 'legal', 'contact'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS footer_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    label VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    is_external BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES footer_sections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS home_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    index_number VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    year VARCHAR(10) NOT NULL,
    tags JSON,
    image_url VARCHAR(500) DEFAULT NULL,
    project_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial Data Inserts
INSERT INTO nav_links (type, label, path) VALUES 
('main', 'Home', '/'),
('main', 'Work', '/work'),
('main', 'Services', '/services'),
('portfolio', 'Chrome Extensions', '/portfolio/chrome-extensions'),
('portfolio', 'Web Tools', '/portfolio/web-tools'),
('portfolio', 'App Store', '/portfolio/app-store'),
('portfolio', 'Play Store', '/portfolio/play-store'),
('portfolio', 'Client Projects', '/portfolio/client-projects'),
('info', 'About Us', '/about'),
('info', 'Contact', '/contact'),
('info', 'Privacy Policy', '/privacy'),
('info', 'Terms of Service', '/terms'),
('info', 'Refund & Cancellation', '/refund-cancellation'),
('info', 'Refund Policy', '/refund-policy');

INSERT INTO footer_sections (title, type) VALUES 
('Company', 'company'),
('Portfolio', 'portfolio'),
('Legal', 'legal'),
('Contact', 'contact');

INSERT INTO footer_links (section_id, label, url, is_external) VALUES 
((SELECT id FROM footer_sections WHERE type='company'), 'Home', '/', FALSE),
((SELECT id FROM footer_sections WHERE type='company'), 'Work', '/work', FALSE),
((SELECT id FROM footer_sections WHERE type='company'), 'Services', '/services', FALSE),
((SELECT id FROM footer_sections WHERE type='company'), 'About', '/about', FALSE),
((SELECT id FROM footer_sections WHERE type='portfolio'), 'Chrome Extensions', '/portfolio/chrome-extensions', FALSE),
((SELECT id FROM footer_sections WHERE type='portfolio'), 'Web Tools', '/portfolio/web-tools', FALSE),
((SELECT id FROM footer_sections WHERE type='portfolio'), 'Mobile Apps', '/portfolio/app-store', FALSE),
((SELECT id FROM footer_sections WHERE type='portfolio'), 'Client Projects', '/portfolio/client-projects', FALSE),
((SELECT id FROM footer_sections WHERE type='legal'), 'Privacy Policy', '/privacy', FALSE),
((SELECT id FROM footer_sections WHERE type='legal'), 'Terms of Service', '/terms', FALSE),
((SELECT id FROM footer_sections WHERE type='legal'), 'Refund Policy', '/refund-policy', FALSE),
((SELECT id FROM footer_sections WHERE type='contact'), 'hello@codeaxe.co.in', 'mailto:hello@codeaxe.co.in', TRUE),
((SELECT id FROM footer_sections WHERE type='contact'), 'GitHub', 'https://github.com/codeaxe', TRUE),
((SELECT id FROM footer_sections WHERE type='contact'), 'LinkedIn', 'https://linkedin.com/company/codeaxe', TRUE);

INSERT INTO home_services (index_number, title, description, icon) VALUES 
('01', 'Web Development', 'Custom websites, platforms, dashboards, and business tools built with modern frameworks.', 'Globe'),
('02', 'Custom Software', 'Internal tools and software systems engineered for your specific business requirements.', 'Code2'),
('03', 'API Development', 'Secure, scalable backend APIs with type-safe contracts and comprehensive documentation.', 'Server'),
('04', 'Chrome Extensions', 'Browser extensions that automate tasks and improve team productivity at scale.', 'Chrome'),
('05', 'Mobile Applications', 'Android and iOS applications designed for real-world use and performance.', 'Smartphone'),
('06', 'System Automation', 'Connecting APIs, services, and databases to create fully automated workflows.', 'Workflow');

INSERT INTO home_projects (title, description, year, tags, image_url, project_url) VALUES 
('DataVault Platform', 'Enterprise data management system handling 2M+ records with real-time sync and role-based access control.', '2025', '["React", "Node.js", "PostgreSQL"]', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 'https://github.com/codeaxe'),
('FlowSync API', 'High-throughput API gateway processing 50K requests/minute with automatic failover and load balancing.', '2025', '["TypeScript", "Redis", "Docker"]', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 'https://github.com/codeaxe'),
('TaskForge Extension', 'Chrome extension automating project management workflows across 12 integrated platforms.', '2024', '["Chrome API", "React", "WebSocket"]', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80', 'https://github.com/codeaxe');

INSERT INTO home_stats (value, label) VALUES 
('99.9%', 'Uptime Architecture'),
('0.4s', 'Avg. Load Time'),
('124+', 'Delivered Systems'),
('48h', 'Response Time');
