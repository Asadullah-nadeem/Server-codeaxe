-- Portfolio Categories (controls the tab list, slugs, enable/disable)
CREATE TABLE IF NOT EXISTS portfolio_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0
);

-- Portfolio Items (each project belongs to a category)
CREATE TABLE IF NOT EXISTS portfolio_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tags JSON,
    project_year VARCHAR(10),
    image_url VARCHAR(500) DEFAULT NULL,
    project_url VARCHAR(500) DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES portfolio_categories(id) ON DELETE CASCADE
);

-- Seed: Categories
INSERT INTO portfolio_categories (slug, label, description, is_active, sort_order) VALUES
('chrome-extensions', 'Chrome Extensions', 'Browser tools engineered for productivity and automation.', 1, 1),
('web-tools', 'Web Tools', 'Online utilities and tools built for developers and businesses.', 1, 2),
('app-store', 'App Store', 'iOS applications designed for real-world performance.', 1, 3),
('play-store', 'Play Store', 'Android applications built for reliability.', 1, 4),
('client-projects', 'Client Projects', 'Delivered systems for businesses across industries.', 1, 5);

-- Seed: Chrome Extensions
INSERT INTO portfolio_items (category_id, title, description, tags, project_year, image_url, sort_order) VALUES
(1, 'TaskForge', 'Project management automation across 12 platforms with real-time sync.', '["Chrome API","React","WebSocket"]', '2024', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80', 1),
(1, 'DataSnap', 'Automated data extraction tool with configurable selectors and export formats.', '["Chrome API","TypeScript"]', '2024', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80', 2),
(1, 'TabManager Pro', 'Intelligent tab grouping and session management for power users.', '["Chrome API","IndexedDB"]', '2023', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80', 3),
(1, 'FormFiller', 'Auto-fill browser extension with encrypted credential storage and team sharing.', '["Chrome API","AES-256"]', '2023', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', 4),
(1, 'PageMonitor', 'Website change detection and alert system for competitive analysis.', '["Chrome API","Diff Engine"]', '2023', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 5),
(1, 'LinkVault', 'Bookmark manager with tagging, search, and cross-device sync.', '["Chrome API","Firebase"]', '2022', 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=800&q=80', 6),
(1, 'ScreenCapture+', 'Full-page screenshot and annotation tool with cloud storage.', '["Chrome API","Canvas API"]', '2022', 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=800&q=80', 7),
(1, 'AdBlock Custom', 'Customizable content filter with whitelist rules for enterprise use.', '["Chrome API","RegExp"]', '2022', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80', 8);

-- Seed: Web Tools
INSERT INTO portfolio_items (category_id, title, description, tags, project_year, image_url, sort_order) VALUES
(2, 'APITester', 'Browser-based API testing tool with request history and team sharing.', '["React","IndexedDB","WebWorkers"]', '2025', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 1),
(2, 'JSONForge', 'Advanced JSON editor with schema validation and diff comparison.', '["TypeScript","Monaco Editor"]', '2024', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80', 2),
(2, 'CSSGrid Builder', 'Visual CSS grid layout builder with export to production code.', '["React","CSS Grid"]', '2024', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', 3),
(2, 'ColorPalette Pro', 'AI-powered color palette generator with accessibility contrast checker.', '["React","Color Theory"]', '2024', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', 4),
(2, 'MarkdownLive', 'Real-time collaborative markdown editor with export to PDF and HTML.', '["React","WebSocket","PDF.js"]', '2023', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', 5),
(2, 'RegexPlayground', 'Interactive regex builder with visual matching and test suite generation.', '["TypeScript","RegExp"]', '2023', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80', 6),
(2, 'SVG Optimizer', 'Batch SVG optimization tool reducing file sizes by up to 60%.', '["Node.js","SVGO"]', '2023', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80', 7);

-- Seed: App Store (iOS)
INSERT INTO portfolio_items (category_id, title, description, tags, project_year, image_url, sort_order) VALUES
(3, 'FocusTimer', 'Pomodoro-based productivity app with analytics and widget support.', '["Swift","SwiftUI","CoreData"]', '2024', 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80', 1),
(3, 'ExpenseLog', 'Personal finance tracker with bank sync and receipt scanning.', '["Swift","Vision API","CloudKit"]', '2024', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', 2),
(3, 'MealPlanner', 'Nutrition tracking app with barcode scanning and weekly meal plans.', '["Swift","HealthKit"]', '2024', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80', 3),
(3, 'HabitLoop', 'Habit tracking app with streak analytics and motivational nudges.', '["SwiftUI","CoreData"]', '2023', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', 4),
(3, 'VoiceMemo Pro', 'Audio recording app with transcription and cloud backup.', '["Swift","Speech API","iCloud"]', '2023', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80', 5),
(3, 'PhotoVault', 'Private photo storage with Face ID lock and encrypted albums.', '["Swift","CryptoKit"]', '2023', 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80', 6),
(3, 'WeatherNow', 'Hyper-local weather app with radar maps and severe weather alerts.', '["SwiftUI","WeatherKit"]', '2022', 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&q=80', 7);

-- Seed: Play Store (Android)
INSERT INTO portfolio_items (category_id, title, description, tags, project_year, image_url, sort_order) VALUES
(4, 'RouteOptimizer', 'Delivery route optimization app reducing travel time by 35%.', '["Kotlin","Google Maps API"]', '2025', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80', 1),
(4, 'FieldReport', 'Offline-first field reporting app for construction teams.', '["Kotlin","Room DB","WorkManager"]', '2024', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', 2),
(4, 'InventorySync', 'Warehouse inventory management with barcode scanning and real-time sync.', '["Kotlin","ML Kit"]', '2024', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', 3),
(4, 'FleetTracker', 'Real-time vehicle tracking and driver management system.', '["Kotlin","Firebase","Maps SDK"]', '2024', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', 4),
(4, 'TaskRunner', 'Field service management app with job assignment and GPS tracking.', '["Kotlin","Jetpack Compose"]', '2023', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', 5),
(4, 'SafeCheck', 'Workplace safety inspection app with photo documentation and compliance reports.', '["Kotlin","CameraX"]', '2023', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80', 6),
(4, 'TimeSheet Pro', 'Employee time tracking with geofencing and payroll integration.', '["Kotlin","Geofencing API"]', '2023', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 7);

-- Seed: Client Projects
INSERT INTO portfolio_items (category_id, title, description, tags, project_year, image_url, sort_order) VALUES
(5, 'DataVault Platform', 'Enterprise data management handling 2M+ records with RBAC.', '["React","Node.js","PostgreSQL"]', '2025', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 1),
(5, 'SecureVault', 'E2E encrypted document management for legal firms.', '["React","AES-256","AWS S3"]', '2024', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80', 2),
(5, 'PayBridge', 'Unified payment gateway integrating Stripe, PayPal, and regional providers.', '["Node.js","Stripe API"]', '2025', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', 3),
(5, 'LogiFlow ERP', 'Custom ERP system for logistics company managing 500+ daily shipments.', '["React","PostgreSQL","Docker"]', '2024', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', 4),
(5, 'MediTrack', 'Patient management platform for healthcare clinics with HIPAA compliance.', '["React","Node.js","MongoDB"]', '2024', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80', 5),
(5, 'EduPortal', 'Online learning platform with live classes and automated grading.', '["React","WebRTC","Redis"]', '2023', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', 6),
(5, 'PropManage', 'Property management system with tenant portal and maintenance tracking.', '["React","Express","PostgreSQL"]', '2023', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', 7),
(5, 'RetailPOS', 'Cloud-based point-of-sale system with multi-location inventory sync.', '["React","Node.js","Stripe"]', '2023', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', 8);
