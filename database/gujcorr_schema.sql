-- ==========================================================
-- GUJCORR 2027: International Conference & Exhibition Database
-- MySQL Database Schema Definition (Production Ready)
-- Compatible with MySQL 5.7+, 8.0+, MariaDB 10.3+, and WordPress Prefix `wp_`
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Delegate Registrations Table
DROP TABLE IF EXISTS `wp_gujcorr_registrations`;
CREATE TABLE `wp_gujcorr_registrations` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  `designation` VARCHAR(255) DEFAULT NULL,
  `organization` VARCHAR(255) DEFAULT NULL,
  `department` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(191) NOT NULL,
  `mobile_number` VARCHAR(50) NOT NULL,
  `country` VARCHAR(100) DEFAULT 'India',
  `state` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `membership_number` VARCHAR(100) DEFAULT NULL,
  `gstin` VARCHAR(50) DEFAULT NULL,
  `company_legal_name` VARCHAR(255) DEFAULT NULL,
  `base_amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `gst_amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `payment_method` VARCHAR(100) DEFAULT 'Bank Transfer / NEFT',
  `transaction_ref` VARCHAR(255) DEFAULT NULL,
  `dietary_preference` ENUM('Pure Vegetarian', 'Jain (No Root Veg)', 'Non-Vegetarian') DEFAULT 'Pure Vegetarian',
  `status` ENUM('Pending Payment', 'Confirmed', 'Attended', 'Cancelled') DEFAULT 'Confirmed',
  `payment_proof_url` VARCHAR(255) DEFAULT NULL,
  `qr_token` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reg_email` (`email`),
  KEY `idx_reg_ticket` (`ticket_id`),
  KEY `idx_reg_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Call for Papers & Abstract Submissions Table
DROP TABLE IF EXISTS `wp_gujcorr_papers`;
CREATE TABLE `wp_gujcorr_papers` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `paper_code` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) NOT NULL,
  `nationality` VARCHAR(100) DEFAULT 'Indian',
  `gender` ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  `designation` VARCHAR(255) DEFAULT NULL,
  `company_name` VARCHAR(255) DEFAULT NULL,
  `education` VARCHAR(255) DEFAULT NULL,
  `specialization` VARCHAR(255) DEFAULT NULL,
  `achievements` TEXT DEFAULT NULL,
  `memberships` TEXT DEFAULT NULL,
  `email` VARCHAR(191) NOT NULL,
  `mobile_number` VARCHAR(50) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT 'India',
  `paper_title` TEXT NOT NULL,
  `symposium_id` INT(11) NOT NULL DEFAULT 1,
  `symposium_title` VARCHAR(255) NOT NULL,
  `presentation_type` ENUM('Oral', 'Poster') DEFAULT 'Oral',
  `abstract_text` MEDIUMTEXT NOT NULL,
  `keywords` VARCHAR(255) DEFAULT NULL,
  `co_authors` TEXT DEFAULT NULL,
  `is_presenting_author` TINYINT(1) DEFAULT 1,
  `resume_url` VARCHAR(255) DEFAULT NULL,
  `full_paper_url` VARCHAR(255) DEFAULT NULL,
  `presentation_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Submitted', 'Under Review', 'Revision Required', 'Accepted for Oral Presentation', 'Accepted for Poster', 'Rejected') DEFAULT 'Submitted',
  `reviewer_score` DECIMAL(5,2) DEFAULT '0.00',
  `reviewer_comments` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_papers_email` (`email`),
  KEY `idx_papers_code` (`paper_code`),
  KEY `idx_papers_symp` (`symposium_id`),
  KEY `idx_papers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Exhibition Booths & Floor Plan Reservations Table
DROP TABLE IF EXISTS `wp_gujcorr_booths`;
CREATE TABLE `wp_gujcorr_booths` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `booth_number` VARCHAR(50) NOT NULL UNIQUE,
  `type` VARCHAR(100) NOT NULL DEFAULT 'Standard Shell (9 sqm)',
  `area_sqm` INT(11) NOT NULL DEFAULT 9,
  `dimensions` VARCHAR(50) DEFAULT '3m x 3m',
  `company_name` VARCHAR(255) DEFAULT NULL,
  `contact_person` VARCHAR(255) DEFAULT NULL,
  `designation` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(191) DEFAULT NULL,
  `mobile_number` VARCHAR(50) DEFAULT NULL,
  `fascia_name` VARCHAR(100) DEFAULT NULL,
  `gstin` VARCHAR(50) DEFAULT NULL,
  `base_price` DECIMAL(10,2) NOT NULL DEFAULT '50000.00',
  `gst_amount` DECIMAL(10,2) NOT NULL DEFAULT '9000.00',
  `total_price` DECIMAL(10,2) NOT NULL DEFAULT '59000.00',
  `status` ENUM('Available', 'Reserved', 'Booked') DEFAULT 'Available',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_booth_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Corrosion Awareness Awards Nominations Table
DROP TABLE IF EXISTS `wp_gujcorr_awards`;
CREATE TABLE `wp_gujcorr_awards` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `award_category` VARCHAR(255) NOT NULL,
  `nominee_name` VARCHAR(255) NOT NULL,
  `designation` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `mobile` VARCHAR(50) NOT NULL,
  `citation_summary` MEDIUMTEXT NOT NULL,
  `attachment_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Pending Review', 'Shortlisted', 'Awarded', 'Rejected') DEFAULT 'Pending Review',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Proforma Invoices & Corporate Billing Table
DROP TABLE IF EXISTS `wp_gujcorr_invoices`;
CREATE TABLE `wp_gujcorr_invoices` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `invoice_type` ENUM('PROFORMA INVOICE', 'TAX INVOICE', 'REGISTRATION RECEIPT') DEFAULT 'PROFORMA INVOICE',
  `company_name` VARCHAR(255) NOT NULL,
  `contact_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `gstin` VARCHAR(50) DEFAULT NULL,
  `sac_code` VARCHAR(20) DEFAULT '998397',
  `tier_name` VARCHAR(100) NOT NULL,
  `quantity` INT(11) NOT NULL DEFAULT 1,
  `base_amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `cgst_amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `sgst_amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `payment_status` ENUM('Unpaid', 'Paid', 'Cancelled') DEFAULT 'Unpaid',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inv_num` (`invoice_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Contact Inquiries Table
DROP TABLE IF EXISTS `wp_gujcorr_inquiries`;
CREATE TABLE `wp_gujcorr_inquiries` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `organization` VARCHAR(255) DEFAULT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('Unread', 'Read', 'Replied') DEFAULT 'Unread',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
