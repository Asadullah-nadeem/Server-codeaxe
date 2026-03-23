-- Section Visibility Table
-- Stores enable/disable state for each named frontend section.
-- Run this SQL in your database to create the table.

CREATE TABLE IF NOT EXISTS `section_visibility` (
    `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `section_key`  VARCHAR(100) NOT NULL UNIQUE COMMENT 'Unique identifier e.g. hero, services, footer',
    `is_enabled`   TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = visible on frontend, 0 = hidden',
    `custom_label` VARCHAR(200) NULL COMMENT 'Admin-facing display label',
    `custom_desc`  TEXT NULL COMMENT 'Admin-facing description/notes',
    `created_at`   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default sections (all enabled by default)
INSERT IGNORE INTO `section_visibility` (`section_key`, `is_enabled`, `custom_label`, `custom_desc`) VALUES
('hero',          1, 'Hero / Banner',       'Main landing hero banner with CTA buttons.'),
('services',      1, 'Services',            'Core services showcase cards.'),
('projects',      1, 'Featured Projects',   'Portfolio highlights on the homepage.'),
('stats',         1, 'Company Stats',       'Achievement numbers like clients, projects, etc.'),
('principles',    1, 'Principles',          'Core values and working principles.'),
('technologies',  1, 'Technologies',        'Tech stack / logos carousel.'),
('system_status', 1, 'System Status',       'Live system uptime status panel.'),
('partners',      1, 'Partners / Clients',  'Partner logo strip.'),
('cta',           1, 'Call To Action',      'Bottom CTA banner to drive conversions.'),
('about_hero',    1, 'About Hero',          'About page hero header section.'),
('about_team',    1, 'Team Members',        'Team member cards grid.'),
('portfolio',     1, 'Portfolio Grid',      'Full portfolio project grid.'),
('contact_form',  1, 'Contact Form',        'Main contact us form.'),
('navigation',    1, 'Navigation Bar',      'Top navbar shown on all pages.'),
('footer',        1, 'Footer',              'Bottom site footer shown on all pages.'),
('legal',         1, 'Legal Pages',         'Privacy, Terms, Refund policy pages.');
