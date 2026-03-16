CREATE TABLE IF NOT EXISTS home_system_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    ping VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    src VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_hero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    badge VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO nav_links (type, label, path) VALUES 
('main', 'Home', '/'),
('main', 'Work', '/work'),
('main', 'Services', '/services');

INSERT INTO home_system_status (label, status, ping) VALUES 
('API Gateway', 'Operational', '12ms'),
('Database Cluster', 'Operational', '4ms'),
('CDN Edge Nodes', 'Operational', '8ms'),
('Auth Service', 'Operational', '6ms'),
('Build Pipeline', 'Operational', '22ms');

INSERT INTO home_partners (name, src) VALUES 
('Google', 'googleLogo'),
('Facebook', 'facebookLogo'),
('Amazon', 'amazonLogo'),
('Microsoft', 'microsoftLogo'),
('Apple', 'appleLogo'),
('Slack', 'slackLogo'),
('Spotify', 'spotifyLogo'),
('Netflix', 'netflixLogo');

INSERT INTO home_hero (badge, title, description) VALUES 
('Custom Software I Build for You', 'We build software that scales before you do.', 'At Codeaxe Technologies, I build reliable software for companies that need high-availability systems, custom browser tools, and automated infrastructure. No fluff. Just engineering.');
