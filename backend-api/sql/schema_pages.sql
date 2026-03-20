-- ── About Page ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_index VARCHAR(10) NOT NULL DEFAULT '00',
    label VARCHAR(100) NOT NULL DEFAULT 'ABOUT',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cta_label VARCHAR(100),
    cta_link VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS about_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0
);

-- ── Legal Pages ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL UNIQUE,   -- 'privacy', 'terms', 'refund-cancellation', 'refund-policy'
    label VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    last_updated VARCHAR(100) DEFAULT 'March 2026',
    is_active TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS legal_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    heading VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (page_id) REFERENCES legal_pages(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────────────────────
-- SEED DATA
-- ────────────────────────────────────────────────────────────────────────────

-- About page header
INSERT INTO about_page (section_index, label, title, description, cta_label, cta_link, is_active) VALUES
('00', 'ABOUT', 'Code as Infrastructure', 'We treat software not as a creative expression, but as a reliable utility. If it doesn\'t scale, it doesn\'t ship.', 'Work With Us', '/contact', 1);

-- About sections
INSERT INTO about_sections (title, content, is_active, sort_order) VALUES
('Our Mission', 'To build reliable digital systems that companies can depend on. Every line of code we write is designed for production, every architecture decision is made for longevity.', 1, 1),
('Development Philosophy', 'We follow engineering-first principles: type safety, automated testing, infrastructure as code, and continuous deployment. Our systems are built to handle failure gracefully.', 1, 2),
('Technology Expertise', 'React, TypeScript, Node.js, Go, PostgreSQL, Redis, Docker, Kubernetes, AWS, and GCP. We choose the right tool for the problem, not the trendiest framework.', 1, 3),
('Quality Commitment', 'Every project includes comprehensive documentation, automated CI/CD pipelines, monitoring dashboards, and a handoff process designed for long-term maintainability.', 1, 4);

-- Legal pages
INSERT INTO legal_pages (page_type, label, title, last_updated, is_active) VALUES
('privacy', 'PRIVACY', 'Privacy Policy', 'March 2026', 1),
('terms', 'TERMS', 'Terms of Service', 'March 2026', 1),
('refund-cancellation', 'CANCELLATION', 'Refund & Cancellation', 'March 2026', 1),
('refund-policy', 'REFUNDS', 'Refund Policy', 'March 2026', 1);

-- Privacy Policy sections
INSERT INTO legal_sections (page_id, heading, content, is_active, sort_order) VALUES
(1, 'Data Collection', 'We collect only the information necessary to provide our services — your name, email, company name, and project details submitted through our contact form. We do not use tracking cookies or third-party analytics that compromise your privacy.', 1, 1),
(1, 'Data Usage', 'Your information is used exclusively to communicate about your project inquiry, provide services you\'ve requested, and send relevant project updates. We never sell, rent, or share your data with third parties for marketing purposes.', 1, 2),
(1, 'Data Protection', 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Access to personal data is restricted to authorized team members on a need-to-know basis.', 1, 3),
(1, 'Your Rights', 'You have the right to access, correct, or delete your personal data at any time. Contact us at hello@codeaxe.co.in to exercise these rights. We respond to all data requests within 30 days.', 1, 4);

-- Terms of Service sections
INSERT INTO legal_sections (page_id, heading, content, is_active, sort_order) VALUES
(2, 'Service Agreement', 'By engaging CodeAxe for development services, you agree to the terms outlined in your project contract including scope, timeline, and payment schedule. All custom development work is governed by individual project agreements.', 1, 1),
(2, 'Intellectual Property', 'Upon full payment, all custom code, designs, and deliverables created for your project become your intellectual property. CodeAxe retains the right to use general techniques and methodologies developed during the engagement.', 1, 2),
(2, 'Confidentiality', 'We treat all client information, business logic, and proprietary data as strictly confidential. NDAs are available upon request and are standard for enterprise engagements.', 1, 3),
(2, 'Liability', 'CodeAxe\'s liability is limited to the total amount paid for services. We are not liable for indirect, incidental, or consequential damages arising from the use of delivered software.', 1, 4);

-- Refund & Cancellation sections
INSERT INTO legal_sections (page_id, heading, content, is_active, sort_order) VALUES
(3, 'Project Cancellation', 'Either party may terminate a project with 14 days written notice. Upon cancellation, you will be billed for all completed work and any work-in-progress up to the cancellation date.', 1, 1),
(3, 'Milestone-Based Billing', 'Projects are billed at defined milestones. Cancellation between milestones requires payment for the current milestone\'s completed work, calculated on a pro-rata basis.', 1, 2),
(3, 'Transition Support', 'Upon cancellation, we provide full code handoff, documentation, and up to 5 hours of knowledge transfer to ensure a smooth transition to your new development team.', 1, 3);

-- Refund Policy sections
INSERT INTO legal_sections (page_id, heading, content, is_active, sort_order) VALUES
(4, 'Eligibility', 'Refunds are available for work that does not meet the agreed-upon specifications outlined in your project contract. Claims must be submitted within 14 days of deliverable handoff.', 1, 1),
(4, 'Process', 'Submit refund requests to hello@codeaxe.co.in with your project details and a description of the discrepancy. We review all requests within 7 business days and work to resolve issues before processing refunds.', 1, 2),
(4, 'Scope', 'Refunds apply to the specific deliverable in question, not the entire project. If a deliverable requires revisions to meet specifications, we will complete those revisions at no additional cost before considering a refund.', 1, 3);
