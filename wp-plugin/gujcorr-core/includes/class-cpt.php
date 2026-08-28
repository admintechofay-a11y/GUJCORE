<?php
if (!defined('ABSPATH')) {
    exit;
}

class GUJCORR_CPT {

    public static function init() {
        add_action('init', array(__CLASS__, 'register_post_types'));
    }

    public static function register_post_types() {
        // 1. Speakers CPT
        register_post_type('gujcorr_speaker', array(
            'labels' => array(
                'name' => __('Speakers', 'gujcorr'),
                'singular_name' => __('Speaker', 'gujcorr'),
                'add_new' => __('Add New Speaker', 'gujcorr'),
                'add_new_item' => __('Add New Speaker', 'gujcorr'),
                'edit_item' => __('Edit Speaker', 'gujcorr'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-megaphone',
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields')
        ));

        // 2. Technical Sessions & Symposia CPT
        register_post_type('gujcorr_session', array(
            'labels' => array(
                'name' => __('Technical Symposia', 'gujcorr'),
                'singular_name' => __('Symposium', 'gujcorr'),
                'add_new' => __('Add New Symposium', 'gujcorr'),
                'edit_item' => __('Edit Symposium', 'gujcorr'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-welcome-learn-more',
            'supports' => array('title', 'editor', 'custom-fields')
        ));

        // 3. Sponsors CPT
        register_post_type('gujcorr_sponsor', array(
            'labels' => array(
                'name' => __('Sponsors', 'gujcorr'),
                'singular_name' => __('Sponsor', 'gujcorr'),
                'add_new' => __('Add New Sponsor', 'gujcorr'),
                'edit_item' => __('Edit Sponsor', 'gujcorr'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-awards',
            'supports' => array('title', 'thumbnail', 'custom-fields')
        ));

        // 4. Awards CPT
        register_post_type('gujcorr_award', array(
            'labels' => array(
                'name' => __('Awards', 'gujcorr'),
                'singular_name' => __('Award', 'gujcorr'),
                'add_new' => __('Add New Award', 'gujcorr'),
                'edit_item' => __('Edit Award', 'gujcorr'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-star-filled',
            'supports' => array('title', 'editor', 'custom-fields')
        ));
    }
}
