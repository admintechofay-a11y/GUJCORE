<?php
/**
 * Plugin Name: GUJCORR 2027 Core Engine
 * Plugin URI: https://www.amppgujarat.org/gujcorr2027
 * Description: Complete headless CMS backend, MySQL database schema, REST API endpoints, and event management dashboard for GUJCORR 2027 (AMPP Gujarat Global Conference & Expo on Corrosion).
 * Version: 1.0.0
 * Author: AMPP Gujarat Chapter & IIM Baroda Chapter
 * Author URI: https://www.iimbaroda.com
 * Text Domain: gujcorr
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('GUJCORR_VERSION', '1.0.0');
define('GUJCORR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GUJCORR_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include required classes
require_once GUJCORR_PLUGIN_DIR . 'includes/class-db.php';
require_once GUJCORR_PLUGIN_DIR . 'includes/class-cpt.php';
require_once GUJCORR_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once GUJCORR_PLUGIN_DIR . 'includes/class-admin.php';

/**
 * Main Plugin Class
 */
class GUJCORR_Core {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Register activation and deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));

        // Initialize components
        add_action('plugins_loaded', array($this, 'init'));
        add_action('init', array($this, 'handle_cors'));
    }

    public function activate() {
        GUJCORR_DB::create_tables();
        GUJCORR_CPT::register_post_types();
        flush_rewrite_rules();
    }

    public function deactivate() {
        flush_rewrite_rules();
    }

    public function init() {
        GUJCORR_CPT::init();
        GUJCORR_REST_API::init();
        GUJCORR_Admin::init();
    }

    /**
     * Enable Cross-Origin Resource Sharing (CORS) for Next.js frontend
     */
    public function handle_cors() {
        add_action('rest_api_init', function () {
            remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
            add_filter('rest_pre_serve_request', function ($value) {
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, X-Requested-With');
                return $value;
            });
        }, 15);
    }
}

// Instantiate plugin
GUJCORR_Core::get_instance();
