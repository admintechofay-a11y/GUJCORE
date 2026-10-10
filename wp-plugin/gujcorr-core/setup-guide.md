# GUJCORR 2027: WordPress Backend & Database Setup Guide (XAMPP / Local)

This guide walks you through setting up **WordPress (Headless CMS)** and **MySQL database** locally using XAMPP, and connecting it to your **Next.js (React)** frontend.

---

## 1. Prerequisites
- **Node.js**: Installed (v24+ / v18+) ✅
- **XAMPP** (Apache + MySQL): [Download XAMPP for Windows](https://www.apachefriends.org/index.html)

---

## 2. Step-by-Step Local WordPress & MySQL Setup

### Step A: Start Apache and MySQL
1. Open **XAMPP Control Panel** from your Windows Start Menu.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.

### Step B: Create MySQL Database
1. Open your browser and go to `http://localhost/phpmyadmin/`.
2. Click **New** in the left sidebar.
3. Enter database name: `gujcorr_db`.
4. Collation: `utf8mb4_unicode_ci`.
5. Click **Create**.

### Step C: Install WordPress
1. Download WordPress from [wordpress.org/download](https://wordpress.org/download/).
2. Extract the `wordpress` folder into:
   ```
   C:\xampp\htdocs\gujcorr
   ```
3. Open `http://localhost/gujcorr/` in your browser.
4. Select Language (English) and click **Continue**.
5. Database Connection Details:
   - **Database Name:** `gujcorr_db`
   - **Username:** `root`
   - **Password:** *(leave blank)*
   - **Database Host:** `localhost`
   - **Table Prefix:** `wp_`
6. Click **Run the installation**.
7. Enter Site Title: `GUJCORR 2027 Conference`, create your Admin username & password, and click **Install WordPress**.

---

## 3. Install & Activate the GUJCORR Core Plugin

1. Copy the plugin folder from this workspace:
   ```
   c:\Users\HP\OneDrive\Desktop\GUJCORR\wp-plugin\gujcorr-core
   ```
   Into:
   ```
   C:\xampp\htdocs\gujcorr\wp-content\plugins\gujcorr-core
   ```
2. Log in to your WordPress Admin (`http://localhost/gujcorr/wp-admin/`).
3. Go to **Plugins > Installed Plugins**.
4. Find **GUJCORR 2027 Core Engine** and click **Activate**.

Upon activation, the plugin automatically creates:
- `wp_gujcorr_registrations` (Delegate registrations with 18% GST calculation)
- `wp_gujcorr_papers` (200–250 word abstracts, author fields, review scoring)
- `wp_gujcorr_booths` (Exhibitor space reservations)
- `wp_gujcorr_inquiries` (Secretariat contact inquiries)
- Custom Post Types: Speakers, 14 Technical Symposia, Sponsors, Awards
- REST API at `http://localhost/gujcorr/wp-json/gujcorr/v1/`

---

## 4. Connect Next.js React Frontend

1. In `c:\Users\HP\OneDrive\Desktop\GUJCORR\frontend\`, create or edit `.env.local`:
   ```env
   NEXT_PUBLIC_WP_API_URL=http://localhost/gujcorr/wp-json/gujcorr/v1
   ```
2. Start the React development server:
   ```powershell
   cd c:\Users\HP\OneDrive\Desktop\GUJCORR\frontend
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 5. Live Architecture & Endpoints

| Endpoint | Method | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `/wp-json/gujcorr/v1/registrations` | `POST` | Public | Delegate pass registration with 18% GST calculation & QR token |
| `/wp-json/gujcorr/v1/registrations` | `GET` | Admin / API Key | List of all registered delegates |
| `/wp-json/gujcorr/v1/registrations/status` | `POST` | Admin / API Key | Update registration status (Confirmed / Cancelled) |
| `/wp-json/gujcorr/v1/papers` | `POST` | Public | Call for papers & 200–250 word abstract submission |
| `/wp-json/gujcorr/v1/papers` | `GET` | Admin / API Key | Technical review list of submitted abstracts |
| `/wp-json/gujcorr/v1/papers/score` | `POST` | Admin / Reviewer | Record reviewer evaluation score & comments |
| `/wp-json/gujcorr/v1/booths` | `GET` | Public | Retrieve real-time floor plan booth reservation status |
| `/wp-json/gujcorr/v1/booths/reserve` | `POST` | Public | Reserve or book an exhibition booth |
| `/wp-json/gujcorr/v1/awards/nominate` | `POST` | Public | Submit Corrosion Awareness Award nomination |
| `/wp-json/gujcorr/v1/invoices` | `POST` | Public | Generate Proforma or Tax Invoice for corporate payments |
| `/wp-json/gujcorr/v1/invoices` | `GET` | Admin / Finance | List generated corporate invoices & payment statuses |
| `/wp-json/gujcorr/v1/contact` | `POST` | Public | Secretariat contact and general inquiries |
| `/wp-json/gujcorr/v1/auth/login` | `POST` | Public | Authenticate staff/admin user (supports bcrypt & PBKDF2) |
| `/wp-json/gujcorr/v1/admin/overview` | `GET` | Admin / API Key | Real-time counts (registrations, papers, booths, inquiries) |
| `/wp-json/gujcorr/v1/admin/content` | `GET` | Public | CMS content configuration (deadlines, banners, tariffs) |
| `/wp-json/gujcorr/v1/admin/content` | `POST` | Super Admin | Update CMS content configuration |
| `/wp-json/gujcorr/v1/admin/audit-logs` | `GET` | Super Admin | Audit trail of security and transaction events |

---

## 6. One-Click Plugin Installation via Zip

If uploading through WordPress Admin:
1. Go to **WordPress Admin > Plugins > Add New Plugin > Upload Plugin**.
2. Choose `wp-plugin/gujcorr-core.zip` (or `gujcorr.zip`).
3. Click **Install Now**, then click **Activate Plugin**.
4. The database tables and API endpoints are automatically initialized.
