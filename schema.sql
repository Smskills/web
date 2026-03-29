-- Create the Site Configuration table to store general settings, theme, and metadata
-- This stores the "un-normalizable" parts of the AppState as a fallback or for complex nested objects
CREATE TABLE IF NOT EXISTS `site_config` (
  `id` int(11) NOT NULL,
  `config_json` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initialize the table with a default empty object if it doesn't exist
INSERT INTO `site_config` (`id`, `config_json`) 
VALUES (1, '{}') 
ON DUPLICATE KEY UPDATE id=id;

-- Create the Leads table to store form submissions
CREATE TABLE IF NOT EXISTS `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `course` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `source` varchar(50) DEFAULT 'website',
  `status` varchar(20) DEFAULT 'New',
  `details` longtext DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Users table for Admin Login
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL UNIQUE,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'admin',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Courses table
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `academic_level` varchar(100) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `certification` varchar(255) DEFAULT NULL,
  `mode` varchar(50) DEFAULT 'Offline',
  `description` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `image` varchar(500) DEFAULT NULL,
  `card_image` varchar(500) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `eligibility` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `show_benefits` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Notices table
CREATE TABLE IF NOT EXISTS `notices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_important` tinyint(1) DEFAULT 0,
  `category` varchar(50) DEFAULT 'General',
  `link` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Gallery table
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(500) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the FAQs table
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Custom Pages table
CREATE TABLE IF NOT EXISTS `custom_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `content` longtext DEFAULT NULL,
  `visible` tinyint(1) DEFAULT 1,
  `show_header` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Placement Stats table
CREATE TABLE IF NOT EXISTS `placement_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Student Reviews table
CREATE TABLE IF NOT EXISTS `student_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `course` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `company_icon` varchar(500) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `salary_increase` varchar(100) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Industry Partners table
CREATE TABLE IF NOT EXISTS `industry_partners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `icon` varchar(500) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Career Services table
CREATE TABLE IF NOT EXISTS `career_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Team Members table
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Achievement Stats table
CREATE TABLE IF NOT EXISTS `achievement_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Extra Chapters table (About Page)
CREATE TABLE IF NOT EXISTS `extra_chapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `story` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the Legal Sections table
CREATE TABLE IF NOT EXISTS `legal_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('privacy', 'terms') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
