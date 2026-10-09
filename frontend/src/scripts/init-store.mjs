import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `pbkdf2:${salt}:${hash}`;
}

const now = new Date().toISOString();

const defaultUsers = [
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
for (let i = 1; i <= 42; i++) {
  const num = `S-${i.toString().padStart(2, '0')}`;
  const isPremium = i <= 6;
  defaultBooths.push({
    id: `booth-${i}`,
    boothNumber: num,
    companyName: '',
    contactPerson: '',
    email: '',
    mobileNumber: '',
    boothSize: isPremium ? '12 sqm' : '9 sqm',
    basePrice: isPremium ? 125000 : 95000,
    gstAmount: isPremium ? 22500 : 17100,
    totalPrice: isPremium ? 147500 : 112100,
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
    phone: '+91 9988881674'
  },
  hero: {
    headline: 'The Premier Corrosion Conference & Expo in Western India',
    subheadline: 'Join 500+ international corrosion scientists, materials engineers, and asset integrity leaders.'
  },
  deadlines: {
    abstractSubmission: '11th October 2026',
    fullPaperSubmission: '30th October 2026',
    presentationSubmission: '15th November 2026',
    authorRegistrationDeadline: '15th December 2026',
    conferenceDates: '18th – 20th February 2027'
  }
};

const defaultAuditLogs = [
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

const initialData = {
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

const targetPath = path.join(process.cwd(), 'src', 'data', 'persisted_admin_data.json');
fs.writeFileSync(targetPath, JSON.stringify(initialData, null, 2), 'utf-8');
console.log('Successfully wrote clean production store to:', targetPath);
