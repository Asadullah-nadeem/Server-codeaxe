CREATE TABLE IF NOT EXISTS services_page_header (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_index VARCHAR(10) NOT NULL,
    label VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS services_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sort_index VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    points JSON,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services_cta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    heading VARCHAR(255) NOT NULL,
    button_label VARCHAR(100) NOT NULL,
    button_link VARCHAR(255) NOT NULL
);

INSERT INTO services_page_header (section_index, label, title, description) VALUES
('00', 'SERVICES', 'What We Build', 'Full-stack engineering services from architecture to deployment.');

INSERT INTO services_list (sort_index, title, description, points, sort_order) VALUES
('01', 'Web Development', 'Custom websites, platforms, dashboards, and business tools. We build with React, Next.js, and modern frameworks that scale from MVP to enterprise.', '["Single Page Applications", "Admin Dashboards", "E-commerce Platforms", "SaaS Products"]', 1),
('02', 'Software Development', 'Custom internal tools and software systems tailored to your business processes. Built for reliability, maintainability, and long-term scalability.', '["Internal Business Tools", "Workflow Automation", "Data Management Systems", "Custom CRM/ERP"]', 2),
('03', 'API Development', 'Secure, scalable backend APIs with type-safe contracts, comprehensive documentation, and thorough testing. Designed for high-throughput environments.', '["RESTful APIs", "GraphQL Endpoints", "Webhook Systems", "API Gateway Design"]', 3),
('04', 'Chrome Extensions', 'Browser extensions that automate repetitive tasks, integrate with existing tools, and improve team productivity across the organization.', '["Productivity Tools", "Data Scrapers", "Platform Integrations", "Content Automation"]', 4),
('05', 'Mobile Applications', 'Android and iOS applications designed for real-world use. Focused on performance, native UX patterns, and reliable offline support.', '["Cross-Platform Apps", "Native iOS/Android", "Offline-First Design", "Push Notifications"]', 5),
('06', 'System Integration', 'Connecting APIs, services, and databases to create automated systems that eliminate manual processes and reduce operational overhead.', '["API-First Architecture", "Database Migrations", "Third-Party Integrations", "Modular Integration"]', 6);

INSERT INTO services_cta (heading, button_label, button_link) VALUES
('Have a project in mind?', 'Start Project', '/contact');
