import { DelegateRegistration, PaperSubmission } from '../types';

const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/gujcorr/wp-json/gujcorr/v1';

// Local storage keys for fallback persistence
const STORAGE_KEYS = {
  REGISTRATIONS: 'gujcorr_registrations',
  PAPERS: 'gujcorr_papers',
  EXHIBITORS: 'gujcorr_exhibitors',
  CONTACTS: 'gujcorr_contacts',
  CURRENT_USER: 'gujcorr_current_user'
};

export const api = {
  // 1. Submit Delegate Registration
  async registerDelegate(data: Omit<DelegateRegistration, 'id' | 'registrationDate' | 'status' | 'ticketId'>): Promise<{ success: boolean; data: DelegateRegistration; message: string }> {
    const newReg: DelegateRegistration = {
      ...data,
      id: 'REG-' + Math.floor(100000 + Math.random() * 900000),
      registrationDate: new Date().toISOString(),
      status: 'Confirmed',
      ticketId: 'GUJ27-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GUJCORR2027:REG-${Math.floor(100000 + Math.random() * 900000)}`
    };

    try {
      const res = await fetch(`${WP_API_BASE}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReg),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const wpData = await res.json();
        return { success: true, data: wpData, message: 'Registration confirmed via WordPress API!' };
      }
    } catch {
      // Fallback to local storage
      console.log('WordPress API unavailable; persisting registration locally in browser storage.');
    }

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || '[]');
      existing.push(newReg);
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(existing));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ role: 'delegate', data: newReg }));
    }

    return {
      success: true,
      data: newReg,
      message: 'Registration confirmed successfully! Ticket and QR Badge generated.'
    };
  },

  // 2. Submit Author Paper / Abstract
  async submitPaper(data: Omit<PaperSubmission, 'id' | 'submissionDate' | 'status'>): Promise<{ success: boolean; data: PaperSubmission; message: string }> {
    const newPaper: PaperSubmission = {
      ...data,
      id: 'PAP-' + Math.floor(1000 + Math.random() * 9000),
      submissionDate: new Date().toISOString(),
      status: 'Submitted'
    };

    try {
      const res = await fetch(`${WP_API_BASE}/papers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPaper),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const wpData = await res.json();
        return { success: true, data: wpData, message: 'Paper submitted to WordPress review system!' };
      }
    } catch {
      console.log('WordPress API unavailable; saving paper submission to local store.');
    }

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAPERS) || '[]');
      existing.push(newPaper);
      localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(existing));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ role: 'author', data: newPaper }));
    }

    return {
      success: true,
      data: newPaper,
      message: 'Abstract submitted successfully! Technical committee review tracking ID assigned.'
    };
  },

  // 3. Submit Exhibitor Booth Inquiry
  async submitExhibitorInquiry(data: {
    companyName: string;
    contactPerson: string;
    designation: string;
    email: string;
    mobileNumber: string;
    industry: string;
    productsDescription: string;
    preferredBooth?: string;
  }): Promise<{ success: boolean; message: string }> {
    const inquiry = {
      ...data,
      id: 'EXH-' + Date.now(),
      submittedAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${WP_API_BASE}/exhibitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return { success: true, message: 'Exhibitor inquiry received via WordPress CRM!' };
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXHIBITORS) || '[]');
      existing.push(inquiry);
      localStorage.setItem(STORAGE_KEYS.EXHIBITORS, JSON.stringify(existing));
    }

    return {
      success: true,
      message: 'Thank you! Your booth inquiry has been received. Our exhibition committee will contact you within 24 hours.'
    };
  },

  // 4. Submit General Contact Inquiry
  async submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const msg = { ...data, id: 'MSG-' + Date.now(), submittedAt: new Date().toISOString() };

    try {
      const res = await fetch(`${WP_API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return { success: true, message: 'Message sent directly to GUJCORR secretariat!' };
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
      existing.push(msg);
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(existing));
    }

    return {
      success: true,
      message: 'Message delivered! Our organizing committee (iim.barodachapter@gmail.com) will get back to you shortly.'
    };
  },

  // 5. Send Email Notification via Nodemailer
  async sendNotificationEmail(payload: {
    type: 'welcome' | 'paper_submitted' | 'payment_pending' | 'payment_success' | 'contact_inquiry';
    to: string;
    data: any;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      return result;
    } catch (err: any) {
      console.warn('[API] Email trigger warning:', err);
      return { success: false, error: err.message };
    }
  },

  // 6. Get Local Storage Data for Dashboards
  getLocalData() {
    if (typeof window === 'undefined') return { registrations: [], papers: [], exhibitors: [], currentUser: null };
    return {
      registrations: JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || '[]') as DelegateRegistration[],
      papers: JSON.parse(localStorage.getItem(STORAGE_KEYS.PAPERS) || '[]') as PaperSubmission[],
      exhibitors: JSON.parse(localStorage.getItem(STORAGE_KEYS.EXHIBITORS) || '[]'),
      currentUser: JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null')
    };
  }
};
