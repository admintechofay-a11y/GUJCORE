# 🛡️ GUJCORR 2027 — International Conference & Exhibition Portal

> **Official Headless Web Application & WordPress REST API Backend**  
> **Theme:** *"Advancements in Corrosion Control, Integrity Management & Sustainable Infrastructure"*  
> **Dates:** 18–20 February 2027 | **Venue:** Vadodara, Gujarat, India  
> **Organizers:** Jointly organized by **AMPP Gujarat Chapter** & **The Indian Institute of Metals (IIM) Baroda Chapter**

---

## 🌟 Executive Overview

**GUJCORR 2027** is a modern, enterprise-grade multi-page conference management web application built with **Next.js 16 (React 19, TypeScript, Tailwind CSS)** on the frontend and an extensible **WordPress Headless CMS + MySQL** backend. 

It provides an end-to-end digital experience mirroring international conference systems like *CORCON*, *NACE International*, and *AMPP Global*, featuring:
- **Free Account Creation & Instant QR Pass Badge Generation** (No payment gate required)
- **CORCON-Style Master Home Dashboard** with Author Tracking, Official Acceptance Letters, Certificate of Presentation, and Manuscript Template Downloads.
- **Interactive 3-Day Technical Schedule** with 1-Click **Google Calendar** Sync & Push Reminders.
- **2D Interactive Exhibition Grid** with 40+ stalls (Island, Corner, Standard) and instant reservation holding.
- **Automated Proforma Invoice & Tax Receipt Generator** with 15-Digit GSTIN & SAC Code `998397`.
- **Corrosion Awareness Awards Portal** with online citations and document nomination uploads.
- **Vadodara Partner Hotels & Excursion Portal** featuring discounted booking codes (`GUJCORR27`).

---

## 🚀 Quickstart Guide

### 1. Frontend (Next.js 16)
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if needed)
npm install

# Start local development server
npm run dev

# Build for production (22 static routes pre-rendered)
npm run build
```
Frontend runs locally at: **`http://localhost:3000`**

### 2. WordPress Backend & MySQL Database
The backend plugin and database migration scripts are located in `wp-plugin/` and `database/`:

1. **Activate WordPress Plugin**:
   - Copy `wp-plugin/gujcorr-core/` to your WordPress installation: `wp-content/plugins/gujcorr-core/`
   - In WordPress Admin, navigate to **Plugins** → Activate **GUJCORR Core**.
2. **Automated Database Setup**:
   - Run the 1-click database installer:
     ```bash
     php database/install.php
     ```
   - Or import `database/gujcorr_schema.sql` and `database/gujcorr_seed_data.sql` via phpMyAdmin / MySQL CLI into database `gujcorr_db`.
3. **API Configuration**:
   - The frontend connects automatically via `NEXT_PUBLIC_WP_API_URL` set in `frontend/.env.local`.
   - Built-in resilient caching ensures the portal runs seamlessly in local demo mode even if MySQL is offline.

---

## 🗺️ Complete Frontend Routes Map (22 Pages)

| Route | Functionality | Status |
| :--- | :--- | :---: |
| **`/`** | Homepage with Countdown, Chairman Address, Gateways & Video Player | ✅ Ready |
| **`/schedule`** | 3-Day Multi-Hall Interactive Schedule + Google Calendar & Reminders | ✅ Ready |
| **`/masterhome`** | CORCON-Style Unified Author & Delegate Portal | ✅ Ready |
| **`/registration`** | Delegate Registration (Free / Pay Later + QR Pass Generator) | ✅ Ready |
| **`/call-for-papers`** | 14-Symposia Abstract Submission + Resume & Full Paper Uploads | ✅ Ready |
| **`/exhibition`** | 2D Exhibition Floor Plan with 40+ Stalls & Reservation Modal | ✅ Ready |
| **`/invoice`** | Proforma Invoice & Corporate GST Receipt Generator (SAC 998397) | ✅ Ready |
| **`/awards`** | Corrosion Awareness Awards Categories & Online Nomination Portal | ✅ Ready |
| **`/symposia`** | Scope & Details of all 14 Specialized Technical Symposia | ✅ Ready |
| **`/speakers`** | Keynote & Invited Speakers with Scraped Authentic Photos | ✅ Ready |
| **`/sponsorship`** | Diamond to Bronze Packages & Souvenir Advertising Tariff | ✅ Ready |
| **`/venue`** | Venue Guide, Partner Hotels (Code `GUJCORR27`) & Tours | ✅ Ready |
| **`/committee`** | Organizing Committee & Board of Directors Profile Grid | ✅ Ready |
| **`/supporters`** | 21 Corporate Patrons & PSUs (ONGC, IOCL, L&T, Berger, etc.) | ✅ Ready |
| **`/about`** | AMPP & IIM Chapter Legacy, US$2.5T Global Impact, Vision | ✅ Ready |
| **`/login`** | Multi-Role Authentication Switcher with 1-Click Instant Demos | ✅ Ready |
| **`/contact`** | Secretariat Helpdesk, WhatsApp (+91 99888 81674) & Inquiries | ✅ Ready |

---

## 🔌 WordPress REST API Endpoints (`/wp-json/gujcorr/v1/`)

- `POST /registrations` — Submit new delegate registration (generates ticket ID & QR code).
- `GET /registrations` — Fetch all registered delegates.
- `POST /papers` — Submit new paper abstract across 14 symposia.
- `GET /papers` — Retrieve submissions with peer-review status.
- `POST /papers/score` — Peer-review scoring console (score 1–10 + status change).
- `POST /booths/reserve` — Reserve exhibition booth on the 2D floor plan.
- `GET /booths` — Get real-time status of all 40 exhibition stalls.
- `POST /awards/nominate` — Submit online award nomination with citations.
- `POST /invoices` — Create and log corporate Proforma Invoices.
- `POST /contact` — Submit general inquiries to Secretariat inbox.
- `POST /auth/login` & `POST /auth/register` — Role-based authentication routes.

---

## 🏛️ Organizing Secretariat
- **AMPP Gujarat Chapter** & **The Indian Institute of Metals (IIM) Baroda Chapter**
- **Address:** Faculty of Technology & Engineering, The M.S. University of Baroda, Vadodara - 390001, Gujarat, India
- **Phone / WhatsApp:** +91 99888 81674
- **Email:** `iim.barodachapter@gmail.com` | `info@amppgujarat.org`
