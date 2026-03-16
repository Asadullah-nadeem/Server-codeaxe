-- Add image_url to work_projects
ALTER TABLE work_projects ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;

-- Add image_url to home_projects
ALTER TABLE home_projects ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;

-- Update work_projects with real images
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' WHERE title = 'DataVault Platform';
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' WHERE title = 'InvenTrack Dashboard';
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80' WHERE title = 'FlowSync API';
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80' WHERE title = 'AuthCore Engine';
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80' WHERE title = 'DeployBot';
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80' WHERE title = 'DataPipe ETL';
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80' WHERE title = 'PayBridge';
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80' WHERE title = 'TaskForge Extension';
UPDATE work_projects SET image_url = 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80' WHERE title = 'SecureVault';

-- Update home_projects with real images
UPDATE home_projects SET image_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' WHERE title = 'DataVault Platform';
UPDATE home_projects SET image_url = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80' WHERE title = 'FlowSync API';
UPDATE home_projects SET image_url = 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80' WHERE title = 'TaskForge Extension';
