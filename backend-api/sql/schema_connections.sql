-- Initialize System Connection Settings
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES 
('api_url', 'http://127.0.0.1:8000/api'),
('app_key', 'base64:hnQYeC0tQSJHzXsj+QBAlJlo77UhA38SWo4J4SHi5v4='),
('frontend_url', 'http://localhost:3000'),
('admin_url', 'http://localhost:3001'),
('image_proxy_enabled', '1'),
('image_base_url', 'http://127.0.0.1:8000/api/dms/media'),
('db_host', '127.0.0.1'),
('db_database', 'u_codeaxe_me');
