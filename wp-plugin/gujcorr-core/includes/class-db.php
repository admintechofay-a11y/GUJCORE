<?php
if (!defined('ABSPATH')) {
    exit;
}

class GUJCORR_DB {

    public static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // 1. Delegate Registrations Table
        $table_reg = $wpdb->prefix . 'gujcorr_registrations';
        $sql_reg = "CREATE TABLE $table_reg (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            ticket_id varchar(50) NOT NULL,
            full_name varchar(255) NOT NULL,
            gender varchar(20) DEFAULT '',
            designation varchar(255) DEFAULT '',
            organization varchar(255) DEFAULT '',
            department varchar(255) DEFAULT '',
            email varchar(191) NOT NULL,
            mobile_number varchar(50) NOT NULL,
            country varchar(100) DEFAULT 'India',
            state varchar(100) DEFAULT '',
            city varchar(100) DEFAULT '',
            address text,
            category varchar(100) NOT NULL,
            membership_number varchar(100) DEFAULT '',
            gstin varchar(50) DEFAULT '',
            company_legal_name varchar(255) DEFAULT '',
            base_amount decimal(10,2) NOT NULL DEFAULT 0.00,
            gst_amount decimal(10,2) NOT NULL DEFAULT 0.00,
            total_amount decimal(10,2) NOT NULL DEFAULT 0.00,
            payment_method varchar(100) DEFAULT 'Bank Transfer',
            transaction_ref varchar(255) DEFAULT '',
            dietary_preference varchar(50) DEFAULT 'Pure Vegetarian',
            status varchar(50) DEFAULT 'Confirmed',
            payment_proof_url varchar(255) DEFAULT '',
            qr_token varchar(255) DEFAULT '',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY ticket_id (ticket_id),
            KEY email (email)
        ) $charset_collate;";
        dbDelta($sql_reg);

        // 2. Paper Submissions Table
        $table_papers = $wpdb->prefix . 'gujcorr_papers';
        $sql_papers = "CREATE TABLE $table_papers (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            paper_code varchar(50) NOT NULL,
            full_name varchar(255) NOT NULL,
            nationality varchar(100) DEFAULT 'Indian',
            gender varchar(20) DEFAULT '',
            designation varchar(255) DEFAULT '',
            company_name varchar(255) DEFAULT '',
            education varchar(255) DEFAULT '',
            specialization varchar(255) DEFAULT '',
            achievements text,
            memberships text,
            email varchar(191) NOT NULL,
            mobile_number varchar(50) NOT NULL,
            address text,
            city varchar(100) DEFAULT '',
            state varchar(100) DEFAULT '',
            country varchar(100) DEFAULT 'India',
            paper_title text NOT NULL,
            symposium_id int(11) NOT NULL DEFAULT 1,
            symposium_title varchar(255) NOT NULL,
            presentation_type varchar(20) DEFAULT 'Oral',
            abstract_text text NOT NULL,
            keywords text,
            co_authors text,
            is_presenting_author tinyint(1) DEFAULT 1,
            resume_url varchar(255) DEFAULT '',
            full_paper_url varchar(255) DEFAULT '',
            presentation_url varchar(255) DEFAULT '',
            status varchar(50) DEFAULT 'Submitted',
            reviewer_score decimal(5,2) DEFAULT 0.00,
            reviewer_comments text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY paper_code (paper_code),
            KEY email (email)
        ) $charset_collate;";
        dbDelta($sql_papers);

        // 3. Exhibitors & Booth Reservations Table
        $table_booths = $wpdb->prefix . 'gujcorr_booths';
        $sql_booths = "CREATE TABLE $table_booths (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            booth_number varchar(50) NOT NULL,
            company_name varchar(255) DEFAULT '',
            contact_person varchar(255) DEFAULT '',
            designation varchar(255) DEFAULT '',
            email varchar(191) DEFAULT '',
            mobile_number varchar(50) DEFAULT '',
            fascia_name varchar(100) DEFAULT '',
            gstin varchar(50) DEFAULT '',
            booth_size varchar(50) DEFAULT '9 sqm',
            type varchar(100) DEFAULT 'Exhibition Booth (9 sqm)',
            area_sqm int(11) DEFAULT 9,
            dimensions varchar(50) DEFAULT '3m x 3m',
            base_price decimal(10,2) NOT NULL DEFAULT 50000.00,
            gst_amount decimal(10,2) NOT NULL DEFAULT 9000.00,
            total_price decimal(10,2) NOT NULL DEFAULT 59000.00,
            status varchar(50) DEFAULT 'Available',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY booth_number (booth_number)
        ) $charset_collate;";
        dbDelta($sql_booths);

        // 4. Awards Nominations Table
        $table_awards = $wpdb->prefix . 'gujcorr_awards';
        $sql_awards = "CREATE TABLE $table_awards (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            award_category varchar(255) NOT NULL,
            nominee_name varchar(255) NOT NULL,
            designation varchar(255) NOT NULL,
            organization varchar(255) NOT NULL,
            email varchar(191) NOT NULL,
            mobile varchar(50) NOT NULL,
            citation_summary text NOT NULL,
            attachment_url varchar(255) DEFAULT '',
            status varchar(50) DEFAULT 'Pending Review',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        dbDelta($sql_awards);

        // 5. Invoices & Billing Table
        $table_invoices = $wpdb->prefix . 'gujcorr_invoices';
        $sql_invoices = "CREATE TABLE $table_invoices (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            invoice_number varchar(50) NOT NULL,
            invoice_type varchar(50) DEFAULT 'PROFORMA INVOICE',
            company_name varchar(255) NOT NULL,
            contact_name varchar(255) NOT NULL,
            email varchar(191) NOT NULL,
            gstin varchar(50) DEFAULT '',
            sac_code varchar(20) DEFAULT '998397',
            tier_name varchar(100) NOT NULL,
            quantity int(11) NOT NULL DEFAULT 1,
            base_amount decimal(10,2) NOT NULL DEFAULT 0.00,
            cgst_amount decimal(10,2) NOT NULL DEFAULT 0.00,
            sgst_amount decimal(10,2) NOT NULL DEFAULT 0.00,
            total_amount decimal(10,2) NOT NULL DEFAULT 0.00,
            payment_status varchar(50) DEFAULT 'Unpaid',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY invoice_number (invoice_number)
        ) $charset_collate;";
        dbDelta($sql_invoices);

        // 6. Contact Inquiries Table
        $table_inquiries = $wpdb->prefix . 'gujcorr_inquiries';
        $sql_inquiries = "CREATE TABLE $table_inquiries (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            email varchar(191) NOT NULL,
            phone varchar(50) DEFAULT '',
            organization varchar(255) DEFAULT '',
            subject varchar(255) NOT NULL,
            message text NOT NULL,
            status varchar(50) DEFAULT 'Unread',
            internal_notes text,
            assigned_to varchar(100) DEFAULT '',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        dbDelta($sql_inquiries);

        // 7. Append-Only Audit Logs Table
        $table_audit = $wpdb->prefix . 'gujcorr_audit_logs';
        $sql_audit = "CREATE TABLE $table_audit (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id varchar(100) DEFAULT '',
            user_email varchar(191) DEFAULT '',
            action varchar(100) NOT NULL,
            resource_type varchar(100) NOT NULL,
            resource_id varchar(100) DEFAULT '',
            details text,
            ip_address varchar(50) DEFAULT '',
            status varchar(50) DEFAULT 'Success',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY idx_action (action),
            KEY idx_created_at (created_at)
        ) $charset_collate;";
        dbDelta($sql_audit);

        // 8. Conference CMS Content Table
        $table_content = $wpdb->prefix . 'gujcorr_content';
        $sql_content = "CREATE TABLE $table_content (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            section_key varchar(100) NOT NULL,
            content_json longtext NOT NULL,
            updated_by varchar(191) DEFAULT 'system',
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY section_key (section_key)
        ) $charset_collate;";
        dbDelta($sql_content);

        // 9. Administrative & Staff Accounts Table
        $table_users = $wpdb->prefix . 'gujcorr_users';
        $sql_users = "CREATE TABLE $table_users (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            username varchar(100) NOT NULL,
            email varchar(191) NOT NULL,
            password_hash varchar(255) NOT NULL,
            full_name varchar(255) NOT NULL,
            role varchar(50) NOT NULL DEFAULT 'Delegate',
            status varchar(20) NOT NULL DEFAULT 'Active',
            last_login datetime DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY username (username),
            UNIQUE KEY email (email),
            KEY idx_role (role)
        ) $charset_collate;";
        dbDelta($sql_users);
    }
}
