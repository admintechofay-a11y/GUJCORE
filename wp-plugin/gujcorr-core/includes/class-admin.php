<?php
if (!defined('ABSPATH')) {
    exit;
}

class GUJCORR_Admin {

    public static function init() {
        add_action('admin_menu', array(__CLASS__, 'register_admin_menus'));
    }

    public static function register_admin_menus() {
        add_menu_page(
            __('GUJCORR 2027', 'gujcorr'),
            __('GUJCORR 2027', 'gujcorr'),
            'manage_options',
            'gujcorr-dashboard',
            array(__CLASS__, 'render_dashboard'),
            'dashicons-shield',
            3
        );

        add_submenu_page(
            'gujcorr-dashboard',
            __('Delegates & Registrations', 'gujcorr'),
            __('Delegates', 'gujcorr'),
            'manage_options',
            'gujcorr-delegates',
            array(__CLASS__, 'render_delegates')
        );

        add_submenu_page(
            'gujcorr-dashboard',
            __('Papers & Abstracts', 'gujcorr'),
            __('Papers / CFP', 'gujcorr'),
            'manage_options',
            'gujcorr-papers',
            array(__CLASS__, 'render_papers')
        );

        add_submenu_page(
            'gujcorr-dashboard',
            __('Exhibitors & Booths', 'gujcorr'),
            __('Exhibition', 'gujcorr'),
            'manage_options',
            'gujcorr-exhibitors',
            array(__CLASS__, 'render_exhibitors')
        );
    }

    public static function render_dashboard() {
        global $wpdb;
        $table_reg = $wpdb->prefix . 'gujcorr_registrations';
        $table_papers = $wpdb->prefix . 'gujcorr_papers';
        $table_booths = $wpdb->prefix . 'gujcorr_booths';

        $total_delegates = $wpdb->get_var("SELECT COUNT(*) FROM $table_reg") ?: 0;
        $total_revenue = $wpdb->get_var("SELECT SUM(total_amount) FROM $table_reg") ?: 0;
        $total_papers = $wpdb->get_var("SELECT COUNT(*) FROM $table_papers") ?: 0;
        $total_booths = $wpdb->get_var("SELECT COUNT(*) FROM $table_booths") ?: 0;
        ?>
        <div class="wrap" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h1 style="display:flex; align-items:center; gap:10px; font-weight:800; color:#0f172a;">
                <span style="background:#dc2626; color:#fff; padding:4px 10px; border-radius:8px; font-size:16px;">GUJCORR</span>
                2027 Conference Executive Dashboard
            </h1>
            <p style="color:#64748b; font-size:14px;">AMPP Gujarat Chapter &amp; IIM Baroda Chapter &bull; Vadodara, Gujarat</p>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin:24px 0;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-size:11px; text-transform:uppercase; font-weight:700; color:#64748b;">Total Registered Delegates</div>
                    <div style="font-size:32px; font-weight:900; color:#0f172a; margin-top:6px;"><?php echo esc_html($total_delegates); ?></div>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-size:11px; text-transform:uppercase; font-weight:700; color:#64748b;">Registration Revenue (with 18% GST)</div>
                    <div style="font-size:32px; font-weight:900; color:#0d9488; margin-top:6px;">₹<?php echo esc_html(number_format($total_revenue, 2)); ?></div>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-size:11px; text-transform:uppercase; font-weight:700; color:#64748b;">Papers / Abstracts Submitted</div>
                    <div style="font-size:32px; font-weight:900; color:#dc2626; margin-top:6px;"><?php echo esc_html($total_papers); ?></div>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-size:11px; text-transform:uppercase; font-weight:700; color:#64748b;">Exhibition Space Inquiries</div>
                    <div style="font-size:32px; font-weight:900; color:#d97706; margin-top:6px;"><?php echo esc_html($total_booths); ?></div>
                </div>
            </div>

            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05); margin-top:20px;">
                <h3 style="margin-top:0; font-size:16px; font-weight:700;">Conference Information &amp; Official Tariff</h3>
                <table class="widefat striped" style="margin-top:12px;">
                    <tbody>
                        <tr><td><strong>Conference Name:</strong></td><td>GUJCORR 2027 – AMPP Gujarat Global Conference &amp; Expo on Corrosion</td></tr>
                        <tr><td><strong>Dates:</strong></td><td>18th – 20th February 2027 (Vadodara, Gujarat)</td></tr>
                        <tr><td><strong>Member Pass (IIM / AMPP):</strong></td><td>₹4,720 (₹4,000 + ₹720 18% GST)</td></tr>
                        <tr><td><strong>Non-Member Pass:</strong></td><td>₹7,670 (₹6,500 + ₹1,170 18% GST)</td></tr>
                        <tr><td><strong>Student Pass:</strong></td><td>₹1,770 (₹1,500 + ₹270 18% GST)</td></tr>
                        <tr><td><strong>Bank Account:</strong></td><td>Union Bank of India, Dandia Bazar, Vadodara | A/C 520101234030441 | IFSC UBIN0901555</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <?php
    }

    public static function render_delegates() {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_registrations';
        $results = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC LIMIT 50");
        ?>
        <div class="wrap">
            <h1 style="font-weight:800;">Registered Delegates</h1>
            <table class="wp-list-table widefat fixed striped" style="margin-top:16px;">
                <thead>
                    <tr>
                        <th style="width:110px;">Ticket ID</th>
                        <th>Delegate Name</th>
                        <th>Category</th>
                        <th>Organization</th>
                        <th>Email / Mobile</th>
                        <th>Total Paid (INR)</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($results)) : ?>
                        <tr><td colspan="8" style="text-align:center; padding:24px;">No delegates registered yet.</td></tr>
                    <?php else: foreach ($results as $r) : ?>
                        <tr>
                            <td><strong style="font-family:monospace; color:#dc2626;"><?php echo esc_html($r->ticket_id); ?></strong></td>
                            <td><strong><?php echo esc_html($r->full_name); ?></strong><br/><small style="color:#64748b;"><?php echo esc_html($r->designation); ?></small></td>
                            <td><?php echo esc_html($r->category); ?></td>
                            <td><?php echo esc_html($r->organization); ?></td>
                            <td><?php echo esc_html($r->email); ?><br/><small><?php echo esc_html($r->mobile_number); ?></small></td>
                            <td><strong>₹<?php echo esc_html(number_format($r->total_amount, 2)); ?></strong></td>
                            <td><span style="background:#dcfce7; color:#166534; padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px;"><?php echo esc_html($r->status); ?></span></td>
                            <td><?php echo esc_html($r->created_at); ?></td>
                        </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public static function render_papers() {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_papers';
        $results = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC LIMIT 50");
        ?>
        <div class="wrap">
            <h1 style="font-weight:800;">Submitted Technical Papers / Abstracts</h1>
            <table class="wp-list-table widefat fixed striped" style="margin-top:16px;">
                <thead>
                    <tr>
                        <th style="width:90px;">Paper ID</th>
                        <th>Author Name</th>
                        <th>Paper Title</th>
                        <th>Symposium</th>
                        <th>Presentation</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($results)) : ?>
                        <tr><td colspan="7" style="text-align:center; padding:24px;">No papers submitted yet.</td></tr>
                    <?php else: foreach ($results as $p) : ?>
                        <tr>
                            <td><strong style="font-family:monospace; color:#0d9488;"><?php echo esc_html($p->paper_code); ?></strong></td>
                            <td><strong><?php echo esc_html($p->full_name); ?></strong><br/><small><?php echo esc_html($p->company_name); ?></small></td>
                            <td><strong><?php echo esc_html($p->paper_title); ?></strong></td>
                            <td><?php echo esc_html($p->symposium_title); ?></td>
                            <td><?php echo esc_html($p->presentation_type); ?></td>
                            <td><span style="background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px;"><?php echo esc_html($p->status); ?></span></td>
                            <td><?php echo esc_html($p->created_at); ?></td>
                        </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public static function render_exhibitors() {
        global $wpdb;
        $table = $wpdb->prefix . 'gujcorr_booths';
        $results = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC");
        ?>
        <div class="wrap">
            <h1 style="font-weight:800;">Exhibition Space Inquiries &amp; Booths</h1>
            <table class="wp-list-table widefat fixed striped" style="margin-top:16px;">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Contact Person</th>
                        <th>Email / Phone</th>
                        <th>Industry Sector</th>
                        <th>Preferred Booth</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($results)) : ?>
                        <tr><td colspan="6" style="text-align:center; padding:24px;">No exhibitor inquiries submitted yet.</td></tr>
                    <?php else: foreach ($results as $b) : ?>
                        <tr>
                            <td><strong><?php echo esc_html($b->company_name); ?></strong></td>
                            <td><?php echo esc_html($b->contact_person); ?> (<?php echo esc_html($b->designation); ?>)</td>
                            <td><?php echo esc_html($b->email); ?><br/><?php echo esc_html($b->mobile_number); ?></td>
                            <td><?php echo esc_html($b->industry); ?></td>
                            <td><strong><?php echo esc_html($b->preferred_booth); ?></strong></td>
                            <td><?php echo esc_html($b->created_at); ?></td>
                        </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}
