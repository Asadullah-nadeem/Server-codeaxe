-- Add project_url to work_projects
ALTER TABLE work_projects ADD COLUMN project_url VARCHAR(500) DEFAULT NULL;

-- Add project_url to home_projects  
ALTER TABLE home_projects ADD COLUMN project_url VARCHAR(500) DEFAULT NULL;

-- Update work_projects with demo URLs
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'DataVault Platform';
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'InvenTrack Dashboard';
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'FlowSync API';
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'AuthCore Engine';
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'DeployBot';
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'DataPipe ETL';
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'PayBridge';
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'TaskForge Extension';
UPDATE work_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'SecureVault';

-- Update home_projects with demo URLs
UPDATE home_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'DataVault Platform';
UPDATE home_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'FlowSync API';
UPDATE home_projects SET project_url = 'https://github.com/codeaxe' WHERE title = 'TaskForge Extension';
