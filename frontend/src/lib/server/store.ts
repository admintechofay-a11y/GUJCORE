import fs from 'fs';
import path from 'path';
import { hashPassword, StaffRole } from './auth';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: StaffRole;
  passwordHash: string;
  status: 'Active' | 'Disabled';
  lastLogin?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress?: string;
  status: 'Success' | 'Failed';
  createdAt: string;
}

export interface ContentSection {
  sectionKey: string;
  data: any;
  updatedBy: string;
  updatedAt: string;
}

export interface StoreData {
  users: AdminUser[];
  registrations: any[];
  papers: any[];
  booths: any[];
  inquiries: any[];
  invoices: any[];
  awards: any[];
  content: Record<string, any>;
  auditLogs: AuditLogEntry[];
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'persisted_admin_data.json');

// Initialize default store if not exists
function createInitialStore(): StoreData {
  const now = new Date().toISOString();

  const defaultUsers: AdminUser[] = [
    {
      id: 'usr-admin-01',
      email: 'admin@gujcorr.org',
      username: 'admin',
      fullName: 'Super Administrator',
      role: 'Super Administrator',
      passwordHash: hashPassword('Admin@Gujcorr2027!'),
      status: 'Active',
      createdAt: now
    },
    {
      id: 'usr-sec-02',
      email: 'secretariat@gujcorr.org',
      username: 'secretariat',
      fullName: 'AMPP & IIM Baroda Secretariat',
      role: 'Secretariat Staff',
      passwordHash: hashPassword('Secretariat@2027!'),
      status: 'Active',
      createdAt: now
    },
    {
      id: 'usr-fin-03',
      email: 'finance@gujcorr.org',
      username: 'finance',
      fullName: 'Conference Accounts Desk',
      role: 'Finance Staff',
      passwordHash: hashPassword('Finance@2027!'),
      status: 'Active',
      createdAt: now
    },
    {
      id: 'usr-edt-04',
      email: 'editorial@gujcorr.org',
      username: 'editorial',
      fullName: 'Technical Review Committee Chair',
      role: 'Paper Coordinator',
      passwordHash: hashPassword('Editorial@2027!'),
      status: 'Active',
      createdAt: now
    },
    {
      id: 'usr-rev-05',
      email: 'reviewer@gujcorr.org',
      username: 'reviewer',
      fullName: 'Senior Technical Reviewer',
      role: 'Reviewer',
      passwordHash: hashPassword('Reviewer@2027!'),
      status: 'Active',
      createdAt: now
    }
  ];

  const defaultBooths = [];
  const boothTypes = [
    { size: '12 sqm', basePrice: 125000, gst: 22500, total: 147500 },
    { size: '9 sqm', basePrice: 95000, gst: 17100, total: 112100 }
  ];

  for (let i = 1; i <= 42; i++) {
    const num = i < 10 ? `S-0${i}` : `S-${i}`;
    const isPremium = i <= 6 || i === 21 || i === 22 || i >= 37;
    const cfg = isPremium ? boothTypes[0] : boothTypes[1];

    defaultBooths.push({
      id: `booth-${i}`,
      boothNumber: num,
      companyName: '',
      contactPerson: '',
      designation: '',
      email: '',
      mobileNumber: '',
      fasciaName: '',
      gstin: '',
      boothSize: cfg.size,
      basePrice: cfg.basePrice,
      gstAmount: cfg.gst,
      totalPrice: cfg.total,
      status: 'Available',
      bookedAt: null
    });
  }

  const defaultContent = {
    general: {
      conferenceName: 'GUJCORR 2027',
      fullName: 'AMPP Gujarat Global Conference & Expo on Corrosion',
      tagline: 'Stronger Together: Uniting the Global Fight Against Corrosion',
      dates: '18th – 20th February 2027',
      venue: 'Vadodara, Gujarat, India',
      organizer: 'AMPP Gujarat Chapter & The Indian Institute of Metals (IIM) Baroda Chapter',
      email: 'iim.barodachapter@gmail.com',
      phone: '+91 9988881674',
      bankDetails: {
        bankName: 'Union Bank of India',
        branch: 'Dandia Bazar Branch, Vadodara - 390001',
        accountName: 'The Indian Institute of Metals Baroda Chapter',
        accountNumber: '520101234030441',
        ifscCode: 'UBIN0901555',
        micrCode: '390026037'
      }
    },
    hero: {
      headline: 'The Premier Corrosion Conference & Expo in Western India',
      subheadline: 'Join 500+ international corrosion scientists, materials engineers, asset integrity leaders, and cathodic protection specialists.',
      badgeText: 'GUJCORR 2027 • Vadodara, Gujarat'
    },
    deadlines: {
      abstractSubmission: '11th October 2026',
      fullPaperSubmission: '30th October 2026',
      presentationSubmission: '15th November 2026',
      authorRegistrationDeadline: '15th December 2026',
      conferenceDates: '18th – 20th February 2027'
    }
  };

  const defaultAuditLogs: AuditLogEntry[] = [
    {
      id: 'aud-init-001',
      userId: 'system',
      userEmail: 'system@gujcorr.org',
      action: 'SYSTEM_GENESIS',
      resourceType: 'Security',
      resourceId: 'MASTER_PANEL',
      details: 'GUJCORR 2027 Enterprise Master Admin Panel initialized with clean production database.',
      status: 'Success',
      createdAt: now
    }
  ];

  return {
    users: defaultUsers,
    registrations: [],
    papers: [],
    booths: defaultBooths,
    inquiries: [],
    invoices: [],
    awards: [],
    content: defaultContent,
    auditLogs: defaultAuditLogs
  };
}

// In-memory cache
let memoryStore: StoreData | null = null;

export function getStore(): StoreData {
  if (memoryStore) {
    return memoryStore;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      memoryStore = JSON.parse(raw);
      return memoryStore!;
    }
  } catch (err) {
    console.warn('[STORE] Error reading persisted JSON store, falling back to initial data:', err);
  }

  // File doesn't exist or error reading: create initial
  memoryStore = createInitialStore();
  saveStore(memoryStore);
  return memoryStore;
}

export function saveStore(store: StoreData): void {
  memoryStore = store;
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[STORE] Failed writing to persisted admin store file:', err);
  }
}

// Audit logger
export function appendAuditLog(entry: {
  userId: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress?: string;
  status?: 'Success' | 'Failed';
}): AuditLogEntry {
  const store = getStore();
  const log: AuditLogEntry = {
    id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    userId: entry.userId,
    userEmail: entry.userEmail,
    action: entry.action,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId,
    details: entry.details,
    ipAddress: entry.ipAddress || '127.0.0.1',
    status: entry.status || 'Success',
    createdAt: new Date().toISOString()
  };

  store.auditLogs.unshift(log);
  // Keep last 1000 logs
  if (store.auditLogs.length > 1000) {
    store.auditLogs = store.auditLogs.slice(0, 1000);
  }
  saveStore(store);
  return log;
}

// Bidirectional WordPress REST API Sync Helper
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/gujcorr/wp-json/gujcorr/v1';
const WP_API_SECRET = process.env.GUJCORR_API_SECRET || '';

export async function syncWithWordPress(): Promise<{ synced: boolean; message: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (WP_API_SECRET) {
      headers['x-gujcorr-api-key'] = WP_API_SECRET;
    }

    const [regRes, papRes, boothRes, inqRes] = await Promise.allSettled([
      fetch(`${WP_API_URL}/registrations`, { headers, signal: AbortSignal.timeout(3000) }).then(r => r.ok ? r.json() : null),
      fetch(`${WP_API_URL}/papers`, { headers, signal: AbortSignal.timeout(3000) }).then(r => r.ok ? r.json() : null),
      fetch(`${WP_API_URL}/booths`, { headers, signal: AbortSignal.timeout(3000) }).then(r => r.ok ? r.json() : null),
      fetch(`${WP_API_URL}/inquiries`, { headers, signal: AbortSignal.timeout(3000) }).then(r => r.ok ? r.json() : null)
    ]);

    const store = getStore();
    let hasUpdates = false;

    if (regRes.status === 'fulfilled' && regRes.value && Array.isArray(regRes.value.data)) {
      const wpRegs = regRes.value.data;
      wpRegs.forEach((wpR: any) => {
        const idx = store.registrations.findIndex(r => r.ticketId === wpR.ticketId || r.id === wpR.ticketId);
        if (idx >= 0) {
          store.registrations[idx] = { ...store.registrations[idx], ...wpR };
        } else {
          store.registrations.unshift(wpR);
        }
      });
      hasUpdates = true;
    }

    if (papRes.status === 'fulfilled' && papRes.value && Array.isArray(papRes.value.data)) {
      const wpPapers = papRes.value.data;
      wpPapers.forEach((wpP: any) => {
        const idx = store.papers.findIndex(p => (p.paperCode || p.id) === (wpP.paperCode || wpP.id));
        if (idx >= 0) {
          store.papers[idx] = { ...store.papers[idx], ...wpP };
        } else {
          store.papers.unshift(wpP);
        }
      });
      hasUpdates = true;
    }

    if (boothRes.status === 'fulfilled' && boothRes.value && Array.isArray(boothRes.value.data)) {
      const wpBooths = boothRes.value.data;
      wpBooths.forEach((wpB: any) => {
        const bNum = wpB.stallNumber || wpB.booth_number || wpB.boothNumber;
        const idx = store.booths.findIndex(b => b.boothNumber === bNum);
        if (idx >= 0) {
          store.booths[idx] = { ...store.booths[idx], ...wpB };
        }
      });
      hasUpdates = true;
    }

    if (hasUpdates) {
      saveStore(store);
      return { synced: true, message: 'Successfully synced with WordPress REST API database.' };
    }

    return { synced: false, message: 'WordPress API reachable but returned no updates.' };
  } catch (err: any) {
    return { synced: false, message: `WordPress offline or uncontactable: ${err.message}` };
  }
}

export async function forwardToWordPress(endpoint: string, method: string = 'POST', data: any = {}): Promise<any> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (WP_API_SECRET) {
      headers['x-gujcorr-api-key'] = WP_API_SECRET;
    }

    const res = await fetch(`${WP_API_URL}${endpoint}`, {
      method,
      headers,
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fail gracefully if WordPress endpoint is offline
  }
  return null;
}

