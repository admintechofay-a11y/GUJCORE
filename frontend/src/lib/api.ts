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
    const ticketId = 'GUJ27-DEL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newReg: DelegateRegistration = {
      ...data,
      id: ticketId,
      ticketId: ticketId,
      registrationDate: new Date().toISOString(),
      status: 'Confirmed & Paid',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GUJCORR2027:${ticketId}`
    };

    // Primary: Post to live Next.js / Neon Database API
    try {
      const serverRes = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReg),
        signal: AbortSignal.timeout(30000)
      });
      if (serverRes.ok) {
        const json = await serverRes.json();
        if (json.success && json.data) {
          console.log('[API] Registration saved in Neon Database:', json.data);
        }
      }
    } catch (err) {
      console.warn('[API] Next.js registrations endpoint notice:', err);
    }

    // Secondary: Forward to WordPress if configured
    try {
      if (WP_API_BASE && !WP_API_BASE.includes('localhost')) {
        await fetch(`${WP_API_BASE}/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReg),
          signal: AbortSignal.timeout(3000)
        });
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      try {
        const existing: DelegateRegistration[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || '[]');
        const filtered = existing.filter(r => r.ticketId !== ticketId && r.id !== ticketId);
        filtered.unshift(newReg);
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filtered.slice(0, 30)));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ role: 'delegate', data: newReg }));
      } catch (storageErr) {
        console.warn('[STORAGE] LocalStorage quota reached, skipping cache:', storageErr);
      }
    }

    return {
      success: true,
      data: newReg,
      message: 'Registration confirmed successfully! Ticket and QR Badge generated.'
    };
  },

  // 1b. Fetch All Delegate Registrations (Live PostgreSQL Server + Local Storage)
  async getRegistrations(): Promise<{ success: boolean; data: DelegateRegistration[] }> {
    let serverList: DelegateRegistration[] = [];
    try {
      const res = await fetch('/api/registrations', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          serverList = json.data;
        }
      }
    } catch (err) {
      console.warn('[API] getRegistrations error:', err);
    }

    let localList: DelegateRegistration[] = [];
    if (typeof window !== 'undefined') {
      try {
        localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || '[]');
      } catch {}
    }

    // Merge: Server DB is primary source of truth, fallback to local entries
    const map = new Map<string, DelegateRegistration>();
    serverList.forEach(r => map.set(r.ticketId || r.id, r));
    localList.forEach(r => {
      const key = r.ticketId || r.id;
      if (!map.has(key)) {
        map.set(key, r);
      }
    });

    const combined = Array.from(map.values());
    if (typeof window !== 'undefined' && combined.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(combined.slice(0, 50)));
      } catch {}
    }

    return { success: true, data: combined };
  },

  // 1c. Update Delegate Status (Confirmed & Paid vs Provisional)
  async updateRegistrationStatus(ticketId: string, status: string): Promise<{ success: boolean }> {
    try {
      await fetch(`${WP_API_BASE}/registrations/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status }),
        signal: AbortSignal.timeout(4000)
      });
    } catch (err) {
      console.warn('WordPress update status:', err);
    }

    if (typeof window !== 'undefined') {
      const existing: DelegateRegistration[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || '[]');
      const updated = existing.map(r => {
        if (r.ticketId === ticketId || r.id === ticketId) {
          return { ...r, status: status as any };
        }
        return r;
      });
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
    }

    return { success: true };
  },

  // 2. Submit Author Paper / Abstract
  async submitPaper(data: Omit<PaperSubmission, 'id' | 'submissionDate' | 'status'>): Promise<{ success: boolean; data: PaperSubmission; message: string }> {
    const paperCode = 'GUJ27-PAP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newPaper: PaperSubmission = {
      ...data,
      id: paperCode,
      submissionDate: new Date().toISOString(),
      status: 'Submitted'
    };

    // Primary: Post to live Next.js / Neon Database API
    try {
      const serverRes = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPaper,
          paperCode: paperCode
        }),
        signal: AbortSignal.timeout(30000)
      });
      if (serverRes.ok) {
        const json = await serverRes.json();
        if (json.success && json.data) {
          console.log('[API] Paper saved in Neon Database:', json.data);
        }
      } else {
        const json = await serverRes.json().catch(() => ({}));
        console.warn('[API] Server returned error status:', serverRes.status, json);
        return {
          success: false,
          data: newPaper,
          message: json.message || `Server error (${serverRes.status}). Please try again.`
        };
      }
    } catch (err: any) {
      console.warn('[API] Next.js papers endpoint notice:', err);
      return {
        success: false,
        data: newPaper,
        message: err.name === 'TimeoutError' || err.name === 'AbortError'
          ? 'Upload timed out. Please check your internet connection or use a smaller file.'
          : (err.message || 'Network error while submitting paper.')
      };
    }

    // Secondary: Forward to WordPress if configured
    try {
      if (WP_API_BASE && !WP_API_BASE.includes('localhost')) {
        await fetch(`${WP_API_BASE}/papers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newPaper,
            paperCode: paperCode
          }),
          signal: AbortSignal.timeout(3000)
        });
      }
    } catch {
      // ignore
    }

    // Safe LocalStorage caching: NEVER store large base64 fileData in browser localStorage (5MB quota limit)
    if (typeof window !== 'undefined') {
      try {
        const { fileData, ...paperForLocal } = newPaper;
        const existing: PaperSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAPERS) || '[]');
        const filtered = existing.filter(p => p.id !== paperCode);
        filtered.unshift(paperForLocal as PaperSubmission);
        localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(filtered.slice(0, 30)));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ role: 'author', data: paperForLocal }));
      } catch (storageErr) {
        console.warn('[STORAGE] LocalStorage quota reached, skipping cache:', storageErr);
      }
    }

    return {
      success: true,
      data: newPaper,
      message: 'Abstract submitted successfully! Technical committee review tracking ID assigned.'
    };
  },

  // 2b. Fetch All Papers (Live PostgreSQL Server + Local Storage)
  async getPapers(): Promise<{ success: boolean; data: PaperSubmission[] }> {
    let serverList: PaperSubmission[] = [];
    try {
      const res = await fetch('/api/papers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          serverList = json.data;
        }
      }
    } catch (err) {
      console.warn('[API] getPapers error:', err);
    }

    let localList: PaperSubmission[] = [];
    if (typeof window !== 'undefined') {
      try {
        localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAPERS) || '[]');
      } catch {}
    }

    // Server DB has canonical live review status and comments
    const map = new Map<string, PaperSubmission>();
    serverList.forEach(p => {
      const key = p.paperCode || p.id;
      map.set(key, p);
    });
    localList.forEach(p => {
      const key = p.paperCode || p.id;
      if (!map.has(key)) {
        map.set(key, p);
      }
    });

    const combined = Array.from(map.values());
    if (typeof window !== 'undefined' && combined.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(combined.slice(0, 50)));
      } catch {}
    }

    return { success: true, data: combined };
  },

  // 2b-2. Attach or Upload Revised Manuscript File to Server & DB
  async attachManuscript(paperCode: string, fileData: string, fileName?: string, fileSize?: string, email?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'attach_file',
          paperCode,
          fileData,
          fileName: fileName || 'manuscript.pdf',
          fileSize: fileSize || 'Unknown',
          email: email || ''
        })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // 2c. Update Paper Peer Review & Score
  async updatePaperReview(paperCode: string, score: number, comments: string, status: string): Promise<{ success: boolean }> {
    try {
      await fetch(`${WP_API_BASE}/papers/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperCode, score, comments, status }),
        signal: AbortSignal.timeout(4000)
      });
    } catch (err) {
      console.warn('WordPress update paper score:', err);
    }

    if (typeof window !== 'undefined') {
      const existing: PaperSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAPERS) || '[]');
      const updated = existing.map(p => {
        if (p.id === paperCode) {
          return {
            ...p,
            reviewScore: score,
            reviewComments: comments,
            status: status as any
          };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(updated));
    }

    return { success: true };
  },

  // 3. Submit & Sync Exhibitor Booth Reservation
  async reserveBooth(data: {
    boothNumber: string;
    stallNumber?: string;
    stallType?: string;
    companyName: string;
    contactPerson: string;
    designation?: string;
    email: string;
    mobile: string;
    fasciaName?: string;
    gstin?: string;
    boothSize?: string;
    basePrice?: number;
    gstAmount?: number;
    totalPrice?: number;
    paymentStatus?: string;
    status?: string;
  }): Promise<{ success: boolean; message: string }> {
    const boothRecord = {
      ...data,
      id: 'EXH-' + Date.now(),
      submittedAt: new Date().toISOString()
    };

    // 1. Post to Next.js API (Neon PostgreSQL DB)
    try {
      const res = await fetch('/api/booths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boothRecord),
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, message: json.message || 'Exhibitor booth reserved successfully in database!' };
      }
    } catch {
      // Fallback
    }

    // 2. Post to WordPress if available
    try {
      const res = await fetch(`${WP_API_BASE}/booths/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boothRecord),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, message: json.message || 'Exhibitor booth saved to WordPress!' };
      }
    } catch {
      // Fallback to local storage if offline
    }

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXHIBITORS) || '[]');
      existing.unshift(boothRecord);
      localStorage.setItem(STORAGE_KEYS.EXHIBITORS, JSON.stringify(existing));
    }

    return {
      success: true,
      message: 'Exhibition stall reserved successfully.'
    };
  },

  // 3b. Fetch All Booths
  async getBooths(): Promise<{ success: boolean; data: any[] }> {
    let list: any[] = [];
    try {
      const res = await fetch('/api/booths', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          list = json.data;
        }
      }
    } catch {
      // Fallback
    }

    if (list.length === 0) {
      try {
        const res = await fetch(`${WP_API_BASE}/booths`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            list = json.data;
          }
        }
      } catch {
        // Fallback
      }
    }

    let localList: any[] = [];
    if (typeof window !== 'undefined') {
      localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXHIBITORS) || '[]');
    }

    const map = new Map<string, any>();
    list.forEach(b => map.set(b.stallNumber || b.booth_number || b.boothNumber || b.id, b));
    localList.forEach(b => {
      const key = b.stallNumber || b.booth_number || b.boothNumber || b.id;
      if (!map.has(key)) {
        map.set(key, b);
      }
    });

    const combined = Array.from(map.values());
    if (typeof window !== 'undefined' && combined.length > 0) {
      localStorage.setItem(STORAGE_KEYS.EXHIBITORS, JSON.stringify(combined));
    }

    return { success: true, data: combined };
  },

  // 3c. Exhibitor Booth Inquiry
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
    return this.reserveBooth({
      boothNumber: data.preferredBooth || 'S-01',
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      designation: data.designation,
      email: data.email,
      mobile: data.mobileNumber
    });
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

    // 1. Post to Next.js API (Neon PostgreSQL DB)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        return { success: true, message: 'Message sent directly to GUJCORR secretariat!' };
      }
    } catch {
      // ignore
    }

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
      existing.unshift(msg);
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(existing));
    }

    return {
      success: true,
      message: 'Message delivered! Our organizing committee (iim.barodachapter@gmail.com) will get back to you shortly.'
    };
  },

  // 4b. Fetch All Inquiries
  async getInquiries(): Promise<{ success: boolean; data: any[] }> {
    let list: any[] = [];
    try {
      const res = await fetch('/api/inquiries', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          list = json.data;
        }
      }
    } catch {
      // ignore
    }

    if (list.length === 0) {
      try {
        const res = await fetch(`${WP_API_BASE}/contact`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            list = json.data;
          }
        }
      } catch {
        // ignore
      }
    }

    let localList: any[] = [];
    if (typeof window !== 'undefined') {
      localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    }

    const map = new Map<string, any>();
    list.forEach(m => map.set(m.id || m.email + m.subject, m));
    localList.forEach(m => {
      const key = m.id || m.email + m.subject;
      if (!map.has(key)) {
        map.set(key, m);
      }
    });

    const combined = Array.from(map.values());
    if (typeof window !== 'undefined' && combined.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(combined));
    }

    return { success: true, data: combined };
  },

  // 5. Send Email Notification via Nodemailer
  async sendNotificationEmail(payload: {
    type: 'welcome' | 'paper_submitted' | 'payment_pending' | 'payment_success' | 'exhibition_booked' | 'contact_inquiry';
    to: string;
    data: any;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const clientBaseUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          data: {
            ...payload.data,
            baseUrl: payload.data?.baseUrl || clientBaseUrl
          }
        })
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
  },

  // 7. Server Admin Operations
  async getAdminOverview(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const res = await fetch('/api/admin/overview', { credentials: 'include' });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async getAuditLogs(action: string = 'all', limit: number = 100): Promise<{ success: boolean; data?: any[]; message?: string }> {
    try {
      const res = await fetch(`/api/admin/audit-logs?action=${encodeURIComponent(action)}&limit=${limit}`, { credentials: 'include' });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async getCmsContent(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const res = await fetch('/api/admin/content', { credentials: 'include' });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async updateCmsContent(sectionKey: string, data: any): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, data }),
        credentials: 'include'
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async getAdminUsers(): Promise<{ success: boolean; data?: any[]; message?: string }> {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async createAdminUser(userData: { email: string; password: string; fullName: string; role: string }): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async updateAdminUserStatus(userId: string, status: 'Active' | 'Disabled'): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', userId, status }),
        credentials: 'include'
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async updateRegistration(ticketId: string, status: string, transactionReference?: string, notes?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status, transactionReference, notes }),
        credentials: 'include'
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async updatePaperDecision(paperCode: string, score?: number, comments?: string, status?: string, assignedReviewer?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperCode, score, comments, status, assignedReviewer }),
        credentials: 'include'
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async updateBoothAllocation(boothNumber: string, status: string, details?: any): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/booths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boothNumber, status, ...details }),
        credentials: 'include'
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async updateInquiry(id: string, status?: string, internalNotes?: string, assignedTo?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, internalNotes, assignedTo }),
        credentials: 'include'
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
};
