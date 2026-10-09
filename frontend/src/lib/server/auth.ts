import crypto from 'crypto';
import { NextRequest } from 'next/server';

export type StaffRole = 
  | 'Super Administrator'
  | 'Administrator'
  | 'Secretariat Staff'
  | 'Finance Staff'
  | 'Paper Coordinator'
  | 'Reviewer'
  | 'Content Editor'
  | 'Delegate'
  | 'Author'
  | 'Admin';

export interface AuthSession {
  userId: string;
  email: string;
  fullName: string;
  role: StaffRole;
  issuedAt: number;
  expiresAt: number;
}

const AUTH_SECRET = process.env.GUJCORR_AUTH_SECRET || 'gujcorr-2027-amp-baroda-secretariat-salt-key-998397';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiter map for brute-force protection: key -> { count, lastAttempt }
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    return { allowed: true };
  }

  if (now - record.lastAttempt > LOCKOUT_WINDOW_MS) {
    loginAttempts.delete(identifier);
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remaining = Math.ceil((LOCKOUT_WINDOW_MS - (now - record.lastAttempt)) / 1000);
    return { allowed: false, waitSeconds: remaining };
  }

  return { allowed: true };
}

export function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const record = loginAttempts.get(identifier) || { count: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  loginAttempts.set(identifier, record);
}

export function resetRateLimit(identifier: string) {
  loginAttempts.delete(identifier);
}

// Password hashing using PBKDF2
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `pbkdf2:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !password) return false;

  // Check PBKDF2 format
  if (storedHash.startsWith('pbkdf2:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const originalHash = parts[2];
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(originalHash, 'hex'));
  }

  return false;
}

// Session token generation: payload.signature (HMAC-SHA256)
export function createSessionToken(user: { id: string; email: string; fullName: string; role: StaffRole }): string {
  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE_MS
  };

  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('base64url');

  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): AuthSession | null {
  if (!token || !token.includes('.')) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest('base64url');

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const session: AuthSession = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest): AuthSession | null {
  // 1. Check HTTP-only cookie 'gujcorr_session_token'
  const cookieToken = request.cookies.get('gujcorr_session_token')?.value;
  if (cookieToken) {
    const session = verifySessionToken(cookieToken);
    if (session) return session;
  }

  // 2. Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    const session = verifySessionToken(bearerToken);
    if (session) return session;
  }

  return null;
}

// Granular capability matrix
export type Capability = 
  | 'manage_users'
  | 'manage_settings'
  | 'manage_finance'
  | 'manage_registrations'
  | 'manage_papers'
  | 'score_papers'
  | 'manage_booths'
  | 'manage_content'
  | 'manage_inquiries'
  | 'view_audit_logs';

export function hasCapability(role: StaffRole, capability: Capability): boolean {
  if (role === 'Super Administrator' || role === 'Admin') {
    return true; // Super admin has all privileges
  }

  switch (role) {
    case 'Administrator':
      return [
        'manage_registrations',
        'manage_papers',
        'score_papers',
        'manage_booths',
        'manage_content',
        'manage_inquiries',
        'view_audit_logs'
      ].includes(capability);

    case 'Secretariat Staff':
      return [
        'manage_registrations',
        'manage_booths',
        'manage_inquiries'
      ].includes(capability);

    case 'Finance Staff':
      return [
        'manage_finance',
        'manage_registrations'
      ].includes(capability);

    case 'Paper Coordinator':
      return [
        'manage_papers',
        'score_papers'
      ].includes(capability);

    case 'Reviewer':
      return [
        'score_papers'
      ].includes(capability);

    case 'Content Editor':
      return [
        'manage_content'
      ].includes(capability);

    default:
      return false;
  }
}
