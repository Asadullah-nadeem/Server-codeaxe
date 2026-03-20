-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) DEFAULT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',        -- 'new', 'read', 'replied'
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email template (thank-you letter) — editable from admin
CREATE TABLE IF NOT EXISTS email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) NOT NULL UNIQUE,    -- 'thank_you_contact'
    subject VARCHAR(255) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    footer_text VARCHAR(500),
    brand_color VARCHAR(20) DEFAULT '#0a0a0a',    -- editable hex color
    accent_color VARCHAR(20) DEFAULT '#3b82f6',   -- editable accent
    logo_url VARCHAR(500) DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Page Settings
CREATE TABLE IF NOT EXISTS contact_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_index VARCHAR(10) NOT NULL DEFAULT '00',
    label VARCHAR(100) NOT NULL DEFAULT 'CONTACT',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1
);

-- Contact Page Direct Info
CREATE TABLE IF NOT EXISTS contact_direct_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    href VARCHAR(255) DEFAULT '#',
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0
);

-- Contact Page Response Times
CREATE TABLE IF NOT EXISTS contact_response_times (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0
);

-- Seed default thank-you template
INSERT INTO email_templates (template_key, subject, headline, body_html, footer_text, brand_color, accent_color) VALUES
(
  'thank_you_contact',
  'We received your message — CodeAxe',
  'Thank you for reaching out.',
  '<p>Hi {{name}},</p>
<p>We''ve received your project inquiry and our team will review your message carefully.</p>
<p>We typically respond within <strong>48 hours</strong> on business days. In the meantime, feel free to explore our work at <a href="https://codeaxe.co.in/work">codeaxe.co.in/work</a>.</p>
<p>Here''s a summary of what you sent us:</p>
<ul>
  <li><strong>Name:</strong> {{name}}</li>
  <li><strong>Email:</strong> {{email}}</li>
  <li><strong>Company:</strong> {{company}}</li>
  <li><strong>Project:</strong> {{message}}</li>
</ul>
<p>Looking forward to working with you.</p>
<p>— The CodeAxe Team</p>',
  '© 2026 CodeAxe Technologies. All rights reserved.',
  '#0a0a0a',
  '#2563eb'
);

-- Seed default page headers
INSERT INTO contact_page (section_index, label, title, description, is_active) VALUES
('00', 'CONTACT', 'Start a Project', 'Tell us about your requirements. We respond within 48 hours.', 1);

-- Seed direct info
INSERT INTO contact_direct_info (icon, label, href, is_active, sort_order) VALUES
('Mail', 'hello@codeaxe.co.in', 'mailto:hello@codeaxe.co.in', 1, 1),
('Github', 'github.com/codeaxe', 'https://github.com/codeaxe', 1, 2),
('Linkedin', 'LinkedIn / CodeAxe', 'https://linkedin.com/company/codeaxe', 1, 3),
('MapPin', 'Remote — Worldwide', '#', 1, 4);

-- Seed response times
INSERT INTO contact_response_times (label, value, is_active, sort_order) VALUES
('Initial Reply', '< 48 hours', 1, 1),
('Project Estimate', '3–5 business days', 1, 2),
('Start Date', 'Based on availability', 1, 3);
