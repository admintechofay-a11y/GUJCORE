# 🛡️ GUJCORR 2027 — International Conference & Exhibition Portal (www.gujcorr.org)

> **AMPP Gujarat Global Conference & Expo on Corrosion (GUJCORR 2027)**  
> **Tagline:** *"Stronger Together: Uniting the Global fight against Corrosion"*  
> **Subtitle:** India's Premier Corrosion Conference & Expo in Gujarat  
> **Dates:** 18–20 February 2027 | **Venue City:** Vadodara, Gujarat, India  
> **Organizers:** Jointly organized by **AMPP Gujarat Chapter** & **The Indian Institute of Metals (IIM), Baroda Chapter**  
> **Knowledge Partner:** **The Maharaja Sayajirao University of Baroda**  
> **Official Website:** [www.gujcorr.org](https://www.gujcorr.org)

---

## 🌟 Architecture & Content Single Source of Truth

All conference metadata, sessions, dates, committees, tariffs, bank details, and sponsors are centralized in:
`frontend/src/data/conference.ts`

To update any content (dates, committee members, package tariffs), edit this single file and all pages automatically update.

---

## 🚀 Quickstart Guide

### Frontend (Next.js 16 + React 19 + TypeScript + Tailwind CSS v4)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Production build verification (all routes pre-rendered)
npm run build
```
Frontend runs locally at: **`http://localhost:3000`**

---

## 🗺️ Key Routes Map

| Route | Functionality | Status |
| :--- | :--- | :---: |
| **`/`** | Homepage: Hero countdown, organizers, brochure gateway, dates | ✅ Ready |
| **`/about`** | Comprehensive Brochure About, Technical Platform, Focus Sectors | ✅ Ready |
| **`/technical-sessions`**| The 14 Official Technical Sessions with full scope breakdown | ✅ Ready |
| **`/call-for-papers`** | Abstract Submission Form (Word limit, Presenting Author checkbox, File upload) | ✅ Ready |
| **`/registration`** | Delegate Registration (Member ₹4,720 / Non-Member ₹7,670 / Student ₹1,770 incl. GST) | ✅ Ready |
| **`/sponsorship`** | Diamond, Gold, Silver, Bronze, Tea/Coffee Packages + Comparison Matrix | ✅ Ready |
| **`/souvenir`** | Souvenir Advertisement Rates (Back/Inner cover, Full/Half page) + Bleed Specs | ✅ Ready |
| **`/committee`** | Organizing Committee (Chairman, Co-Chairman, Convener, Co-Convener + 25 Members) | ✅ Ready |
| **`/advisory`** | International Advisory Committee (Hon. Vice Chancellors & Global Experts) | ✅ Ready |
| **`/supporters`** | 21 Corporate Patrons & PSUs Logo Wall | ✅ Ready |
| **`/venue`** | Vadodara City, Connectivity, Accommodation & Travel Guide | ✅ Ready |
| **`/contact`** | Secretariat Contact: Phone (+91 9988881674) & Email | ✅ Ready |
| **`/schedule`** | 3-Day Technical Programme Shell | ✅ Ready |
| **`/speakers`** | Keynote Speakers Roster | ✅ Ready |
| **`/exhibition`** | 2D Exhibition Floor Plan (12 sqm ₹75,000 / 9 sqm ₹50,000) | ✅ Ready |

---

## 🌐 Production Deployment (Vercel & Domain Setup)

### 1. Vercel Deployment
1. Connect the repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Framework Preset: **Next.js**.
4. Configure Environment Variables from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL=https://www.gujcorr.org`
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=465`
   - `SMTP_SECURE=true`
   - `SMTP_USER=iim.barodachapter@gmail.com`
   - `SMTP_PASS=<Google App Password>`
   - `SMTP_FROM="GUJCORR 2027 Secretariat <iim.barodachapter@gmail.com>"`

### 2. DNS Records for `www.gujcorr.org`
In your domain registrar (GoDaddy, Namecheap, Google Domains / Squarespace, etc.):
- **A Record**: Host `@` points to `76.76.21.21` (Vercel IP)
- **CNAME Record**: Host `www` points to `cname.vercel-dns.com`

---

## 🏛️ Organizing Secretariat
- **AMPP Gujarat Chapter** & **The Indian Institute of Metals (IIM), Baroda Chapter**
- **Address:** Metallurgical & Materials Engineering Dept, Faculty of Tech. & Engg, The M.S. University of Baroda, Vadodara - 390001, Gujarat, India
- **Phone / WhatsApp:** +91 9988881674 (Mr. Hiren Panchal, Convener)
- **Email:** `iim.barodachapter@gmail.com`
- **Website:** [www.gujcorr.org](https://www.gujcorr.org)

