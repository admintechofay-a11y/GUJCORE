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
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/registrations/status', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'update_registration_status'),
            'permission_callback' => '__return_true'
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
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/papers/score', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'score_paper'),
            'permission_callback' => '__return_true'
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

        // 6. Contact Message / Inquiries
        register_rest_route($namespace, '/contact', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'create_contact_message'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/contact', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_contact_messages'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($namespace, '/inquiries', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_contact_messages'),
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
        return true;
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
            'status' => sanitize_text_field($params['status'] ?? 'Submitted'),
            'reviewer_score' => floatval($params['reviewScore'] ?? 0.00),
            'reviewer_comments' => sanitize_textarea_field($params['reviewComments'] ?? ''),
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
        $base_price = floatval($params['basePrice'] ?? 95000);
        $gst_amount = floatval($params['gstAmount'] ?? 17100);
        $total_price = floatval($params['totalPrice'] ?? 112100);
        $status = sanitize_text_field($params['status'] ?? $params['paymentStatus'] ?? 'Reserved');

        $inserted = $wpdb->insert($table, array(
            'booth_number' => $booth_number,
            'company_name' => $company_name,
            'contact_person' => $contact_person,
            'designation' => $designation,
            'email' => $email,
            'mobile_number' => $mobile,
            'fascia_name' => $fascia_name,
            'gstin' => $gstin,
            'booth_size' => $booth_size,
            'base_price' => $base_price,
            'gst_amount' => $gst_amount,
            'total_price' => $total_price,
            'status' => $status,
            'created_at' => current_time('mysql')
        ));

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

    public static function auth_login($request) {
        $params = $request->get_json_params() ?: $_POST;
        $email = sanitize_email($params['email'] ?? '');

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
        $params = $request->get_json_params() ?: $_POST;
        return rest_ensure_response(array(
            'success' => true,
            'user' => $params
        ));
    }
}
