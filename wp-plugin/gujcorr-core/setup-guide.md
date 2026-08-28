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

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/wp-json/gujcorr/v1/registrations` | `POST` | Delegate pass registration with 18% GST calculation & QR token |
| `/wp-json/gujcorr/v1/registrations` | `GET` | Admin list of all registered delegates |
| `/wp-json/gujcorr/v1/papers` | `POST` | Call for papers & 200-250 word abstract submission |
| `/wp-json/gujcorr/v1/papers` | `GET` | Technical review list of submitted abstracts |
| `/wp-json/gujcorr/v1/exhibitors` | `POST` | Booth space reservation inquiry |
| `/wp-json/gujcorr/v1/contact` | `POST` | Secretariat contact message |
| `/wp-json/gujcorr/v1/settings` | `GET` | CMS-configurable tariff, GST rates & deadlines |
