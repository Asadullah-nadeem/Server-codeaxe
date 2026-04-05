-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2026 at 09:31 PM
-- Server version: 8.0.45-0ubuntu0.22.04.1
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u_codeaxe_me`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_page`
--

CREATE TABLE `about_page` (
  `id` int NOT NULL,
  `section_index` varchar(10) NOT NULL DEFAULT '00',
  `label` varchar(100) NOT NULL DEFAULT 'ABOUT',
  `title` varchar(255) NOT NULL,
  `description` text,
  `cta_label` varchar(100) DEFAULT NULL,
  `cta_link` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `about_page`
--

INSERT INTO `about_page` (`id`, `section_index`, `label`, `title`, `description`, `cta_label`, `cta_link`, `is_active`) VALUES
(1, '00', 'ABOUT', 'Code as Infrastructure', 'We treat software not as a creative expression, but as a reliable utility. If it doesn\'t scale, it doesn\'t ship.', 'Work With Us', '/contact', 1);

-- --------------------------------------------------------

--
-- Table structure for table `about_sections`
--

CREATE TABLE `about_sections` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `about_sections`
--

INSERT INTO `about_sections` (`id`, `title`, `content`, `is_active`, `sort_order`) VALUES
(1, 'Our Mission', 'To build reliable digital systems that companies can depend on. Every line of code we write is designed for production, every architecture decision is made for longevity.', 1, 1),
(2, 'Development Philosophy', 'We follow engineering-first principles: type safety, automated testing, infrastructure as code, and continuous deployment. Our systems are built to handle failure gracefully.', 1, 2),
(3, 'Technology Expertise', 'React, TypeScript, Node.js, Go, PostgreSQL, Redis, Docker, Kubernetes, AWS, and GCP. We choose the right tool for the problem, not the trendiest framework.', 1, 3),
(4, 'Quality Commitment', 'Every project includes comprehensive documentation, automated CI/CD pipelines, monitoring dashboards, and a handoff process designed for long-term maintainability.', 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `login_type` varchar(50) DEFAULT 'password',
  `role` enum('superadmin','admin','demo') DEFAULT 'admin',
  `api_token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `username`, `email`, `password`, `login_type`, `role`, `api_token`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'superadmin', 'superadmin@codeaxe.com', '$2y$10$Qb1vwI5E0emFVb7l6f7YE.EakuS5OW6CugVykjAslQkU4mNA4kGiW', 'password', 'superadmin', 'yNINuDEd6J7QUYWjFj0nd4UVdQw6KXipqJqfefOnfDeVYysLnFn9I78OEUAbiilj8X7TqfKfopxWtgus', 1, '2026-03-20 02:29:47', '2026-04-05 08:12:53'),
(3, 'superdemo', 'superdemo', 'superdemo@superdemo.superdemo', '$2y$12$P6OCI7e2jVJ/Ddb9uD.Lr./rV5d29HS.3dSsvBiCr6z71Nrcwnp1a', 'password', 'demo', 'PeSFu4K2qPl3p7Pli633vccIX90JfLKqGe9OpIeMHgE0Pbb1f7nEmFCpuUsWEeoUwFmOWmRyGQR3pU7m', 0, '2026-03-22 19:39:29', '2026-03-22 19:46:16'),
(4, 'test1', 'test1', 'test1@gmail.com', '$2y$12$RSJsBqdDYHj2vAddWlvkAuotN/CXmihfgIx1AMGaRy.R/zNznYA.K', 'password', 'admin', 'UBSPzljLmkvXqvw7onEOGIcrIskcaRISpUjC8Q2gW8vaV0WMmuRCMfgZz9ftbGpviKFnjOSTiSh5cJ5K', 1, '2026-03-22 22:16:11', '2026-03-22 22:16:39');

-- --------------------------------------------------------

--
-- Table structure for table `admin_roles`
--

CREATE TABLE `admin_roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'primary',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_roles`
--

INSERT INTO `admin_roles` (`id`, `name`, `label`, `color`, `description`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', 'Super Admin', 'danger', 'Full access', '2026-03-26 06:32:56', '2026-03-26 06:32:56'),
(2, 'admin', 'Admin', 'primary', 'CMS access', '2026-03-26 06:32:56', '2026-03-26 06:32:56'),
(3, 'demo', 'Demo Mode', 'warning', 'Read-only', '2026-03-26 06:32:56', '2026-03-26 06:32:56'),
(4, 'admin-v1', 'Admin V1', 'secondary', NULL, '2026-04-05 05:54:13', '2026-04-05 05:54:13');

-- --------------------------------------------------------

--
-- Table structure for table `auth_pages`
--

CREATE TABLE `auth_pages` (
  `id` int NOT NULL,
  `page_type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `button_text` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `auth_pages`
--

INSERT INTO `auth_pages` (`id`, `page_type`, `title`, `description`, `button_text`, `is_active`) VALUES
(1, 'login', 'Welcome Back', 'Log in to your CodeAxe account to access your dashboard.', 'Log In', 1),
(2, 'signup', 'Create an Account', 'Join CodeAxe to manage your projects, invoices, and communication all in one place.', 'Sign Up', 1),
(3, 'forgot_password', 'Forgot Password', 'Enter your email address to receive a secure password reset link.', 'Send Reset Link', 1),
(4, 'reset_password', 'Reset Password', 'Create a fast, secure, and memorable new password.', 'Reset Password', 1);

-- --------------------------------------------------------

--
-- Table structure for table `client_messages`
--

CREATE TABLE `client_messages` (
  `id` int NOT NULL,
  `request_id` int NOT NULL,
  `sender_type` enum('user','admin') NOT NULL,
  `sender_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `client_messages`
--

INSERT INTO `client_messages` (`id`, `request_id`, `sender_type`, `sender_id`, `message`, `is_read`, `created_at`) VALUES
(5, 2, 'user', 2, 'das', 1, '2026-03-21 13:15:41'),
(11, 1, 'user', 1, 'hh', 1, '2026-03-22 19:21:18'),
(12, 1, 'admin', 1, 'jkhdsakh asjjk\'asdi as klsaljk sakl asjk', 1, '2026-03-22 19:21:37');

-- --------------------------------------------------------

--
-- Table structure for table `client_requests`
--

CREATE TABLE `client_requests` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `service_type` varchar(100) NOT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `client_requests`
--

INSERT INTO `client_requests` (`id`, `user_id`, `title`, `service_type`, `budget`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'simple app need it', 'Web Development', '< $5k', 'I will providing it some time after', 'resolved', '2026-03-21 10:55:21', '2026-03-22 19:31:02'),
(2, 2, 'd', 'Web Development', '< $5k', 'asd', 'pending', '2026-03-21 13:15:27', '2026-04-05 06:14:48');

-- --------------------------------------------------------

--
-- Table structure for table `contact_direct_info`
--

CREATE TABLE `contact_direct_info` (
  `id` int NOT NULL,
  `icon` varchar(50) NOT NULL,
  `label` varchar(255) NOT NULL,
  `href` varchar(255) DEFAULT '#',
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_direct_info`
--

INSERT INTO `contact_direct_info` (`id`, `icon`, `label`, `href`, `is_active`, `sort_order`) VALUES
(1, 'Mail', 'hello@codeaxe.co.in', 'mailto:hello@codeaxe.co.in', 1, 1),
(2, 'Github', 'github.com/codeaxe', 'https://github.com/codeaxe', 1, 2),
(3, 'Linkedin', 'LinkedIn / CodeAxe', 'https://linkedin.com/company/codeaxe', 1, 3),
(4, 'MapPin', 'Remote — Worldwide', '#', 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `contact_page`
--

CREATE TABLE `contact_page` (
  `id` int NOT NULL,
  `section_index` varchar(10) NOT NULL DEFAULT '00',
  `label` varchar(100) NOT NULL DEFAULT 'CONTACT',
  `title` varchar(255) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_page`
--

INSERT INTO `contact_page` (`id`, `section_index`, `label`, `title`, `description`, `is_active`) VALUES
(1, '00', 'CONTACT', 'Start a Project', 'Tell us about your requirements. We respond within 48 hours.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `contact_response_times`
--

CREATE TABLE `contact_response_times` (
  `id` int NOT NULL,
  `label` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_response_times`
--

INSERT INTO `contact_response_times` (`id`, `label`, `value`, `is_active`, `sort_order`) VALUES
(1, 'Initial Reply', '< 48 hours', 1, 1),
(2, 'Project Estimate', '3–5 business days', 1, 2),
(3, 'Start Date', 'Based on availability', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

CREATE TABLE `contact_submissions` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(50) DEFAULT 'new',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_ui`
--

CREATE TABLE `dashboard_ui` (
  `id` int NOT NULL,
  `page_key` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dashboard_ui`
--

INSERT INTO `dashboard_ui` (`id`, `page_key`, `title`, `subtitle`) VALUES
(1, 'dashboard', 'Client Dashboard', 'Manage your requests, track progress, and collaborate with our team.'),
(2, 'send-request', 'Start a New Project', 'Submit a detailed request for your next digital product or service.');

-- --------------------------------------------------------

--
-- Table structure for table `dms_api_keys`
--

CREATE TABLE `dms_api_keys` (
  `id` int NOT NULL,
  `label` varchar(100) NOT NULL,
  `api_key` varchar(128) NOT NULL,
  `api_scope` varchar(20) DEFAULT 'upload',
  `provider` varchar(20) DEFAULT 's3',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dms_api_keys`
--

INSERT INTO `dms_api_keys` (`id`, `label`, `api_key`, `api_scope`, `provider`, `is_active`, `created_at`) VALUES
(1, 'Default Admin Key', 'dms_admin_codeaxe_2026_CHANGE_ME_NOW', 'admin', 's3', 0, '2026-03-20 02:29:46'),
(2, 'Default Upload Key', 'dms_upload_codeaxe_2026_CHANGE_ME_NOW', 'upload', 's3', 0, '2026-03-20 02:29:46'),
(3, 'upload', 'dms_Qz4S2ZZJ39C5EeCANmfA3qKpYzwKkAQfWBCuSItE7YmKTAWv', 'admin', 's3', 0, '2026-03-20 03:27:58'),
(4, 'Android App', 'dms_5fdoBWug8SOWy6XCVbKJ0T8HHBkBqEpkzRjNA20UYnXMMw3Z', 'upload', 's3', 0, '2026-03-20 03:41:23'),
(5, 'upload', 'dms_vxw6TrBdt68WjgqPWe3EUGeNKXxgRkWFumX5XyUdqidKOHFh', 'admin', 's3', 0, '2026-03-20 03:46:56'),
(6, 'X-DMS-Key', 'dms_OyeqtcT3AmDSEq3OX3LT7rOLb82XfP604QdkwMOOlkO5uQpd', 'upload', 's3', 0, '2026-03-20 03:50:49');

-- --------------------------------------------------------

--
-- Table structure for table `dms_provider_keys`
--

CREATE TABLE `dms_provider_keys` (
  `id` int NOT NULL,
  `provider` varchar(50) NOT NULL,
  `key_name` varchar(100) NOT NULL,
  `key_value` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` int NOT NULL,
  `template_key` varchar(100) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `headline` varchar(255) NOT NULL,
  `body_html` text NOT NULL,
  `footer_text` varchar(500) DEFAULT NULL,
  `brand_color` varchar(20) DEFAULT '#0a0a0a',
  `accent_color` varchar(20) DEFAULT '#3b82f6',
  `logo_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `email_templates`
--

INSERT INTO `email_templates` (`id`, `template_key`, `subject`, `headline`, `body_html`, `footer_text`, `brand_color`, `accent_color`, `logo_url`, `is_active`, `updated_at`) VALUES
(1, 'thank_you_contact', 'We received your message — CodeAxe', 'Thank you for reaching out.', '<p>Hi {{name}},</p>\n<p>We\'ve received your project inquiry and our team will review your message carefully.</p>\n<p>We typically respond within <strong>48 hours</strong> on business days. In the meantime, feel free to explore our work at <a href=\"https://codeaxe.co.in/work\">codeaxe.co.in/work</a>.</p>\n<p>Here\'s a summary of what you sent us:</p>\n<ul>\n  <li><strong>Name:</strong> {{name}}</li>\n  <li><strong>Email:</strong> {{email}}</li>\n  <li><strong>Company:</strong> {{company}}</li>\n  <li><strong>Project:</strong> {{message}}</li>\n</ul>\n<p>Looking forward to working with you.</p>\n<p>— The CodeAxe Team</p>', '© 2026 CodeAxe Technologies. All rights reserved.', '#0a0a0a', '#2563eb', NULL, 1, '2026-03-20 02:29:45'),
(2, 'email_verification', 'Verify your email — CodeAxe', 'Welcome to CodeAxe.', '<p>Hi {{username}},</p>\n<p>Thanks for creating an account with us. Please verify your email address to get started.</p>\n<p style=\"text-align: center; margin: 30px 0;\">\n  <a href=\"{{verification_link}}\" style=\"display:inline-block;background:{{accent_color}};color:#ffffff;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;letter-spacing:0.05em;border-radius:4px;\">Verify Email</a>\n</p>\n<p>If the button doesn\'t work, copy and paste this link into your browser:</p>\n<p><a href=\"{{verification_link}}\">{{verification_link}}</a></p>\n<p>— The CodeAxe Team</p>', '© 2026 CodeAxe Technologies. All rights reserved.', '#0a0a0a', '#3b82f6', NULL, 1, '2026-03-20 02:29:46'),
(3, 'password_reset', 'Reset your password — CodeAxe', 'Password Reset Request.', '<p>Hi {{username}},</p>\n<p>We received a request to reset your password. Click the button below to set a new one. If you did not make this request, please ignore this email.</p>\n<p style=\"text-align: center; margin: 30px 0;\">\n  <a href=\"{{reset_link}}\" style=\"display:inline-block;background:{{accent_color}};color:#ffffff;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;letter-spacing:0.05em;border-radius:4px;\">Reset Password</a>\n</p>\n<p>If the button doesn\'t work, copy and paste this link into your browser:</p>\n<p><a href=\"{{reset_link}}\">{{reset_link}}</a></p>\n<p>— The CodeAxe Team</p>', '© 2026 CodeAxe Technologies. All rights reserved.', '#0a0a0a', '#ef4444', NULL, 1, '2026-03-20 02:29:46');

-- --------------------------------------------------------

--
-- Table structure for table `email_template_sections`
--

CREATE TABLE `email_template_sections` (
  `id` int NOT NULL,
  `template_id` int NOT NULL,
  `section_name` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `footer_links`
--

CREATE TABLE `footer_links` (
  `id` int NOT NULL,
  `section_id` int NOT NULL,
  `label` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `is_external` tinyint(1) DEFAULT '0',
  `icon` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `footer_links`
--

INSERT INTO `footer_links` (`id`, `section_id`, `label`, `url`, `is_external`, `icon`, `created_at`, `updated_at`) VALUES
(1, 1, 'Home', '/', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(2, 1, 'Work', '/work', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(3, 1, 'Services', '/services', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(4, 1, 'About', '/about', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(5, 2, 'Chrome Extensions', '/portfolio/chrome-extensions', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(6, 2, 'Web Tools', '/portfolio/web-tools', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(7, 2, 'Mobile Apps', '/portfolio/app-store', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(8, 2, 'Client Projects', '/portfolio/client-projects', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(9, 3, 'Privacy Policy', '/privacy', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(10, 3, 'Terms of Service', '/terms', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(11, 3, 'Refund Policy', '/refund-policy', 0, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(13, 4, 'GitHub', 'https://github.com/codeaxe', 1, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(14, 4, 'LinkedIn', 'https://linkedin.com/company/codeaxe', 1, NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `footer_sections`
--

CREATE TABLE `footer_sections` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `footer_sections`
--

INSERT INTO `footer_sections` (`id`, `title`, `type`, `created_at`, `updated_at`) VALUES
(1, 'Company', 'company', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(2, 'Portfolio', 'portfolio', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(3, 'Legal', 'legal', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(4, 'Contact', 'contact', '2026-03-20 02:29:42', '2026-03-20 02:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `home_cta`
--

CREATE TABLE `home_cta` (
  `id` int NOT NULL,
  `badge` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `button_label` varchar(255) NOT NULL,
  `button_link` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_cta`
--

INSERT INTO `home_cta` (`id`, `badge`, `title`, `description`, `button_label`, `button_link`, `created_at`, `updated_at`) VALUES
(1, 'Ready to build?', 'Let\'s engineer your next system.', 'From architecture to deployment — we handle the full stack.', 'Start Your Project', '/contact', '2026-03-20 02:29:43', '2026-03-20 02:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `home_hero`
--

CREATE TABLE `home_hero` (
  `id` int NOT NULL,
  `badge` varchar(255) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_hero`
--

INSERT INTO `home_hero` (`id`, `badge`, `title`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Custom Software I Build for You', 'We build software that scales before you do.', 'At Codeaxe Technologies, I build reliable software for companies that need high-availability systems, custom browser tools, and automated infrastructure. No fluff. Just engineering.', '2026-03-20 02:29:43', '2026-03-20 02:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `home_partners`
--

CREATE TABLE `home_partners` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `src` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_partners`
--

INSERT INTO `home_partners` (`id`, `name`, `src`, `created_at`, `updated_at`) VALUES
(1, 'Google', 'googleLogo', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(2, 'Facebook', 'facebookLogo', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(3, 'Amazon', 'amazonLogo', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(4, 'Microsoft', 'microsoftLogo', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(5, 'Apple', 'appleLogo', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(6, 'Slack', 'slackLogo', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(7, 'Spotify', 'spotifyLogo', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(8, 'Netflix', 'netflixLogo', '2026-03-20 02:29:43', '2026-03-20 02:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `home_principles`
--

CREATE TABLE `home_principles` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_principles`
--

INSERT INTO `home_principles` (`id`, `title`, `description`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'Clean Architecture', 'Modular, maintainable codebases that scale with your team.', 'Zap', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(2, 'Secure Backend', 'Defense-in-depth security with encrypted data at rest and in transit.', 'Shield', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(3, 'Reliable Systems', '99.9% uptime architecture with automated failover and monitoring.', 'Lock', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(4, 'Professional Delivery', 'On-time delivery with clear communication and documentation.', 'CheckCircle', '2026-03-20 02:29:42', '2026-03-20 02:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `home_projects`
--

CREATE TABLE `home_projects` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `year` varchar(10) NOT NULL,
  `tags` json DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `project_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_projects`
--

INSERT INTO `home_projects` (`id`, `title`, `description`, `year`, `tags`, `image_url`, `project_url`, `created_at`, `updated_at`) VALUES
(1, 'DataVault Platform', 'Enterprise data management system handling 2M+ records with real-time sync and role-based access control.', '2025', '[\"React\", \"Node.js\", \"PostgreSQL\"]', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 'https://github.com/codeaxe', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(2, 'FlowSync API', 'High-throughput API gateway processing 50K requests/minute with automatic failover and load balancing.', '2025', '[\"TypeScript\", \"Redis\", \"Docker\"]', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 'https://github.com/codeaxe', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(3, 'TaskForge Extension', 'Chrome extension automating project management workflows across 12 integrated platforms.', '2024', '[\"Chrome API\", \"React\", \"WebSocket\"]', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80', 'https://github.com/codeaxe', '2026-03-20 02:29:42', '2026-03-20 02:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `home_section_headers`
--

CREATE TABLE `home_section_headers` (
  `id` int NOT NULL,
  `section_key` varchar(50) NOT NULL,
  `section_index` varchar(10) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_section_headers`
--

INSERT INTO `home_section_headers` (`id`, `section_key`, `section_index`, `label`, `title`, `description`, `created_at`, `updated_at`) VALUES
(1, 'system_status', NULL, 'System Status', NULL, NULL, '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(2, 'partners', NULL, 'Partners', NULL, NULL, '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(3, 'capabilities', '01', 'CAPABILITIES', 'Engineering Services', 'Full-stack development services built on modern, scalable architecture.', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(4, 'featured_work', '02', 'FEATURED WORK', 'Selected Projects', 'Systems built for performance, reliability, and scale.', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(5, 'why_codeaxe', '03', 'WHY CODEAXE', 'Engineering Principles', NULL, '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(6, 'technologies', NULL, 'Best Technologies We Use', NULL, NULL, '2026-03-20 02:29:43', '2026-03-20 02:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `home_services`
--

CREATE TABLE `home_services` (
  `id` int NOT NULL,
  `index_number` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_services`
--

INSERT INTO `home_services` (`id`, `index_number`, `title`, `description`, `icon`, `created_at`, `updated_at`) VALUES
(1, '01', 'Web Development', 'Custom websites, platforms, dashboards, and business tools built with modern frameworks.', 'Globe', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(2, '02', 'Custom Software', 'Internal tools and software systems engineered for your specific business requirements.', 'Code2', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(3, '03', 'API Development', 'Secure, scalable backend APIs with type-safe contracts and comprehensive documentation.', 'Server', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(4, '04', 'Chrome Extensions', 'Browser extensions that automate tasks and improve team productivity at scale.', 'Chrome', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(5, '05', 'Mobile Applications', 'Android and iOS applications designed for real-world use and performance.', 'Smartphone', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(6, '06', 'System Automation', 'Connecting APIs, services, and databases to create fully automated workflows.', 'Workflow', '2026-03-20 02:29:42', '2026-03-20 02:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `home_stats`
--

CREATE TABLE `home_stats` (
  `id` int NOT NULL,
  `value` varchar(50) NOT NULL,
  `label` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_stats`
--

INSERT INTO `home_stats` (`id`, `value`, `label`, `created_at`, `updated_at`) VALUES
(1, '99.9%', 'Uptime Architecture', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(2, '0.4s', 'Avg. Load Time', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(3, '124+', 'Delivered Systems', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(4, '48h', 'Response Time', '2026-03-20 02:29:42', '2026-03-20 02:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `home_system_status`
--

CREATE TABLE `home_system_status` (
  `id` int NOT NULL,
  `label` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `ping` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_system_status`
--

INSERT INTO `home_system_status` (`id`, `label`, `status`, `ping`, `created_at`, `updated_at`) VALUES
(1, 'API Gateway', 'Operational', '12ms', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(2, 'Database Cluster', 'Operational', '4ms', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(3, 'CDN Edge Nodes', 'Operational', '8ms', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(4, 'Auth Service', 'Operational', '6ms', '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(5, 'Build Pipeline', 'Operational', '22ms', '2026-03-20 02:29:43', '2026-03-20 02:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `home_technologies`
--

CREATE TABLE `home_technologies` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `src` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_technologies`
--

INSERT INTO `home_technologies` (`id`, `name`, `src`, `created_at`, `updated_at`) VALUES
(1, 'React', 'reactLogo', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(2, 'Node.js', 'nodejsLogo', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(3, 'TypeScript', 'typescriptLogo', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(4, 'Python', 'pythonLogo', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(5, 'Docker', 'dockerLogo', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(6, 'PostgreSQL', 'postgresqlLogo', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(7, 'AWS', 'awsLogo', '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(8, 'Firebase', 'firebaseLogo', '2026-03-20 02:29:42', '2026-03-20 02:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `legal_pages`
--

CREATE TABLE `legal_pages` (
  `id` int NOT NULL,
  `page_type` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `last_updated` varchar(100) DEFAULT 'March 2026',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `legal_pages`
--

INSERT INTO `legal_pages` (`id`, `page_type`, `label`, `title`, `last_updated`, `is_active`) VALUES
(1, 'privacy', 'PRIVACY', 'Privacy Policy', 'March 2026', 1),
(2, 'terms', 'TERMS', 'Terms of Service', 'March 2026', 1),
(3, 'refund-cancellation', 'CANCELLATION', 'Refund & Cancellation', 'March 2026', 1),
(4, 'refund-policy', 'REFUNDS', 'Refund Policy', 'March 2026', 1);

-- --------------------------------------------------------

--
-- Table structure for table `legal_sections`
--

CREATE TABLE `legal_sections` (
  `id` int NOT NULL,
  `page_id` int NOT NULL,
  `heading` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `legal_sections`
--

INSERT INTO `legal_sections` (`id`, `page_id`, `heading`, `content`, `is_active`, `sort_order`) VALUES
(1, 1, 'Data Collection', 'We collect only the information necessary to provide our services — your name, email, company name, and project details submitted through our contact form. We do not use tracking cookies or third-party analytics that compromise your privacy.', 1, 1),
(2, 1, 'Data Usage', 'Your information is used exclusively to communicate about your project inquiry, provide services you\'ve requested, and send relevant project updates. We never sell, rent, or share your data with third parties for marketing purposes.', 1, 2),
(3, 1, 'Data Protection', 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Access to personal data is restricted to authorized team members on a need-to-know basis.', 1, 3),
(4, 1, 'Your Rights', 'You have the right to access, correct, or delete your personal data at any time. Contact us at hello@codeaxe.co.in to exercise these rights. We respond to all data requests within 30 days.', 1, 4),
(5, 2, 'Service Agreement', 'By engaging CodeAxe for development services, you agree to the terms outlined in your project contract including scope, timeline, and payment schedule. All custom development work is governed by individual project agreements.', 1, 1),
(6, 2, 'Intellectual Property', 'Upon full payment, all custom code, designs, and deliverables created for your project become your intellectual property. CodeAxe retains the right to use general techniques and methodologies developed during the engagement.', 1, 2),
(7, 2, 'Confidentiality', 'We treat all client information, business logic, and proprietary data as strictly confidential. NDAs are available upon request and are standard for enterprise engagements.', 1, 3),
(8, 2, 'Liability', 'CodeAxe\'s liability is limited to the total amount paid for services. We are not liable for indirect, incidental, or consequential damages arising from the use of delivered software.', 1, 4),
(9, 3, 'Project Cancellation', 'Either party may terminate a project with 14 days written notice. Upon cancellation, you will be billed for all completed work and any work-in-progress up to the cancellation date.', 1, 1),
(10, 3, 'Milestone-Based Billing', 'Projects are billed at defined milestones. Cancellation between milestones requires payment for the current milestone\'s completed work, calculated on a pro-rata basis.', 1, 2),
(11, 3, 'Transition Support', 'Upon cancellation, we provide full code handoff, documentation, and up to 5 hours of knowledge transfer to ensure a smooth transition to your new development team.', 1, 3),
(12, 4, 'Eligibility', 'Refunds are available for work that does not meet the agreed-upon specifications outlined in your project contract. Claims must be submitted within 14 days of deliverable handoff.', 1, 1),
(13, 4, 'Process', 'Submit refund requests to hello@codeaxe.co.in with your project details and a description of the discrepancy. We review all requests within 7 business days and work to resolve issues before processing refunds.', 1, 2),
(14, 4, 'Scope', 'Refunds apply to the specific deliverable in question, not the entire project. If a deliverable requires revisions to meet specifications, we will complete those revisions at no additional cost before considering a refund.', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int NOT NULL,
  `slug` varchar(10) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `provider` varchar(50) NOT NULL,
  `size` bigint DEFAULT '0',
  `url` text NOT NULL,
  `provider_file_id` varchar(255) DEFAULT NULL,
  `path` text,
  `status` tinyint(1) DEFAULT '1',
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `slug`, `file_name`, `provider`, `size`, `url`, `provider_file_id`, `path`, `status`, `uploaded_at`, `created_at`, `updated_at`) VALUES
(7, 'iq97gS', 'favicon_69c0cbed97313.ico', 'imagekit', 9070, 'https://ik.imagekit.io/sFDkasdjo3i8/data-dms-api/admin/favicon_69c0cbed97313.ico', '69c0cbee5c7cd75eb8c7ef8e', 'http://127.0.0.1:8000/api/dms/media/iq97gS/7', 1, '2026-03-23 05:13:19', '2026-03-23 05:13:19', '2026-04-05 11:43:00'),
(8, '98MosX', 'untitled-1-18_69c519a8f1397.mp4', 's3', 4185468, 'data-dms-api/admin/untitled-1-18_69c519a8f1397.mp4', 'data-dms-api/admin/untitled-1-18_69c519a8f1397.mp4', 'http://localhost/update-codeaxewebsite/backend-api/public/api/dms/media/98MosX/8', 1, '2026-03-26 11:34:20', '2026-03-26 11:34:20', '2026-03-26 11:34:20');

-- --------------------------------------------------------

--
-- Table structure for table `media_logs`
--

CREATE TABLE `media_logs` (
  `id` int NOT NULL,
  `media_id` int NOT NULL,
  `field_changed` varchar(50) DEFAULT NULL,
  `old_value` text,
  `new_value` text,
  `action_type` varchar(20) DEFAULT 'EDIT',
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `media_logs`
--

INSERT INTO `media_logs` (`id`, `media_id`, `field_changed`, `old_value`, `new_value`, `action_type`, `changed_at`) VALUES
(14, 7, 'status', '1', '0', 'DELETE', '2026-04-05 06:09:21'),
(15, 7, 'status', '0', '1', 'RESTORE', '2026-04-05 06:13:00');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_04_05_122114_create_portfolio_and_work_tables', 1);

-- --------------------------------------------------------

--
-- Table structure for table `nav_links`
--

CREATE TABLE `nav_links` (
  `id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `label` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `nav_links`
--

INSERT INTO `nav_links` (`id`, `type`, `label`, `path`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'main', 'Home', '/', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(2, 'main', 'Work', '/work', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(3, 'main', 'Services', '/services', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(4, 'portfolio', 'Chrome Extensions', '/portfolio/chrome-extensions', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(5, 'portfolio', 'Web Tools', '/portfolio/web-tools', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(6, 'portfolio', 'App Store', '/portfolio/app-store', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(7, 'portfolio', 'Play Store', '/portfolio/play-store', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(8, 'portfolio', 'Client Projects', '/portfolio/client-projects', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(9, 'info', 'About Us', '/about', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(10, 'info', 'Contact', '/contact', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(11, 'info', 'Privacy Policy', '/privacy', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(12, 'info', 'Terms of Service', '/terms', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(13, 'info', 'Refund & Cancellation', '/refund-cancellation', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(14, 'info', 'Refund Policy', '/refund-policy', NULL, '2026-03-20 02:29:42', '2026-03-20 02:29:42'),
(15, 'main', 'Home', '/', NULL, '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(16, 'main', 'Work', '/work', NULL, '2026-03-20 02:29:43', '2026-03-20 02:29:43'),
(17, 'main', 'Services', '/services', NULL, '2026-03-20 02:29:43', '2026-03-20 02:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `portfolio_categories`
--

CREATE TABLE `portfolio_categories` (
  `id` int NOT NULL,
  `slug` varchar(100) NOT NULL,
  `label` varchar(255) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `portfolio_categories`
--

INSERT INTO `portfolio_categories` (`id`, `slug`, `label`, `description`, `is_active`, `sort_order`) VALUES
(1, 'web-platforms', 'WEB PLATFORMS', '', 1, 1),
(2, 'backend-systems', 'BACKEND SYSTEMS', '', 1, 2),
(3, 'automation-tools', 'AUTOMATION TOOLS', '', 1, 3),
(4, 'api-integrations', 'API INTEGRATIONS', '', 1, 4),
(5, 'software-solutions', 'SOFTWARE SOLUTIONS', '', 1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `portfolio_items`
--

CREATE TABLE `portfolio_items` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `tags` json DEFAULT NULL,
  `project_year` varchar(10) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `project_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `portfolio_items`
--

INSERT INTO `portfolio_items` (`id`, `category_id`, `title`, `description`, `tags`, `project_year`, `image_url`, `project_url`, `is_active`, `sort_order`) VALUES
(1, 1, '[Portfolio] Test Item Updated', 'Test Description', '[\"React\"]', '2025', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 'https://github.com/codeaxe', 1, 0),
(2, 1, '[Portfolio] InvenTrack Dashboard', 'Real-time inventory management platform for multi-warehouse logistics operations.', '[\"Next.js\", \"GraphQL\", \"Redis\"]', '2024', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 'https://github.com/codeaxe', 1, 0),
(3, 2, '[Portfolio] FlowSync API', 'High-throughput API gateway processing 50K req/min with automatic failover.', '[\"TypeScript\", \"Redis\", \"Docker\"]', '2025', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 'https://github.com/codeaxe', 1, 0),
(4, 2, '[Portfolio] AuthCore Engine', 'Multi-tenant authentication service with OAuth2, SAML, and MFA support.', '[\"Go\", \"PostgreSQL\", \"JWT\"]', '2024', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', 'https://github.com/codeaxe', 1, 0),
(5, 3, '[Portfolio] DeployBot', 'CI/CD automation tool reducing deployment time by 80% across 15 microservices.', '[\"GitHub Actions\", \"Docker\", \"Bash\"]', '2025', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80', 'https://github.com/codeaxe', 1, 0),
(6, 3, '[Portfolio] DataPipe ETL', 'Automated data pipeline processing 10GB daily across 8 data sources.', '[\"Python\", \"Airflow\", \"BigQuery\"]', '2024', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80', 'https://github.com/codeaxe', 1, 0),
(7, 4, '[Portfolio] PayBridge', 'Unified payment gateway integrating Stripe, PayPal, and regional providers.', '[\"Node.js\", \"Stripe API\", \"Webhooks\"]', '2025', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', 'https://github.com/codeaxe', 1, 0),
(8, 5, '[Portfolio] TaskForge Extension', 'Chrome extension automating project management across 12 platforms.', '[\"Chrome API\", \"React\", \"WebSocket\"]', '2024', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80', 'https://github.com/codeaxe', 1, 0),
(9, 5, '[Portfolio] SecureVault', 'End-to-end encrypted document management system for legal firms.', '[\"React\", \"AES-256\", \"AWS S3\"]', '2024', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80', 'https://github.com/codeaxe', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `route_rewrites`
--

CREATE TABLE `route_rewrites` (
  `id` int NOT NULL,
  `source` varchar(500) NOT NULL,
  `destination` varchar(500) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `route_rewrites`
--

INSERT INTO `route_rewrites` (`id`, `source`, `destination`, `is_active`, `sort_order`, `description`) VALUES
(1, '/_api/v1/:path*', '/:path*', 0, 1, NULL),
(2, '/_next/v1/:path*', '/:path*', 0, 2, 'Next.js internal prefix strip fallback');

-- --------------------------------------------------------

--
-- Table structure for table `section_visibility`
--

CREATE TABLE `section_visibility` (
  `id` int UNSIGNED NOT NULL,
  `section_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Unique identifier e.g. hero, services, footer',
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = visible on frontend, 0 = hidden',
  `custom_label` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Admin-facing display label',
  `custom_desc` text COLLATE utf8mb4_unicode_ci COMMENT 'Admin-facing description/notes',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `section_visibility`
--

INSERT INTO `section_visibility` (`id`, `section_key`, `is_enabled`, `custom_label`, `custom_desc`, `created_at`, `updated_at`) VALUES
(1, 'hero', 1, NULL, NULL, '2026-03-23 03:09:09', '2026-03-22 22:02:53'),
(2, 'services', 1, 'Services', 'Core services showcase cards.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(3, 'projects', 1, 'Featured Projects', 'Portfolio highlights on the homepage.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(4, 'stats', 1, 'Company Stats', 'Achievement numbers like clients, projects, etc.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(5, 'principles', 1, 'Principles', 'Core values and working principles.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(6, 'technologies', 1, 'Technologies', 'Tech stack / logos carousel.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(7, 'system_status', 1, 'System Status', 'Live system uptime status panel.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(8, 'partners', 1, 'Partners / Clients', 'Partner logo strip.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(9, 'cta', 1, 'Call To Action', 'Bottom CTA banner to drive conversions.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(10, 'about_hero', 1, 'About Hero', 'About page hero header section.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(11, 'about_team', 1, 'Team Members', 'Team member cards grid.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(12, 'portfolio', 1, 'Portfolio Grid', 'Full portfolio project grid.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(13, 'contact_form', 1, 'Contact Form', 'Main contact us form.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(14, 'navigation', 1, 'Navigation Bar', 'Top navbar shown on all pages.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(15, 'footer', 1, 'Footer', 'Bottom site footer shown on all pages.', '2026-03-23 03:09:09', '2026-03-23 03:09:09'),
(16, 'legal', 1, 'Legal Pages', 'Privacy, Terms, Refund policy pages.', '2026-03-23 03:09:09', '2026-03-23 03:09:09');

-- --------------------------------------------------------

--
-- Table structure for table `services_cta`
--

CREATE TABLE `services_cta` (
  `id` int NOT NULL,
  `heading` varchar(255) NOT NULL,
  `button_label` varchar(100) NOT NULL,
  `button_link` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services_cta`
--

INSERT INTO `services_cta` (`id`, `heading`, `button_label`, `button_link`) VALUES
(1, 'Have a project in mind?', 'Start Project', '/contact');

-- --------------------------------------------------------

--
-- Table structure for table `services_list`
--

CREATE TABLE `services_list` (
  `id` int NOT NULL,
  `sort_index` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `points` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services_list`
--

INSERT INTO `services_list` (`id`, `sort_index`, `title`, `description`, `points`, `is_active`, `sort_order`) VALUES
(1, '01', 'Web Development', 'Custom websites, platforms, dashboards, and business tools. We build with React, Next.js, and modern frameworks that scale from MVP to enterprise.', '[\"Single Page Applications\", \"Admin Dashboards\", \"E-commerce Platforms\", \"SaaS Products\"]', 1, 1),
(2, '02', 'Software Development', 'Custom internal tools and software systems tailored to your business processes. Built for reliability, maintainability, and long-term scalability.', '[\"Internal Business Tools\", \"Workflow Automation\", \"Data Management Systems\", \"Custom CRM/ERP\"]', 1, 2),
(3, '03', 'API Development', 'Secure, scalable backend APIs with type-safe contracts, comprehensive documentation, and thorough testing. Designed for high-throughput environments.', '[\"RESTful APIs\", \"GraphQL Endpoints\", \"Webhook Systems\", \"API Gateway Design\"]', 1, 3),
(4, '04', 'Chrome Extensions', 'Browser extensions that automate repetitive tasks, integrate with existing tools, and improve team productivity across the organization.', '[\"Productivity Tools\", \"Data Scrapers\", \"Platform Integrations\", \"Content Automation\"]', 1, 4),
(5, '05', 'Mobile Applications', 'Android and iOS applications designed for real-world use. Focused on performance, native UX patterns, and reliable offline support.', '[\"Cross-Platform Apps\", \"Native iOS/Android\", \"Offline-First Design\", \"Push Notifications\"]', 1, 5),
(6, '06', 'System Integration', 'Connecting APIs, services, and databases to create automated systems that eliminate manual processes and reduce operational overhead.', '[\"API-First Architecture\", \"Database Migrations\", \"Third-Party Integrations\", \"Modular Integration\"]', 1, 6);

-- --------------------------------------------------------

--
-- Table structure for table `services_page_header`
--

CREATE TABLE `services_page_header` (
  `id` int NOT NULL,
  `section_index` varchar(10) NOT NULL,
  `label` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services_page_header`
--

INSERT INTO `services_page_header` (`id`, `section_index`, `label`, `title`, `description`) VALUES
(1, '00', 'SERVICES', 'What We Build', 'Full-stack engineering services from architecture to deployment.');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('footer_contact_email', 'asadullahnadeem48@gmail.com'),
('footer_contact_phone', '08226832006'),
('footer_copyright', '© 2026 CodeAxe Technologies.<br/>All rights reserved.<br/><b>Version 1.1.0</b>'),
('footer_is_visible', '1'),
('footer_subtitle', 'Technologies'),
('footer_title', 'CodeAxe'),
('home_featured_btn_label', 'View All Projects'),
('home_featured_btn_link', '/work'),
('home_hero_btn1_label', 'View Work'),
('home_hero_btn1_link', '/work'),
('home_hero_btn2_label', 'Start Project'),
('home_hero_btn2_link', '/contact'),
('nav_btn_dashboard', 'Dashboard'),
('nav_btn_login', 'Login'),
('nav_btn_profile', 'Profile'),
('nav_btn_send_request', 'Send Request'),
('nav_btn_signup', 'Sign Up'),
('nav_info_label', 'Info'),
('nav_portfolio_label', 'Portfolio'),
('seo_description', 'Leading Web Development & Digital Solutions Agency'),
('seo_google_analytics_id', 'G-XXXXXXXXXX'),
('seo_google_search_console_id', 'verification-placeholder'),
('seo_keywords', 'web development, mobile apps, UI/UX design, cloud solutions, CodeAxe Technologies'),
('seo_title', 'CodeAxe Technologies'),
('site_apple_icon_url', 'http://127.0.0.1:8000/api/dms/media/iq97gS/7'),
('site_favicon_url', 'http://127.0.0.1:8000/api/dms/media/iq97gS/7'),
('site_footer_logo_url', 'https://api.codeaxe.co.in/api/dms/media/RWNPiJ/12'),
('site_founder_message', ''),
('site_founder_name', 'Asadullah Nadeem'),
('site_logo_url', 'https://api.codeaxe.co.in/api/dms/media/RWNPiJ/12'),
('site_name_accent', 'Technologies'),
('site_name_prefix', 'CodeAxe'),
('social_custom_links', '[]'),
('social_facebook', 'https://facebook.com/codeaxe'),
('social_instagram', 'https://instagram.com/codeaxe'),
('social_linkedin', 'https://linkedin.com/company/codeaxe'),
('social_twitter', 'https://twitter.com/codeaxe'),
('social_whatsapp', 'https://wa.me/918226832006'),
('social_youtube', 'https://youtube.com/@codeaxe');

-- --------------------------------------------------------

--
-- Table structure for table `smtp_settings`
--

CREATE TABLE `smtp_settings` (
  `id` int NOT NULL,
  `mail_mailer` varchar(50) DEFAULT 'smtp',
  `mail_host` varchar(255) DEFAULT 'smtp.mailtrap.io',
  `mail_port` int DEFAULT '2525',
  `mail_username` varchar(255) DEFAULT NULL,
  `mail_password` varchar(255) DEFAULT NULL,
  `mail_encryption` varchar(50) DEFAULT 'tls',
  `mail_from_address` varchar(255) DEFAULT 'hello@codeaxe.co.in',
  `mail_from_name` varchar(255) DEFAULT 'CodeAxe Support',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `smtp_settings`
--

INSERT INTO `smtp_settings` (`id`, `mail_mailer`, `mail_host`, `mail_port`, `mail_username`, `mail_password`, `mail_encryption`, `mail_from_address`, `mail_from_name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'smtp', 'smtp.mailtrap.io', 2525, 'default_user', 'default_pass', 'tls', 'hello@codeaxe.co.in', 'CodeAxe Support', 1, '2026-03-21 17:20:58', '2026-03-21 17:20:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `login_type` varchar(50) DEFAULT 'password',
  `api_token` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_banned` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `login_type`, `api_token`, `email_verified_at`, `created_at`, `updated_at`, `is_banned`) VALUES
(1, 'v', 'asadullahnadeem48@gmail.com', '$2y$10$1xmj0.oRKzJRvp.9d9Rp1e4RVrz/rzeAxUf5eIHkASdQPgEgJnkj2', 'password', 'zPZVCzjAsfuqE5ynyJEBLew3AqN0yYXQ8dnRTstdaBSypvp9Y0wCwflSpViQ', '2026-03-21 10:51:23', '2026-03-21 09:43:15', '2026-04-05 06:24:54', 1),
(2, 'Justme', 'Justme@gmail.com', '$2y$12$OYp4SElYuuvgSd/bhIijieADlL89ltB8Wli1op/f/yPoL4RFV38V.', 'password', NULL, '2026-03-21 13:14:50', '2026-03-21 13:14:37', '2026-04-05 06:26:36', 0);

-- --------------------------------------------------------

--
-- Table structure for table `verification_tokens`
--

CREATE TABLE `verification_tokens` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_categories`
--

CREATE TABLE `work_categories` (
  `id` int NOT NULL,
  `label` varchar(255) NOT NULL,
  `sort_order` int DEFAULT '0',
  `slug` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `work_categories`
--

INSERT INTO `work_categories` (`id`, `label`, `sort_order`, `slug`, `is_active`) VALUES
(1, 'Enterprise Platforms', 1, 'enterprise', 1),
(2, 'Cloud Infrastructure', 2, 'cloud', 1),
(3, 'Data Engineering', 3, 'data', 1);

-- --------------------------------------------------------

--
-- Table structure for table `work_projects`
--

CREATE TABLE `work_projects` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `tags` json DEFAULT NULL,
  `project_year` varchar(10) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `project_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `work_projects`
--

INSERT INTO `work_projects` (`id`, `category_id`, `title`, `description`, `tags`, `project_year`, `image_url`, `project_url`, `is_active`, `sort_order`) VALUES
(1, 1, 'Global Logistics ERP', 'A massive enterprise resource planning system for global shipping.', '[\"TypeScript\", \"NestJS\", \"React\"]', '2023', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', '', 1, 1),
(2, 1, 'Healthcare Portal V2', 'Patient and doctor unified management portal.', '[\"NextJS\", \"PostgreSQL\"]', '2022', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80', '', 1, 2),
(3, 2, 'AWS Microservices Migration', 'Migrated 50+ monolithic services to AWS Lambda and ECS.', '[\"AWS\", \"Docker\", \"Terraform\"]', '2024', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', '', 1, 3),
(4, 3, 'Real-time Analytics Engine', 'Processing 1B+ events daily with sub-second latency.', '[\"Go\", \"Kafka\", \"ClickHouse\"]', '2023', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', '', 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `work_section_header`
--

CREATE TABLE `work_section_header` (
  `id` int NOT NULL,
  `section_index` varchar(10) NOT NULL,
  `label` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `work_section_header`
--

INSERT INTO `work_section_header` (`id`, `section_index`, `label`, `title`, `description`) VALUES
(1, '00', 'ALL WORK', 'Projects & Systems', 'A selection of systems engineered for performance, reliability, and scale.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_page`
--
ALTER TABLE `about_page`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `about_sections`
--
ALTER TABLE `about_sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `api_token` (`api_token`);

--
-- Indexes for table `admin_roles`
--
ALTER TABLE `admin_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_roles_name_unique` (`name`);

--
-- Indexes for table `auth_pages`
--
ALTER TABLE `auth_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_type` (`page_type`);

--
-- Indexes for table `client_messages`
--
ALTER TABLE `client_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `client_requests`
--
ALTER TABLE `client_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `contact_direct_info`
--
ALTER TABLE `contact_direct_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_page`
--
ALTER TABLE `contact_page`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_response_times`
--
ALTER TABLE `contact_response_times`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dashboard_ui`
--
ALTER TABLE `dashboard_ui`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_key` (`page_key`);

--
-- Indexes for table `dms_api_keys`
--
ALTER TABLE `dms_api_keys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_key` (`api_key`);

--
-- Indexes for table `dms_provider_keys`
--
ALTER TABLE `dms_provider_keys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `provider` (`provider`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_key` (`template_key`);

--
-- Indexes for table `email_template_sections`
--
ALTER TABLE `email_template_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `template_id` (`template_id`);

--
-- Indexes for table `footer_links`
--
ALTER TABLE `footer_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `footer_sections`
--
ALTER TABLE `footer_sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_cta`
--
ALTER TABLE `home_cta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_hero`
--
ALTER TABLE `home_hero`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_partners`
--
ALTER TABLE `home_partners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_principles`
--
ALTER TABLE `home_principles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_projects`
--
ALTER TABLE `home_projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_section_headers`
--
ALTER TABLE `home_section_headers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_key` (`section_key`);

--
-- Indexes for table `home_services`
--
ALTER TABLE `home_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_stats`
--
ALTER TABLE `home_stats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_system_status`
--
ALTER TABLE `home_system_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_technologies`
--
ALTER TABLE `home_technologies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `legal_pages`
--
ALTER TABLE `legal_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_type` (`page_type`);

--
-- Indexes for table `legal_sections`
--
ALTER TABLE `legal_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `page_id` (`page_id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `media_logs`
--
ALTER TABLE `media_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `media_id` (`media_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nav_links`
--
ALTER TABLE `nav_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `portfolio_categories`
--
ALTER TABLE `portfolio_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `route_rewrites`
--
ALTER TABLE `route_rewrites`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `section_visibility`
--
ALTER TABLE `section_visibility`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_key` (`section_key`);

--
-- Indexes for table `services_cta`
--
ALTER TABLE `services_cta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services_list`
--
ALTER TABLE `services_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services_page_header`
--
ALTER TABLE `services_page_header`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `smtp_settings`
--
ALTER TABLE `smtp_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `api_token` (`api_token`);

--
-- Indexes for table `verification_tokens`
--
ALTER TABLE `verification_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `work_categories`
--
ALTER TABLE `work_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work_projects`
--
ALTER TABLE `work_projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `work_section_header`
--
ALTER TABLE `work_section_header`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_page`
--
ALTER TABLE `about_page`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `about_sections`
--
ALTER TABLE `about_sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admin_roles`
--
ALTER TABLE `admin_roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `auth_pages`
--
ALTER TABLE `auth_pages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `client_messages`
--
ALTER TABLE `client_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `client_requests`
--
ALTER TABLE `client_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_direct_info`
--
ALTER TABLE `contact_direct_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contact_page`
--
ALTER TABLE `contact_page`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_response_times`
--
ALTER TABLE `contact_response_times`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dashboard_ui`
--
ALTER TABLE `dashboard_ui`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dms_api_keys`
--
ALTER TABLE `dms_api_keys`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `dms_provider_keys`
--
ALTER TABLE `dms_provider_keys`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `email_template_sections`
--
ALTER TABLE `email_template_sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `footer_links`
--
ALTER TABLE `footer_links`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `footer_sections`
--
ALTER TABLE `footer_sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `home_cta`
--
ALTER TABLE `home_cta`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `home_hero`
--
ALTER TABLE `home_hero`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `home_partners`
--
ALTER TABLE `home_partners`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `home_principles`
--
ALTER TABLE `home_principles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `home_projects`
--
ALTER TABLE `home_projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `home_section_headers`
--
ALTER TABLE `home_section_headers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `home_services`
--
ALTER TABLE `home_services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `home_stats`
--
ALTER TABLE `home_stats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `home_system_status`
--
ALTER TABLE `home_system_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `home_technologies`
--
ALTER TABLE `home_technologies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `legal_pages`
--
ALTER TABLE `legal_pages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `legal_sections`
--
ALTER TABLE `legal_sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `media_logs`
--
ALTER TABLE `media_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `nav_links`
--
ALTER TABLE `nav_links`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `portfolio_categories`
--
ALTER TABLE `portfolio_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `route_rewrites`
--
ALTER TABLE `route_rewrites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `section_visibility`
--
ALTER TABLE `section_visibility`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `services_cta`
--
ALTER TABLE `services_cta`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `services_list`
--
ALTER TABLE `services_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `services_page_header`
--
ALTER TABLE `services_page_header`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `smtp_settings`
--
ALTER TABLE `smtp_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `verification_tokens`
--
ALTER TABLE `verification_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `work_categories`
--
ALTER TABLE `work_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `work_projects`
--
ALTER TABLE `work_projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `work_section_header`
--
ALTER TABLE `work_section_header`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `client_messages`
--
ALTER TABLE `client_messages`
  ADD CONSTRAINT `client_messages_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `client_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `client_requests`
--
ALTER TABLE `client_requests`
  ADD CONSTRAINT `client_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_template_sections`
--
ALTER TABLE `email_template_sections`
  ADD CONSTRAINT `email_template_sections_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `footer_links`
--
ALTER TABLE `footer_links`
  ADD CONSTRAINT `footer_links_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `footer_sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `legal_sections`
--
ALTER TABLE `legal_sections`
  ADD CONSTRAINT `legal_sections_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `legal_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_logs`
--
ALTER TABLE `media_logs`
  ADD CONSTRAINT `media_logs_ibfk_1` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  ADD CONSTRAINT `portfolio_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `portfolio_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `work_projects`
--
ALTER TABLE `work_projects`
  ADD CONSTRAINT `work_projects_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `work_categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
