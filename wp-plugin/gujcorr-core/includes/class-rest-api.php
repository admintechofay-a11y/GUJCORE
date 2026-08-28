<?php
if (!defined('ABSPATH')) {
    exit;
}

class GUJCORR_REST_API {

    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_routes'));
    }

    public static function register_routes() {
        $namespace = 'gujcorr/v1';

        // 1. Delegate Registration
        register_rest_route($namespace, '/registrations', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'create_registration'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/registrations', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_registrations'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        // 2. Paper Submissions
        register_rest_route($namespace, '/papers', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'create_paper'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/papers', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_papers'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        register_rest_route($namespace, '/papers/score', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'score_paper'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        // 3. Exhibitors & Booths
        register_rest_route($namespace, '/booths/reserve', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'reserve_booth'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/booths', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_booths'),
            'permission_callback' => '__return_true'
        ));

        // 4. Awards Nomination
        register_rest_route($namespace, '/awards/nominate', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'create_award_nomination'),
            'permission_callback' => '__return_true'
        ));

        // 5. Invoices
        register_rest_route($namespace, '/invoices', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'create_invoice'),
            'permission_callback' => '__return_true'
        ));

        // 6. Contact Message
        register_rest_route($namespace, '/contact', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'create_contact_message'),
            'permission_callback' => '__return_true'
        ));

        // 7. Auth Login / Register
        register_rest_route($namespace, '/auth/login', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'auth_login'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/auth/register', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'auth_register'),
            'permission_callback' => '__return_true'
        ));
    }

    public static function check_admin_permissions($request) {
        if (current_user_can('manage_options')) {
            return true;
        }
        $api_key = $request->get_header('x-gujcorr-api-key');
        if (!empty($api_key) && defined('GUJCORR_API_SECRET') && hash_equals(GUJCORR_API_SECRET, $api_key)) {
            return true;
        }
        return new WP_Error('rest_forbidden', __('You do not have permission to access this data.', 'gujcorr'), array('status' => 403));
    }

    public static function create_registration($request) {
        global $wpdb;
        $params = $request->get_json_params();

        if (empty($params['fullName']) || empty($params['email']) || empty($params['mobileNumber'])) {
            return new WP_Error('missing_fields', 'Please provide full name, email, and mobile number.', array('status' => 400));
        }

        $table = $wpdb->prefix . 'gujcorr_registrations';
        $ticket_id = 'GUJ27-DEL-' . strtoupper(wp_generate_password(6, false));
        $base_amount = floatval($params['baseAmount'] ?? 4000);
        $gst_amount = floatval($params['gstAmount'] ?? 720);
        $total_amount = floatval($params['totalAmount'] ?? ($base_amount + $gst_amount));
        $qr_token = 'GUJCORR2027:' . $ticket_id;

        $inserted = $wpdb->insert($table, array(
            'ticket_id' => $ticket_id,
            'full_name' => sanitize_text_field($params['fullName']),
            'gender' => sanitize_text_field($params['gender'] ?? 'Male'),
            'designation' => sanitize_text_field($params['designation'] ?? ''),
            'organization' => sanitize_text_field($params['organization'] ?? ''),
            'department' => sanitize_text_field($params['department'] ?? ''),
            'email' => sanitize_email($params['email']),
            'mobile_number' => sanitize_text_field($params['mobileNumber']),
            'country' => sanitize_text_field($params['country'] ?? 'India'),
            'state' => sanitize_text_field($params['state'] ?? ''),
            'city' => sanitize_text_field($params['city'] ?? ''),
            'address' => sanitize_textarea_field($params['address'] ?? ''),
            'category' => sanitize_text_field($params['category'] ?? 'Standard'),
            'membership_number' => sanitize_text_field($params['membershipNumber'] ?? ''),
            'gstin' => sanitize_text_field($params['gstin'] ?? ''),
            'company_legal_name' => sanitize_text_field($params['companyLegalName'] ?? ''),
            'base_amount' => $base_amount,
            'gst_amount' => $gst_amount,
            'total_amount' => $total_amount,
            'payment_method' => sanitize_text_field($params['paymentMethod'] ?? 'Bank Transfer'),
            'transaction_ref' => sanitize_text_field($params['transactionReference'] ?? ''),
            'dietary_preference' => sanitize_text_field($params['dietaryPreference'] ?? 'Pure Vegetarian'),
            'status' => 'Confirmed',
            'qr_token' => $qr_token,
            'created_at' => current_time('mysql')
        ));

        if ($inserted === false) {
            return new WP_Error('db_insert_error', 'Failed to register delegate in database.', array('status' => 500));
        }

        return rest_ensure_response(array(
            'success' => true,
            'ticketId' => $ticket_id,
            'qrCodeUrl' => 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . urlencode($qr_token),
            'message' => 'Delegate registration successful.'
        ));
    }

    public static function get_registrations($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_registrations';
        $rows = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC LIMIT 100", ARRAY_A);
        return rest_ensure_response(array('success' => true, 'data' => $rows ?: []));
    }

    public static function create_paper($request) {
        global $wpdb;
        $params = $request->get_json_params();

        if (empty($params['paperTitle']) || empty($params['fullName']) || empty($params['abstract'])) {
            return new WP_Error('missing_fields', 'Please provide paper title, full author name, and abstract.', array('status' => 400));
        }

        $table = $wpdb->prefix . 'gujcorr_papers';
        $paper_code = 'GUJ27-PAP-' . strtoupper(wp_generate_password(6, false));

        $inserted = $wpdb->insert($table, array(
            'paper_code' => $paper_code,
            'full_name' => sanitize_text_field($params['fullName']),
            'nationality' => sanitize_text_field($params['nationality'] ?? 'Indian'),
            'gender' => sanitize_text_field($params['gender'] ?? 'Male'),
            'designation' => sanitize_text_field($params['designation'] ?? ''),
            'company_name' => sanitize_text_field($params['companyName'] ?? ''),
            'education' => sanitize_text_field($params['education'] ?? ''),
            'specialization' => sanitize_text_field($params['specialization'] ?? ''),
            'achievements' => sanitize_textarea_field($params['achievements'] ?? ''),
            'memberships' => sanitize_textarea_field($params['memberships'] ?? ''),
            'email' => sanitize_email($params['email']),
            'mobile_number' => sanitize_text_field($params['mobileNumber']),
            'address' => sanitize_textarea_field($params['address'] ?? ''),
            'city' => sanitize_text_field($params['city'] ?? ''),
            'state' => sanitize_text_field($params['state'] ?? ''),
            'country' => sanitize_text_field($params['country'] ?? 'India'),
            'paper_title' => sanitize_text_field($params['paperTitle']),
            'symposium_id' => intval($params['symposiumId'] ?? 1),
            'symposium_title' => sanitize_text_field($params['symposiumTitle'] ?? 'Corrosion Science'),
            'presentation_type' => sanitize_text_field($params['presentationType'] ?? 'Oral'),
            'abstract_text' => sanitize_textarea_field($params['abstract']),
            'keywords' => sanitize_text_field($params['keywords'] ?? ''),
            'co_authors' => sanitize_text_field($params['coAuthors'] ?? ''),
            'status' => 'Submitted',
            'reviewer_score' => 0.00,
            'reviewer_comments' => '',
            'created_at' => current_time('mysql')
        ));

        if ($inserted === false) {
            return new WP_Error('db_insert_error', 'Failed to save paper in database.', array('status' => 500));
        }

        return rest_ensure_response(array(
            'success' => true,
            'paperCode' => $paper_code,
            'message' => 'Abstract submitted successfully.'
        ));
    }

    public static function get_papers($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_papers';
        $rows = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC LIMIT 100", ARRAY_A);
        return rest_ensure_response(array('success' => true, 'data' => $rows ?: []));
    }

    public static function score_paper($request) {
        global $wpdb;
        $params = $request->get_json_params();
        $paper_code = sanitize_text_field($params['paperCode'] ?? '');
        $score = floatval($params['score'] ?? 8.5);
        $comments = sanitize_textarea_field($params['comments'] ?? '');
        $status = sanitize_text_field($params['status'] ?? 'Accepted for Oral Presentation');

        $table = $wpdb->prefix . 'gujcorr_papers';
        $wpdb->update($table, array(
            'reviewer_score' => $score,
            'reviewer_comments' => $comments,
            'status' => $status
        ), array('paper_code' => $paper_code));

        return rest_ensure_response(array('success' => true, 'message' => 'Paper reviewed and scored successfully.'));
    }

    public static function reserve_booth($request) {
        global $wpdb;
        $params = $request->get_json_params();
        $table = $wpdb->prefix . 'gujcorr_booths';

        $inserted = $wpdb->insert($table, array(
            'booth_number' => sanitize_text_field($params['boothNumber']),
            'company_name' => sanitize_text_field($params['companyName']),
            'contact_person' => sanitize_text_field($params['contactPerson']),
            'email' => sanitize_email($params['email']),
            'mobile_number' => sanitize_text_field($params['mobile']),
            'fascia_name' => sanitize_text_field($params['fasciaName'] ?? ''),
            'gstin' => sanitize_text_field($params['gstin'] ?? ''),
            'status' => 'Reserved',
            'created_at' => current_time('mysql')
        ));

        return rest_ensure_response(array('success' => true, 'message' => 'Booth reservation confirmed.'));
    }

    public static function get_booths($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_booths';
        $rows = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC", ARRAY_A);
        return rest_ensure_response(array('success' => true, 'data' => $rows ?: []));
    }

    public static function create_award_nomination($request) {
        global $wpdb;
        $params = $request->get_json_params();
        $table = $wpdb->prefix . 'gujcorr_awards';

        $inserted = $wpdb->insert($table, array(
            'award_category' => sanitize_text_field($params['awardCategory']),
            'nominee_name' => sanitize_text_field($params['nomineeName']),
            'designation' => sanitize_text_field($params['designation']),
            'organization' => sanitize_text_field($params['organization']),
            'email' => sanitize_email($params['email']),
            'mobile' => sanitize_text_field($params['mobile']),
            'citation_summary' => sanitize_textarea_field($params['citationSummary']),
            'status' => 'Pending Review',
            'created_at' => current_time('mysql')
        ));

        return rest_ensure_response(array('success' => true, 'message' => 'Award nomination submitted.'));
    }

    public static function create_invoice($request) {
        global $wpdb;
        $params = $request->get_json_params();
        $table = $wpdb->prefix . 'gujcorr_invoices';
        $inv_number = 'GUJCORR-PI-' . wp_generate_password(5, false, false);

        $inserted = $wpdb->insert($table, array(
            'invoice_number' => $inv_number,
            'invoice_type' => sanitize_text_field($params['invoiceType'] ?? 'PROFORMA INVOICE'),
            'company_name' => sanitize_text_field($params['companyName']),
            'contact_name' => sanitize_text_field($params['contactName']),
            'email' => sanitize_email($params['email']),
            'gstin' => sanitize_text_field($params['gstin'] ?? ''),
            'sac_code' => '998397',
            'tier_name' => sanitize_text_field($params['tierName'] ?? 'Standard'),
            'quantity' => intval($params['quantity'] ?? 1),
            'base_amount' => floatval($params['baseAmount'] ?? 0),
            'cgst_amount' => floatval($params['cgstAmount'] ?? 0),
            'sgst_amount' => floatval($params['sgstAmount'] ?? 0),
            'total_amount' => floatval($params['totalAmount'] ?? 0),
            'payment_status' => 'Unpaid',
            'created_at' => current_time('mysql')
        ));

        return rest_ensure_response(array('success' => true, 'invoiceNumber' => $inv_number));
    }

    public static function create_contact_message($request) {
        global $wpdb;
        $params = $request->get_json_params();
        $table = $wpdb->prefix . 'gujcorr_inquiries';

        $wpdb->insert($table, array(
            'name' => sanitize_text_field($params['name']),
            'email' => sanitize_email($params['email']),
            'phone' => sanitize_text_field($params['phone'] ?? ''),
            'organization' => sanitize_text_field($params['organization'] ?? ''),
            'subject' => sanitize_text_field($params['subject'] ?? 'General Inquiry'),
            'message' => sanitize_textarea_field($params['message']),
            'status' => 'Unread',
            'created_at' => current_time('mysql')
        ));

        return rest_ensure_response(array('success' => true, 'message' => 'Inquiry received.'));
    }

    public static function auth_login($request) {
        $params = $request->get_json_params();
        $email = sanitize_email($params['email'] ?? '');
        $password = $params['password'] ?? '';

        return rest_ensure_response(array(
            'success' => true,
            'user' => array(
                'email' => $email,
                'role' => $params['role'] ?? 'Delegate',
                'fullName' => 'Authenticated Delegate'
            )
        ));
    }

    public static function auth_register($request) {
        $params = $request->get_json_params();
        return rest_ensure_response(array(
            'success' => true,
            'user' => $params
        ));
    }
}
