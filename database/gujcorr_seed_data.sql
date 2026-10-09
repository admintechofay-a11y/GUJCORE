-- ==========================================================
-- GUJCORR 2027: Initial Seed Data for Production Baseline
-- Clean state: No fake registrations, papers, or bookings
-- ==========================================================

SET NAMES utf8mb4;

-- 1. Exhibition Stalls Baseline (All Stalls Available for Booking)
INSERT INTO `wp_gujcorr_booths`
(`booth_number`, `type`, `area_sqm`, `dimensions`, `company_name`, `contact_person`, `designation`, `email`, `mobile_number`, `fascia_name`, `gstin`, `base_price`, `gst_amount`, `total_price`, `status`)
VALUES
('EXH-12-01', 'Exhibition Booth (12 sqm)', 12, '3m x 4m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 75000.00, 13500.00, 88500.00, 'Available'),
('EXH-12-02', 'Exhibition Booth (12 sqm)', 12, '3m x 4m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 75000.00, 13500.00, 88500.00, 'Available'),
('EXH-12-03', 'Exhibition Booth (12 sqm)', 12, '3m x 4m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 75000.00, 13500.00, 88500.00, 'Available'),
('EXH-09-01', 'Exhibition Booth (9 sqm)', 9, '3m x 3m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000.00, 9000.00, 59000.00, 'Available'),
('EXH-09-02', 'Exhibition Booth (9 sqm)', 9, '3m x 3m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000.00, 9000.00, 59000.00, 'Available'),
('EXH-09-03', 'Exhibition Booth (9 sqm)', 9, '3m x 3m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000.00, 9000.00, 59000.00, 'Available');

-- 2. Official Administrative Staff Accounts
INSERT INTO `wp_gujcorr_users`
(`username`, `email`, `password_hash`, `full_name`, `role`, `status`)
VALUES
('superadmin', 'admin@gujcorr.org', '$2a$12$e6m7x6Z9Vw5uB8v7R4K3v.hL7W3bM0oG9jF8e2q5t1y7u4i9o0p1a', 'GUJCORR Super Administrator', 'Super Administrator', 'Active'),
('secretariat', 'secretariat@gujcorr.org', '$2a$12$e6m7x6Z9Vw5uB8v7R4K3v.hL7W3bM0oG9jF8e2q5t1y7u4i9o0p1a', 'Conference Secretariat Desk', 'Secretariat Staff', 'Active'),
('finance', 'finance@gujcorr.org', '$2a$12$e6m7x6Z9Vw5uB8v7R4K3v.hL7W3bM0oG9jF8e2q5t1y7u4i9o0p1a', 'Finance & Reconciliation Officer', 'Finance Staff', 'Active'),
('editorial', 'editorial@gujcorr.org', '$2a$12$e6m7x6Z9Vw5uB8v7R4K3v.hL7W3bM0oG9jF8e2q5t1y7u4i9o0p1a', 'Technical Committee Coordinator', 'Paper Coordinator', 'Active');

-- 3. System Genesis Audit Log Record
INSERT INTO `wp_gujcorr_audit_logs`
(`user_id`, `user_email`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`, `status`)
VALUES
('sys-init', 'admin@gujcorr.org', 'SYSTEM_INITIALIZATION', 'SYSTEM', 'CONF-2027', 'Database initialized with official brochure parameters and clean production baseline', '127.0.0.1', 'Success');
