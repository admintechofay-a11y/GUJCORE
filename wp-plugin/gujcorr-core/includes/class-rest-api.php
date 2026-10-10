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

        register_rest_route($namespace, '/registrations/status', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'update_registration_status'),
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
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'reserve_booth'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/booths', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_booths'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/exhibitors', array(
            'methods' => array('GET', 'POST'),
            'callback' => array(__CLASS__, 'reserve_booth'),
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

        register_rest_route($namespace, '/invoices', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_invoices'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        // 6. Contact Message / Inquiries
        register_rest_route($namespace, '/contact', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'create_contact_message'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/contact', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_contact_messages'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        register_rest_route($namespace, '/inquiries', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_contact_messages'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
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

        // 8. Admin Management Routes
        register_rest_route($namespace, '/admin/overview', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_admin_overview'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        register_rest_route($namespace, '/admin/audit-logs', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_audit_logs'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        register_rest_route($namespace, '/admin/content', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_content'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/admin/content', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'update_content'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        register_rest_route($namespace, '/admin/users', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_admin_users'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));

        register_rest_route($namespace, '/admin/users', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'create_admin_user'),
            'permission_callback' => array(__CLASS__, 'check_admin_permissions')
        ));
    }

    public static function check_admin_permissions($request) {
        if (is_user_logged_in() && current_user_can('manage_options')) {
            return true;
        }

        $api_key = $request->get_header('x-gujcorr-api-key');
        if (empty($api_key)) {
            $auth_header = $request->get_header('authorization');
            if (!empty($auth_header) && preg_match('/Bearer\s+(\S+)/i', $auth_header, $matches)) {
                $api_key = $matches[1];
            }
        }

        $secret = defined('GUJCORR_API_SECRET') ? GUJCORR_API_SECRET : get_option('gujcorr_api_secret', '');
        if (!empty($api_key) && !empty($secret) && hash_equals($secret, $api_key)) {
            return true;
        }

        return new WP_Error(
            'rest_forbidden',
            __('Access denied: Valid administrative credentials or API secret required.', 'gujcorr'),
            array('status' => 403)
        );
    }

    // 1. Delegate Registration Handlers
    public static function create_registration($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;

        if (empty($params['fullName']) || empty($params['email']) || empty($params['mobileNumber'])) {
            return new WP_Error('missing_fields', 'Please provide full name, email, and mobile number.', array('status' => 400));
        }

        $table = $wpdb->prefix . 'gujcorr_registrations';
        $ticket_id = sanitize_text_field($params['ticketId'] ?? ('GUJ27-DEL-' . strtoupper(wp_generate_password(6, false))));
        $base_amount = floatval($params['baseAmount'] ?? 4000);
        $gst_amount = floatval($params['gstAmount'] ?? 720);
        $total_amount = floatval($params['totalAmount'] ?? ($base_amount + $gst_amount));
        $qr_token = 'GUJCORR2027:' . $ticket_id;
        $status = sanitize_text_field($params['status'] ?? 'Confirmed');

        $inserted = $wpdb->replace($table, array(
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
            'transaction_ref' => sanitize_text_field($params['transactionReference'] ?? $params['transactionRef'] ?? ''),
            'dietary_preference' => sanitize_text_field($params['dietaryPreference'] ?? 'Pure Vegetarian'),
            'status' => $status,
            'payment_proof_url' => sanitize_text_field($params['paymentProofFileName'] ?? $params['paymentProofUrl'] ?? ''),
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
            'message' => 'Delegate registration saved in database.'
        ));
    }

    public static function get_registrations($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_registrations';
        $rows = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC LIMIT 200", ARRAY_A);

        $formatted = array();
        if ($rows) {
            foreach ($rows as $r) {
                $formatted[] = array(
                    'id' => $r['ticket_id'],
                    'ticketId' => $r['ticket_id'],
                    'ticket_id' => $r['ticket_id'],
                    'fullName' => $r['full_name'],
                    'full_name' => $r['full_name'],
                    'email' => $r['email'],
                    'mobileNumber' => $r['mobile_number'],
                    'mobile_number' => $r['mobile_number'],
                    'organization' => $r['organization'],
                    'designation' => $r['designation'],
                    'category' => $r['category'],
                    'totalAmount' => floatval($r['total_amount']),
                    'total_amount' => floatval($r['total_amount']),
                    'baseAmount' => floatval($r['base_amount']),
                    'gstAmount' => floatval($r['gst_amount']),
                    'paymentMethod' => $r['payment_method'],
                    'transactionRef' => $r['transaction_ref'],
                    'status' => $r['status'],
                    'registrationDate' => $r['created_at'],
                    'created_at' => $r['created_at']
                );
            }
        }

        return rest_ensure_response(array('success' => true, 'data' => $formatted));
    }

    public static function update_registration_status($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $ticket_id = sanitize_text_field($params['ticketId'] ?? '');
        $status = sanitize_text_field($params['status'] ?? 'Confirmed');

        $table = $wpdb->prefix . 'gujcorr_registrations';
        $wpdb->update($table, array('status' => $status), array('ticket_id' => $ticket_id));

        self::log_audit('UPDATE_REGISTRATION_STATUS', 'Registration', $ticket_id, "Status updated to: $status");

        return rest_ensure_response(array('success' => true, 'message' => 'Status updated in database.'));
    }

    // 2. Paper Submission Handlers
    public static function create_paper($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;

        if (empty($params['paperTitle']) || empty($params['fullName']) || empty($params['abstract'])) {
            return new WP_Error('missing_fields', 'Please provide paper title, full author name, and abstract.', array('status' => 400));
        }

        $table = $wpdb->prefix . 'gujcorr_papers';
        $paper_code = sanitize_text_field($params['paperCode'] ?? $params['id'] ?? ('GUJ27-PAP-' . strtoupper(wp_generate_password(6, false))));

        $inserted = $wpdb->replace($table, array(
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
            'is_presenting_author' => isset($params['isPresentingAuthor']) ? ($params['isPresentingAuthor'] ? 1 : 0) : 1,
            'status' => sanitize_text_field($params['status'] ?? 'Submitted'),
            'reviewer_score' => floatval($params['reviewScore'] ?? 0.00),
            'reviewer_comments' => sanitize_textarea_field($params['reviewComments'] ?? ''),
            'created_at' => current_time('mysql')
        ));

        if ($inserted === false) {
            return new WP_Error('db_insert_error', 'Failed to save paper in database.', array('status' => 500));
        }

        self::log_audit('CREATE_PAPER_SUBMISSION', 'Paper', $paper_code, 'Paper abstract submitted: ' . sanitize_text_field($params['paperTitle']), sanitize_email($params['email']));

        return rest_ensure_response(array(
            'success' => true,
            'paperCode' => $paper_code,
            'message' => 'Abstract submitted successfully.'
        ));
    }

    public static function get_papers($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_papers';
        $rows = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC LIMIT 200", ARRAY_A);

        $formatted = array();
        if ($rows) {
            foreach ($rows as $p) {
                $formatted[] = array(
                    'id' => $p['paper_code'],
                    'paperCode' => $p['paper_code'],
                    'paper_code' => $p['paper_code'],
                    'fullName' => $p['full_name'],
                    'full_name' => $p['full_name'],
                    'email' => $p['email'],
                    'mobileNumber' => $p['mobile_number'],
                    'mobile_number' => $p['mobile_number'],
                    'companyName' => $p['company_name'],
                    'company_name' => $p['company_name'],
                    'paperTitle' => $p['paper_title'],
                    'paper_title' => $p['paper_title'],
                    'symposiumId' => intval($p['symposium_id']),
                    'symposiumTitle' => $p['symposium_title'],
                    'symposium_title' => $p['symposium_title'],
                    'presentationType' => $p['presentation_type'],
                    'presentation_type' => $p['presentation_type'],
                    'abstract' => $p['abstract_text'],
                    'abstract_text' => $p['abstract_text'],
                    'status' => $p['status'],
                    'reviewScore' => floatval($p['reviewer_score']),
                    'reviewer_score' => floatval($p['reviewer_score']),
                    'reviewComments' => $p['reviewer_comments'],
                    'reviewer_comments' => $p['reviewer_comments'],
                    'submittedAt' => $p['created_at'],
                    'created_at' => $p['created_at']
                );
            }
        }

        return rest_ensure_response(array('success' => true, 'data' => $formatted));
    }

    public static function score_paper($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $paper_code = sanitize_text_field($params['paperCode'] ?? $params['id'] ?? '');
        $score = floatval($params['score'] ?? $params['reviewScore'] ?? 8.5);
        $comments = sanitize_textarea_field($params['comments'] ?? $params['reviewComments'] ?? '');
        $status = sanitize_text_field($params['status'] ?? 'Accepted for Oral Presentation');

        $table = $wpdb->prefix . 'gujcorr_papers';
        $wpdb->update($table, array(
            'reviewer_score' => $score,
            'reviewer_comments' => $comments,
            'status' => $status
        ), array('paper_code' => $paper_code));

        self::log_audit('SCORE_PAPER', 'Paper', $paper_code, "Paper scored: $score, Status: $status");

        return rest_ensure_response(array('success' => true, 'message' => 'Paper reviewed and scored successfully.'));
    }

    // 3. Exhibition Booth Handlers
    public static function reserve_booth($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $table = $wpdb->prefix . 'gujcorr_booths';

        $booth_number = sanitize_text_field($params['boothNumber'] ?? $params['stallNumber'] ?? $params['preferredBooth'] ?? 'S-01');
        $company_name = sanitize_text_field($params['companyName'] ?? '');
        $contact_person = sanitize_text_field($params['contactPerson'] ?? '');
        $designation = sanitize_text_field($params['designation'] ?? '');
        $email = sanitize_email($params['email'] ?? '');
        $mobile = sanitize_text_field($params['mobile'] ?? $params['mobileNumber'] ?? '');
        $fascia_name = sanitize_text_field($params['fasciaName'] ?? strtoupper($company_name));
        $gstin = sanitize_text_field($params['gstin'] ?? '');
        $booth_size = sanitize_text_field($params['boothSize'] ?? $params['stallType'] ?? '9 sqm');
        $area_sqm = intval($params['areaSqm'] ?? (strpos($booth_size, '12') !== false ? 12 : 9));
        $dimensions = sanitize_text_field($params['dimensions'] ?? ($area_sqm == 12 ? '3m x 4m' : '3m x 3m'));
        $type = sanitize_text_field($params['type'] ?? ('Exhibition Booth (' . $booth_size . ')'));
        $base_price = floatval($params['basePrice'] ?? ($area_sqm == 12 ? 75000 : 50000));
        $gst_amount = floatval($params['gstAmount'] ?? ($base_price * 0.18));
        $total_price = floatval($params['totalPrice'] ?? ($base_price + $gst_amount));
        $status = sanitize_text_field($params['status'] ?? $params['paymentStatus'] ?? 'Reserved');

        $booth_data = array(
            'booth_number' => $booth_number,
            'company_name' => $company_name,
            'contact_person' => $contact_person,
            'designation' => $designation,
            'email' => $email,
            'mobile_number' => $mobile,
            'fascia_name' => $fascia_name,
            'gstin' => $gstin,
            'booth_size' => $booth_size,
            'type' => $type,
            'area_sqm' => $area_sqm,
            'dimensions' => $dimensions,
            'base_price' => $base_price,
            'gst_amount' => $gst_amount,
            'total_price' => $total_price,
            'status' => $status,
            'created_at' => current_time('mysql')
        );

        $existing_id = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE booth_number = %s", $booth_number));
        if ($existing_id) {
            unset($booth_data['created_at']);
            $wpdb->update($table, $booth_data, array('id' => $existing_id));
        } else {
            $wpdb->insert($table, $booth_data);
        }

        self::log_audit('RESERVE_BOOTH', 'Booth', $booth_number, "Reserved by $company_name ($status)", $email);

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Booth reservation saved in database.',
            'data' => array(
                'boothNumber' => $booth_number,
                'companyName' => $company_name,
                'status' => $status
            )
        ));
    }

    public static function get_booths($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_booths';
        $rows = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC LIMIT 100", ARRAY_A);

        $formatted = array();
        if ($rows) {
            foreach ($rows as $b) {
                $formatted[] = array(
                    'id' => $b['id'],
                    'stallNumber' => $b['booth_number'],
                    'booth_number' => $b['booth_number'],
                    'companyName' => $b['company_name'],
                    'company_name' => $b['company_name'],
                    'contactPerson' => $b['contact_person'],
                    'contact_person' => $b['contact_person'],
                    'designation' => $b['designation'],
                    'email' => $b['email'],
                    'mobile' => $b['mobile_number'],
                    'mobile_number' => $b['mobile_number'],
                    'fasciaName' => $b['fascia_name'],
                    'fascia_name' => $b['fascia_name'],
                    'gstin' => $b['gstin'],
                    'stallType' => $b['booth_size'],
                    'booth_size' => $b['booth_size'],
                    'basePrice' => floatval($b['base_price']),
                    'gstAmount' => floatval($b['gst_amount']),
                    'totalPrice' => floatval($b['total_price']),
                    'total_price' => floatval($b['total_price']),
                    'status' => $b['status'],
                    'paymentStatus' => $b['status'],
                    'bookedAt' => $b['created_at'],
                    'created_at' => $b['created_at']
                );
            }
        }

        return rest_ensure_response(array('success' => true, 'data' => $formatted));
    }

    // 4. Awards Nomination
    public static function create_award_nomination($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $table = $wpdb->prefix . 'gujcorr_awards';

        $wpdb->insert($table, array(
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

        self::log_audit('CREATE_AWARD_NOMINATION', 'Award', sanitize_text_field($params['awardCategory']), 'Nominee: ' . sanitize_text_field($params['nomineeName']), sanitize_email($params['email']));

        return rest_ensure_response(array('success' => true, 'message' => 'Award nomination submitted.'));
    }

    // 5. Invoices
    public static function create_invoice($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $table = $wpdb->prefix . 'gujcorr_invoices';
        $inv_number = 'GUJCORR-PI-' . wp_generate_password(5, false, false);

        $wpdb->insert($table, array(
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

        self::log_audit('CREATE_INVOICE', 'Invoice', $inv_number, 'Created invoice for ' . sanitize_text_field($params['companyName']), sanitize_email($params['email']));

        return rest_ensure_response(array('success' => true, 'invoiceNumber' => $inv_number));
    }

    // 6. Contact Inquiries Handlers
    public static function create_contact_message($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
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

        self::log_audit('CREATE_CONTACT_MESSAGE', 'Inquiry', sanitize_email($params['email']), 'Subject: ' . sanitize_text_field($params['subject'] ?? 'General Inquiry'), sanitize_email($params['email']));

        return rest_ensure_response(array('success' => true, 'message' => 'Inquiry received.'));
    }

    public static function get_contact_messages($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_inquiries';
        $rows = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC LIMIT 100", ARRAY_A);

        $formatted = array();
        if ($rows) {
            foreach ($rows as $m) {
                $formatted[] = array(
                    'id' => $m['id'],
                    'name' => $m['name'],
                    'email' => $m['email'],
                    'phone' => $m['phone'],
                    'organization' => $m['organization'],
                    'subject' => $m['subject'],
                    'message' => $m['message'],
                    'status' => $m['status'],
                    'submittedAt' => $m['created_at'],
                    'created_at' => $m['created_at']
                );
            }
        }

        return rest_ensure_response(array('success' => true, 'data' => $formatted));
    }

    // 7. Admin Overview & Dashboard Analytics
    public static function get_admin_overview($request) {
        global $wpdb;
        $table_reg = $wpdb->prefix . 'gujcorr_registrations';
        $table_papers = $wpdb->prefix . 'gujcorr_papers';
        $table_booths = $wpdb->prefix . 'gujcorr_booths';
        $table_invoices = $wpdb->prefix . 'gujcorr_invoices';
        $table_inquiries = $wpdb->prefix . 'gujcorr_inquiries';
        $table_awards = $wpdb->prefix . 'gujcorr_awards';
        $table_audit = $wpdb->prefix . 'gujcorr_audit_logs';

        $total_reg = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_reg") ?: 0);
        $confirmed_reg = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_reg WHERE status = 'Confirmed'") ?: 0);
        $pending_reg = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_reg WHERE status = 'Pending'") ?: 0);
        $verified_revenue = floatval($wpdb->get_var("SELECT SUM(total_amount) FROM $table_reg WHERE status = 'Confirmed'") ?: 0.0);
        $outstanding_revenue = floatval($wpdb->get_var("SELECT SUM(total_amount) FROM $table_reg WHERE status = 'Pending'") ?: 0.0);

        $categories_breakdown = $wpdb->get_results("SELECT category, COUNT(*) as count, SUM(total_amount) as revenue FROM $table_reg GROUP BY category", ARRAY_A) ?: array();

        $total_papers = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_papers") ?: 0);
        $papers_accepted = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_papers WHERE status LIKE '%Accept%'") ?: 0);
        $papers_pending = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_papers WHERE status = 'Submitted' OR status = 'Under Review'") ?: 0);
        $papers_rejected = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_papers WHERE status LIKE '%Reject%'") ?: 0);

        $total_booths_booked = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_booths") ?: 0);
        $total_booth_capacity = 42;
        $total_booth_revenue = floatval($wpdb->get_var("SELECT SUM(total_price) FROM $table_booths WHERE status = 'Confirmed'") ?: 0.0);

        $total_inquiries = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_inquiries") ?: 0);
        $unread_inquiries = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_inquiries WHERE status = 'Unread'") ?: 0);

        $total_invoices = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_invoices") ?: 0);
        $total_awards = intval($wpdb->get_var("SELECT COUNT(*) FROM $table_awards") ?: 0);

        $recent_activity = $wpdb->get_results("SELECT * FROM $table_audit ORDER BY created_at DESC LIMIT 10", ARRAY_A) ?: array();

        return rest_ensure_response(array(
            'success' => true,
            'overview' => array(
                'registrations' => array(
                    'total' => $total_reg,
                    'confirmed' => $confirmed_reg,
                    'pending' => $pending_reg,
                    'verifiedRevenue' => $verified_revenue,
                    'outstandingRevenue' => $outstanding_revenue,
                    'categories' => $categories_breakdown
                ),
                'papers' => array(
                    'total' => $total_papers,
                    'accepted' => $papers_accepted,
                    'pendingReview' => $papers_pending,
                    'rejected' => $papers_rejected
                ),
                'exhibition' => array(
                    'booked' => $total_booths_booked,
                    'totalCapacity' => $total_booth_capacity,
                    'available' => max(0, $total_booth_capacity - $total_booths_booked),
                    'revenue' => $total_booth_revenue
                ),
                'inquiries' => array(
                    'total' => $total_inquiries,
                    'unread' => $unread_inquiries
                ),
                'invoices' => array(
                    'total' => $total_invoices
                ),
                'awards' => array(
                    'total' => $total_awards
                ),
                'recentActivity' => $recent_activity
            )
        ));
    }

    // 8. Audit Logs
    public static function get_audit_logs($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_audit_logs';
        $rows = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC LIMIT 200", ARRAY_A) ?: array();
        return rest_ensure_response(array('success' => true, 'data' => $rows));
    }

    // 9. Content CMS Handlers
    public static function get_content($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_content';
        $rows = $wpdb->get_results("SELECT section_key, content_json, updated_at FROM $table", ARRAY_A);
        $content = array();
        if ($rows) {
            foreach ($rows as $r) {
                $content[$r['section_key']] = json_decode($r['content_json'], true);
            }
        }
        return rest_ensure_response(array('success' => true, 'data' => $content));
    }

    public static function update_content($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $section_key = sanitize_text_field($params['sectionKey'] ?? '');
        $content_data = $params['content'] ?? null;

        if (empty($section_key) || $content_data === null) {
            return new WP_Error('invalid_data', 'sectionKey and content are required.', array('status' => 400));
        }

        $table = $wpdb->prefix . 'gujcorr_content';
        $json = wp_json_encode($content_data);
        $user_email = is_user_logged_in() ? wp_get_current_user()->user_email : 'admin@gujcorr.org';

        $wpdb->replace($table, array(
            'section_key' => $section_key,
            'content_json' => $json,
            'updated_by' => $user_email,
            'updated_at' => current_time('mysql')
        ));

        self::log_audit('UPDATE_CONTENT', 'CMS_Content', $section_key, "Updated section: $section_key", $user_email);

        return rest_ensure_response(array('success' => true, 'message' => "Content for '$section_key' updated."));
    }

    // 10. Admin Users & Roles
    public static function get_admin_users($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_users';
        $rows = $wpdb->get_results("SELECT id, username, email, full_name, role, status, last_login, created_at FROM $table ORDER BY created_at DESC", ARRAY_A) ?: array();
        return rest_ensure_response(array('success' => true, 'data' => $rows));
    }

    public static function create_admin_user($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $email = sanitize_email($params['email'] ?? '');
        $username = sanitize_user($params['username'] ?? strstr($email, '@', true));
        $full_name = sanitize_text_field($params['fullName'] ?? $params['name'] ?? 'Staff Member');
        $password = $params['password'] ?? '';
        $role = sanitize_text_field($params['role'] ?? 'Secretariat Staff');

        if (empty($email) || empty($password)) {
            return new WP_Error('invalid_data', 'Email and password are required.', array('status' => 400));
        }

        $valid_roles = array(
            'Super Administrator', 'Administrator', 'Secretariat Staff',
            'Finance Staff', 'Paper Coordinator', 'Reviewer', 'Content Editor'
        );
        if (!in_array($role, $valid_roles)) {
            $role = 'Secretariat Staff';
        }

        $table = $wpdb->prefix . 'gujcorr_users';
        $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE email = %s OR username = %s", $email, $username));
        if ($exists) {
            return new WP_Error('user_exists', 'A user with this email or username already exists.', array('status' => 400));
        }

        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $wpdb->insert($table, array(
            'username' => $username,
            'email' => $email,
            'password_hash' => $password_hash,
            'full_name' => $full_name,
            'role' => $role,
            'status' => 'Active',
            'created_at' => current_time('mysql')
        ));

        self::log_audit('CREATE_STAFF_ACCOUNT', 'User', $email, "Created account with role: $role");

        return rest_ensure_response(array('success' => true, 'message' => "User account created for $email"));
    }

    // 11. Central Audit Logger Helper
    public static function log_audit($action, $resource_type, $resource_id = '', $details = '', $user_email = '', $status = 'Success') {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_audit_logs';
        if (empty($user_email)) {
            $user_email = is_user_logged_in() ? wp_get_current_user()->user_email : 'system@gujcorr.org';
        }
        $wpdb->insert($table, array(
            'user_id' => is_user_logged_in() ? strval(get_current_user_id()) : 'api',
            'user_email' => $user_email,
            'action' => sanitize_text_field($action),
            'resource_type' => sanitize_text_field($resource_type),
            'resource_id' => sanitize_text_field($resource_id),
            'details' => is_array($details) ? wp_json_encode($details) : sanitize_textarea_field($details),
            'ip_address' => sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? ''),
            'status' => sanitize_text_field($status),
            'created_at' => current_time('mysql')
        ));
    }

    // 12. Secure Auth Login & Register
    public static function auth_login($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $email = sanitize_email($params['email'] ?? '');
        $password = $params['password'] ?? '';

        if (empty($email) || empty($password)) {
            return new WP_Error('invalid_credentials', 'Email and password are required.', array('status' => 400));
        }

        $table = $wpdb->prefix . 'gujcorr_users';
        $user_row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE email = %s OR username = %s", $email, $email), ARRAY_A);

        if ($user_row) {
            $is_valid = false;
            if (password_verify($password, $user_row['password_hash'])) {
                $is_valid = true;
            } elseif (strpos($user_row['password_hash'], 'pbkdf2:') === 0) {
                // Support PBKDF2 hashes from Next.js frontend
                $parts = explode(':', $user_row['password_hash']);
                if (count($parts) === 3) {
                    $salt = $parts[1];
                    $expected = $parts[2];
                    $calculated = hash_pbkdf2('sha512', $password, $salt, 10000, 128);
                    if (hash_equals($expected, $calculated)) {
                        $is_valid = true;
                    }
                }
            }

            if ($is_valid) {
                if ($user_row['status'] !== 'Active') {
                    return new WP_Error('account_disabled', 'Account is deactivated. Contact Super Administrator.', array('status' => 403));
                }

            $wpdb->update($table, array('last_login' => current_time('mysql')), array('id' => $user_row['id']));
            self::log_audit('LOGIN_SUCCESS', 'Auth', $user_row['email'], "Role: " . $user_row['role'], $user_row['email']);

            return rest_ensure_response(array(
                'success' => true,
                'user' => array(
                    'id' => $user_row['id'],
                    'email' => $user_row['email'],
                    'fullName' => $user_row['full_name'],
                    'role' => $user_row['role'],
                    'status' => $user_row['status']
                )
            ));
        }

        if (function_exists('wp_authenticate')) {
            $wp_user = wp_authenticate($email, $password);
            if (!is_wp_error($wp_user)) {
                $role = in_array('administrator', (array)$wp_user->roles) ? 'Super Administrator' : 'Delegate';
                self::log_audit('LOGIN_SUCCESS_WP', 'Auth', $wp_user->user_email, "Role: $role", $wp_user->user_email);
                return rest_ensure_response(array(
                    'success' => true,
                    'user' => array(
                        'id' => $wp_user->ID,
                        'email' => $wp_user->user_email,
                        'fullName' => $wp_user->display_name,
                        'role' => $role,
                        'status' => 'Active'
                    )
                ));
            }
        }

        self::log_audit('LOGIN_FAILED', 'Auth', $email, 'Invalid password attempt', $email, 'Failed');
        return new WP_Error('invalid_credentials', 'Invalid credentials provided.', array('status' => 401));
    }

    public static function auth_register($request) {
        global $wpdb;
        $params = $request->get_json_params() ?: $_POST;
        $email = sanitize_email($params['email'] ?? '');
        $password = $params['password'] ?? '';
        $full_name = sanitize_text_field($params['fullName'] ?? $params['name'] ?? '');

        if (empty($email) || empty($password)) {
            return new WP_Error('missing_fields', 'Email and password required.', array('status' => 400));
        }

        $table = $wpdb->prefix . 'gujcorr_users';
        $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE email = %s", $email));
        if ($exists) {
            return new WP_Error('user_exists', 'Account with this email already exists.', array('status' => 400));
        }

        $assigned_role = 'Delegate';
        $username = sanitize_user(strstr($email, '@', true) ?: ('user_' . wp_generate_password(4, false)));
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $wpdb->insert($table, array(
            'username' => $username,
            'email' => $email,
            'password_hash' => $password_hash,
            'full_name' => $full_name,
            'role' => $assigned_role,
            'status' => 'Active',
            'created_at' => current_time('mysql')
        ));

        self::log_audit('USER_REGISTERED', 'Auth', $email, 'Public registration as Delegate', $email);

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Registration successful.',
            'user' => array(
                'email' => $email,
                'fullName' => $full_name,
                'role' => $assigned_role
            )
        ));
    }
}
