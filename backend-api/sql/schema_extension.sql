CREATE TABLE IF NOT EXISTS home_principles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_technologies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    src VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO home_principles (title, description, icon) VALUES 
('Clean Architecture', 'Modular, maintainable codebases that scale with your team.', 'Zap'),
('Secure Backend', 'Defense-in-depth security with encrypted data at rest and in transit.', 'Shield'),
('Reliable Systems', '99.9% uptime architecture with automated failover and monitoring.', 'Lock'),
('Professional Delivery', 'On-time delivery with clear communication and documentation.', 'CheckCircle');

INSERT INTO home_technologies (name, src) VALUES 
('React', 'reactLogo'),
('Node.js', 'nodejsLogo'),
('TypeScript', 'typescriptLogo'),
('Python', 'pythonLogo'),
('Docker', 'dockerLogo'),
('PostgreSQL', 'postgresqlLogo'),
('AWS', 'awsLogo'),
('Firebase', 'firebaseLogo');
