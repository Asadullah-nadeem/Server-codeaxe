-- ─── Role Permissions Table ────────────────────────────────────────────────────
-- Stores per-section CRUD access overrides for 'admin' and 'demo' roles.
-- Super Admin always has full access (not stored here).
-- section_key examples: navigation, home, footer, services, portfolio, about, legal, sections, rewrites,
--                       contact, emails, smtp, chat, media, dms, registered_users, admin_accounts, superadmin

CREATE TABLE IF NOT EXISTS `role_permissions` (
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `role`        VARCHAR(20)     NOT NULL COMMENT 'admin | demo',
    `section_key` VARCHAR(100)    NOT NULL COMMENT 'Unique key matching PERMISSION_MATRIX',
    `can_view`    TINYINT(1)      NOT NULL DEFAULT 1,
    `can_create`  TINYINT(1)      NOT NULL DEFAULT 0,
    `can_edit`    TINYINT(1)      NOT NULL DEFAULT 0,
    `can_delete`  TINYINT(1)      NOT NULL DEFAULT 0,
    `created_at`  TIMESTAMP       NULL DEFAULT NULL,
    `updated_at`  TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `role_section_unique` (`role`, `section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Default seeds ─────────────────────────────────────────────────────────────
-- Admin: full CMS access, no user mgmt
INSERT INTO `role_permissions` (`role`, `section_key`, `can_view`, `can_create`, `can_edit`, `can_delete`, `created_at`, `updated_at`) VALUES
('admin', 'navigation',       1, 1, 1, 1, NOW(), NOW()),
('admin', 'home',             1, 1, 1, 1, NOW(), NOW()),
('admin', 'footer',           1, 1, 1, 1, NOW(), NOW()),
('admin', 'services',         1, 1, 1, 1, NOW(), NOW()),
('admin', 'portfolio',        1, 1, 1, 1, NOW(), NOW()),
('admin', 'about',            1, 1, 1, 1, NOW(), NOW()),
('admin', 'legal',            1, 1, 1, 1, NOW(), NOW()),
('admin', 'sections',         1, 1, 1, 1, NOW(), NOW()),
('admin', 'rewrites',         1, 1, 1, 1, NOW(), NOW()),
('admin', 'contact',          1, 0, 1, 0, NOW(), NOW()),
('admin', 'emails',           1, 1, 1, 1, NOW(), NOW()),
('admin', 'smtp',             1, 0, 1, 0, NOW(), NOW()),
('admin', 'chat',             1, 0, 1, 1, NOW(), NOW()),
('admin', 'media',            1, 1, 1, 1, NOW(), NOW()),
('admin', 'dms',              1, 1, 1, 1, NOW(), NOW()),
('admin', 'registered_users', 0, 0, 0, 0, NOW(), NOW()),
('admin', 'admin_accounts',   0, 0, 0, 0, NOW(), NOW()),
('admin', 'superadmin',       0, 0, 0, 0, NOW(), NOW()),
-- Demo: view-only on all CMS, no user mgmt
('demo',  'navigation',       1, 0, 0, 0, NOW(), NOW()),
('demo',  'home',             1, 0, 0, 0, NOW(), NOW()),
('demo',  'footer',           1, 0, 0, 0, NOW(), NOW()),
('demo',  'services',         1, 0, 0, 0, NOW(), NOW()),
('demo',  'portfolio',        1, 0, 0, 0, NOW(), NOW()),
('demo',  'about',            1, 0, 0, 0, NOW(), NOW()),
('demo',  'legal',            1, 0, 0, 0, NOW(), NOW()),
('demo',  'sections',         1, 0, 0, 0, NOW(), NOW()),
('demo',  'rewrites',         1, 0, 0, 0, NOW(), NOW()),
('demo',  'contact',          1, 0, 0, 0, NOW(), NOW()),
('demo',  'emails',           1, 0, 0, 0, NOW(), NOW()),
('demo',  'smtp',             1, 0, 0, 0, NOW(), NOW()),
('demo',  'chat',             1, 0, 0, 0, NOW(), NOW()),
('demo',  'media',            1, 0, 0, 0, NOW(), NOW()),
('demo',  'dms',              1, 0, 0, 0, NOW(), NOW()),
('demo',  'registered_users', 0, 0, 0, 0, NOW(), NOW()),
('demo',  'admin_accounts',   0, 0, 0, 0, NOW(), NOW()),
('demo',  'superadmin',       0, 0, 0, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = `updated_at`;
