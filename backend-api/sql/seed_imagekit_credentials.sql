-- Seed ImageKit credentials into dms_provider_keys
-- Run this on your u_codeaxe_me database

INSERT INTO dms_provider_keys (provider, key_name, key_value) VALUES 
('imagekit', 'public_key', 'public_a9Ty/zIzHt+W28+NbSkllg+jprI='),
('imagekit', 'private_key', 'private_Ja5cRp6Z2Gy4Qw7kMT0NjKS2wW4='),
('imagekit', 'url_endpoint', 'https://ik.imagekit.io/data-dms-api/')
ON DUPLICATE KEY UPDATE key_value = VALUES(key_value);
