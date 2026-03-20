-- Custom Auth Schema
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    api_token VARCHAR(255) UNIQUE DEFAULT NULL,
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL UNIQUE, -- 'login' or 'signup' or 'forgot_password' or 'reset_password'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    button_text VARCHAR(100) NOT NULL,
    is_active TINYINT(1) DEFAULT 1
);

INSERT INTO auth_pages (page_type, title, description, button_text) VALUES
('login', 'Welcome Back', 'Log in to your CodeAxe account to access your dashboard.', 'Log In'),
('signup', 'Create an Account', 'Join CodeAxe to manage your projects, invoices, and communication all in one place.', 'Sign Up'),
('forgot_password', 'Forgot Password', 'Enter your email address to receive a secure password reset link.', 'Send Reset Link'),
('reset_password', 'Reset Password', 'Create a fast, secure, and memorable new password.', 'Reset Password');

-- We assume email_templates table was created in schema_contact.sql, which runs before this.
INSERT INTO email_templates (template_key, subject, headline, body_html, footer_text, brand_color, accent_color) VALUES
(
  'email_verification',
  'Verify your email — CodeAxe',
  'Welcome to CodeAxe.',
  '<p>Hi {{username}},</p>
<p>Thanks for creating an account with us. Please verify your email address to get started.</p>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{verification_link}}" style="display:inline-block;background:{{accent_color}};color:#ffffff;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;letter-spacing:0.05em;border-radius:4px;">Verify Email</a>
</p>
<p>If the button doesn''t work, copy and paste this link into your browser:</p>
<p><a href="{{verification_link}}">{{verification_link}}</a></p>
<p>— The CodeAxe Team</p>',
  '© 2026 CodeAxe Technologies. All rights reserved.',
  '#0a0a0a',
  '#3b82f6'
),
(
  'password_reset',
  'Reset your password — CodeAxe',
  'Password Reset Request.',
  '<p>Hi {{username}},</p>
<p>We received a request to reset your password. Click the button below to set a new one. If you did not make this request, please ignore this email.</p>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{reset_link}}" style="display:inline-block;background:{{accent_color}};color:#ffffff;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;letter-spacing:0.05em;border-radius:4px;">Reset Password</a>
</p>
<p>If the button doesn''t work, copy and paste this link into your browser:</p>
<p><a href="{{reset_link}}">{{reset_link}}</a></p>
<p>— The CodeAxe Team</p>',
  '© 2026 CodeAxe Technologies. All rights reserved.',
  '#0a0a0a',
  '#ef4444'
);
