-- ==========================================================
-- GUJCORR 2027: Initial Seed Data for Production Verification
-- ==========================================================

SET NAMES utf8mb4;

-- 1. Insert Initial Registrations
INSERT INTO `wp_gujcorr_registrations` 
(`ticket_id`, `full_name`, `gender`, `designation`, `organization`, `department`, `email`, `mobile_number`, `country`, `state`, `city`, `address`, `category`, `membership_number`, `gstin`, `company_legal_name`, `base_amount`, `gst_amount`, `total_amount`, `payment_method`, `transaction_ref`, `dietary_preference`, `status`, `qr_token`)
VALUES
('GUJ27-DEL-104928', 'Dr. Rajesh Sharma', 'Male', 'Senior Corrosion Specialist', 'Larsen & Toubro Ltd', 'Asset Integrity Dept', 'rajesh.sharma@company.com', '+91 98765 43210', 'India', 'Gujarat', 'Vadodara', 'Knowledge City, NH-8, Vadodara 390019', 'Non-Member Pass', '', '24AAACL0140P1ZT', 'Larsen & Toubro Limited', 6500.00, 1170.00, 7670.00, 'Bank Transfer / NEFT', 'NEFT-UBI-884920149', 'Pure Vegetarian', 'Confirmed', 'GUJCORR2027:GUJ27-DEL-104928'),
('GUJ27-DEL-338291', 'Prof. (Dr.) Sunil Kahar', 'Male', 'Professor & Head', 'The M.S. University of Baroda', 'Metallurgical & Materials Engg', 'sunil.kahar@msubaroda.ac.in', '+91 99888 81674', 'India', 'Gujarat', 'Vadodara', 'Faculty of Technology & Engg, MSU Baroda', 'AMPP Member Pass', 'AMPP-GUJ-001', '', '', 4000.00, 720.00, 4720.00, 'Complimentary Organizer', 'AUTH-ORG-001', 'Pure Vegetarian', 'Confirmed', 'GUJCORR2027:GUJ27-DEL-338291'),
('GUJ27-DEL-772910', 'Mr. Hiren Panchal', 'Male', 'Managing Director', 'Technocrat Instruments Pvt Ltd', 'Technical Sales', 'hiren.panchal@technocrat.com', '+91 99888 81674', 'India', 'Gujarat', 'Vadodara', 'Makarpura GIDC, Vadodara', 'IIM Member Pass', 'IIM-BAR-042', '24AAACT8819A1Z2', 'Technocrat Instruments', 4000.00, 720.00, 4720.00, 'UPI / QR', 'UPI-9920148201', 'Jain (No Root Veg)', 'Confirmed', 'GUJCORR2027:GUJ27-DEL-772910');

-- 2. Insert Initial Sample Papers
INSERT INTO `wp_gujcorr_papers`
(`paper_code`, `full_name`, `nationality`, `gender`, `designation`, `company_name`, `education`, `specialization`, `achievements`, `memberships`, `email`, `mobile_number`, `address`, `city`, `state`, `country`, `paper_title`, `symposium_id`, `symposium_title`, `presentation_type`, `abstract_text`, `keywords`, `co_authors`, `status`, `reviewer_score`, `reviewer_comments`)
VALUES
('GUJ27-PAP-102', 'Dr. Rajesh Sharma', 'Indian', 'Male', 'Senior Corrosion Specialist', 'Larsen & Toubro Ltd', 'Ph.D. Metallurgy (IIT Bombay)', 'Cathodic Protection & Pipeline Integrity', 'Published 14 papers in NACE Corrosion Journal', 'AMPP Senior Member, IIM Life Member', 'rajesh.sharma@company.com', '+91 98765 43210', 'Knowledge City, NH-8', 'Vadodara', 'Gujarat', 'India', 'Advanced Pipeline Integrity & Mitigation of Stray Current Corrosion in Heavy Industrial Corridors', 1, 'SYM-01: Cathodic Protection & DC/AC Mitigation', 'Oral', 'This study investigates the electrochemical interference caused by high-voltage AC transmission lines and metro rail DC traction on buried hydrocarbon pipelines in western India. Solid-state decoupling devices and deep-well anode groundbeds were evaluated over a 24-month monitoring campaign.', 'Cathodic Protection, Stray Current, AC Mitigation, Pipeline Integrity, Deep Well Anode', 'Er. Amit Verma (L&T), Dr. K. Ramanathan (IITB)', 'Accepted for Oral Presentation', 9.20, 'Excellent industrial relevance and rigorous electrochemical modeling data. Approved for oral track.'),
('GUJ27-PAP-105', 'Priya Patel', 'Indian', 'Female', 'Ph.D. Research Scholar', 'The M.S. University of Baroda', 'M.Tech Materials Technology', 'Polymeric Coatings & Nanotechnology', 'Recipient of Best Young Metallurgist 2025', 'AMPP Student Member', 'priya.patel@msubaroda.ac.in', '+91 98222 11344', 'Dept of Metallurgical & Materials Engg', 'Vadodara', 'Gujarat', 'India', 'Synthesis and Corrosion Barrier Performance of Graphene-Modified Polyurea Coatings for Marine Splash Zones', 2, 'SYM-02: Protective Coatings & Linings', 'Oral', 'Graphene nanoplatelets (GNPs) were dispersed into a two-component aromatic polyurea matrix using high-shear sonication. Salt spray ASTM B117 testing (3000 hours) and Electrochemical Impedance Spectroscopy (EIS) revealed a 3-order magnitude increase in charge transfer resistance.', 'Graphene Nanoplatelets, Polyurea, Marine Splash Zone, EIS, Barrier Coatings', 'Dr. Sunil Kahar (MSU Baroda)', 'Accepted for Oral Presentation', 9.50, 'Outstanding experimental methodology and superior barrier impedance results. Recommended for keynote student session.');

-- 3. Insert Exhibition Stalls
INSERT INTO `wp_gujcorr_booths`
(`booth_number`, `type`, `area_sqm`, `dimensions`, `company_name`, `contact_person`, `designation`, `email`, `mobile_number`, `fascia_name`, `gstin`, `base_price`, `gst_amount`, `total_price`, `status`)
VALUES
('IS-01', 'Island Pavilion (36 sqm)', 36, '6m x 6m', 'TCR Advanced Engineering Pvt Ltd', 'Mr. Paresh Haribhakti', 'Managing Director', 'info@tcradvanced.com', '+91 265 265 7233', 'TCR ADVANCED ENGINEERING', '24AAACT1049Z1Z5', 350000.00, 63000.00, 413000.00, 'Booked'),
('IS-02', 'Island Pavilion (36 sqm)', 36, '6m x 6m', 'Larsen & Toubro Limited', 'Asset Integrity Head', 'Chief Engineer', 'integrity@larsentoubro.com', '+91 22 6752 5656', 'LARSEN & TOUBRO HEAVY ENGG', '24AAACL0140P1ZT', 350000.00, 63000.00, 413000.00, 'Booked'),
('IS-03', 'Island Pavilion (36 sqm)', 36, '6m x 6m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 350000.00, 63000.00, 413000.00, 'Available'),
('CR-01', 'Corner Shell (18 sqm)', 18, '6m x 3m', 'Berger Paints India Ltd', 'Regional Sales Manager', 'Manager', 'protective@bergerindia.com', '+91 33 2229 9724', 'BERGER PROTECTIVE COATINGS', '19AAACB2014A1Z8', 190000.00, 34200.00, 224200.00, 'Booked'),
('ST-01', 'Standard Shell (9 sqm)', 9, '3m x 3m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 95000.00, 17100.00, 112100.00, 'Available'),
('ST-02', 'Standard Shell (9 sqm)', 9, '3m x 3m', 'Ujas Energy Solutions', 'Technical Director', 'Director', 'contact@ujas.com', '+91 265 244 5566', 'UJAS ENERGY & CORROSION', '24AAACU5512D1Z9', 95000.00, 17100.00, 112100.00, 'Booked');

-- 4. Insert Initial Proforma Invoice
INSERT INTO `wp_gujcorr_invoices`
(`invoice_number`, `invoice_type`, `company_name`, `contact_name`, `email`, `address`, `gstin`, `sac_code`, `tier_name`, `quantity`, `base_amount`, `cgst_amount`, `sgst_amount`, `total_amount`, `payment_status`)
VALUES
('GUJCORR-PI-10492', 'PROFORMA INVOICE', 'Larsen & Toubro Limited', 'Dr. Rajesh Sharma', 'rajesh.sharma@company.com', 'Knowledge City, NH-8, Vadodara, Gujarat 390019', '24AAACL0140P1ZT', '998397', 'Non-Member Pass', 1, 6500.00, 585.00, 585.00, 7670.00, 'Unpaid');
