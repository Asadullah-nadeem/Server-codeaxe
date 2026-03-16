CREATE TABLE IF NOT EXISTS work_section_header (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_index VARCHAR(10) NOT NULL,
    label VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS work_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS work_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tags JSON,
    project_year VARCHAR(10),
    image_url VARCHAR(500) DEFAULT NULL,
    project_url VARCHAR(500) DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES work_categories(id) ON DELETE CASCADE
);

INSERT INTO work_section_header (section_index, label, title, description) VALUES
('00', 'ALL WORK', 'Projects & Systems', 'A selection of systems engineered for performance, reliability, and scale.');

INSERT INTO work_categories (id, label, sort_order) VALUES
(1, 'WEB PLATFORMS', 1),
(2, 'BACKEND SYSTEMS', 2),
(3, 'AUTOMATION TOOLS', 3),
(4, 'API INTEGRATIONS', 4),
(5, 'SOFTWARE SOLUTIONS', 5);

INSERT INTO work_projects (category_id, title, description, tags, project_year, image_url, project_url) VALUES
(1, 'DataVault Platform', 'Enterprise data management system with real-time sync and RBAC for 2M+ records.', '["React", "Node.js", "PostgreSQL"]', '2025', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 'https://github.com/codeaxe'),
(1, 'InvenTrack Dashboard', 'Real-time inventory management platform for multi-warehouse logistics operations.', '["Next.js", "GraphQL", "Redis"]', '2024', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 'https://github.com/codeaxe'),
(2, 'FlowSync API', 'High-throughput API gateway processing 50K req/min with automatic failover.', '["TypeScript", "Redis", "Docker"]', '2025', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 'https://github.com/codeaxe'),
(2, 'AuthCore Engine', 'Multi-tenant authentication service with OAuth2, SAML, and MFA support.', '["Go", "PostgreSQL", "JWT"]', '2024', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', 'https://github.com/codeaxe'),
(3, 'DeployBot', 'CI/CD automation tool reducing deployment time by 80% across 15 microservices.', '["GitHub Actions", "Docker", "Bash"]', '2025', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80', 'https://github.com/codeaxe'),
(3, 'DataPipe ETL', 'Automated data pipeline processing 10GB daily across 8 data sources.', '["Python", "Airflow", "BigQuery"]', '2024', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80', 'https://github.com/codeaxe'),
(4, 'PayBridge', 'Unified payment gateway integrating Stripe, PayPal, and regional providers.', '["Node.js", "Stripe API", "Webhooks"]', '2025', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', 'https://github.com/codeaxe'),
(5, 'TaskForge Extension', 'Chrome extension automating project management across 12 platforms.', '["Chrome API", "React", "WebSocket"]', '2024', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80', 'https://github.com/codeaxe'),
(5, 'SecureVault', 'End-to-end encrypted document management system for legal firms.', '["React", "AES-256", "AWS S3"]', '2024', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80', 'https://github.com/codeaxe');
