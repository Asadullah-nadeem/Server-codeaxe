CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT NOT NULL
);

INSERT INTO site_settings (setting_key, setting_value) VALUES 
('site_logo_url', '/logo.png'),
('site_name_prefix', 'Code'),
('site_name_accent', 'Axe'),
('nav_portfolio_label', 'Portfolio'),
('nav_info_label', 'Info'),
('nav_btn_send_request', 'Send Request'),
('nav_btn_dashboard', 'Dashboard'),
('nav_btn_login', 'Login'),
('nav_btn_signup', 'Sign Up'),
('nav_btn_profile', 'Profile'),
('footer_copyright', '© 2026 CodeAxe Technologies.<br/>All rights reserved.<br/><b>Version 1.0.0</b>'),
('home_hero_btn1_label', 'View Work'),
('home_hero_btn1_link', '/work'),
('home_hero_btn2_label', 'Start Project'),
('home_hero_btn2_link', '/contact'),
('home_featured_btn_label', 'View All Projects'),
('home_featured_btn_link', '/work'),
('site_founder_name', 'Asadullah Nadeem'),
('site_founder_message', 'We don\'t just build websites; we craft digital experiences that drive growth and innovation.'),
('seo_google_analytics_id', ''),
('seo_google_search_console_id', '');
