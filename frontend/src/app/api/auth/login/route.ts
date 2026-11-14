import { NextRequest, NextResponse } from 'next/server';
import { dbGetUserByEmail, dbUpdateUserLastLogin, dbAppendAuditLog } from '@/lib/server/db';
import { checkRateLimit, recordFailedAttempt, resetRateLimit, verifyPassword, createSessionToken } from '@/lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateLimitKey = `${cleanEmail}:${ip}`;

    // Rate limiting check
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      await dbAppendAuditLog({
        userId: 'anonymous',
        userEmail: cleanEmail,
        action: 'LOGIN_RATE_LIMITED',
        resourceType: 'Security',
        resourceId: cleanEmail,
        details: `Brute force attempt blocked. Cooldown remaining: ${rateCheck.waitSeconds}s`,
        ipAddress: ip,
        status: 'Failed'
      });

      return NextResponse.json(
        {
          success: false,
          message: `Too many failed login attempts. Please wait ${rateCheck.waitSeconds} seconds before trying again.`
        },
        { status: 429 }
      );
    }

    const user = await dbGetUserByEmail(cleanEmail);

    if (!user) {
      recordFailedAttempt(rateLimitKey);
      await dbAppendAuditLog({
        userId: 'anonymous',
        userEmail: cleanEmail,
        action: 'LOGIN_FAILED_UNKNOWN_USER',
        resourceType: 'Security',
        resourceId: cleanEmail,
        details: 'Attempted login with non-existent administrative email.',
        ipAddress: ip,
        status: 'Failed'
      });

      // Constant time/generic error to prevent account enumeration
      return NextResponse.json(
        { success: false, message: 'Invalid administrative email or password.' },
        { status: 401 }
      );
    }

    if (user.status === 'Disabled') {
      await dbAppendAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN_BLOCKED_DISABLED_ACCOUNT',
        resourceType: 'Security',
        resourceId: user.email,
        details: 'Login attempt on deactivated staff account.',
        ipAddress: ip,
        status: 'Failed'
      });

      return NextResponse.json(
        { success: false, message: 'This staff account has been deactivated. Contact the Super Administrator.' },
        { status: 403 }
      );
    }

    const isMatch = verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      recordFailedAttempt(rateLimitKey);
      await dbAppendAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN_FAILED_BAD_PASSWORD',
        resourceType: 'Security',
        resourceId: user.email,
        details: 'Failed password verification for registered staff account.',
        ipAddress: ip,
        status: 'Failed'
      });

      return NextResponse.json(
        { success: false, message: 'Invalid administrative email or password.' },
        { status: 401 }
      );
    }

    // Success: Reset rate limit
    resetRateLimit(rateLimitKey);

    // Update lastLogin in cloud DB & store
    await dbUpdateUserLastLogin(user.id);
    const now = new Date().toISOString();

    // Create session token
    const token = createSessionToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });

    await dbAppendAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'ADMIN_LOGIN_SUCCESS',
      resourceType: 'Security',
      resourceId: user.email,
      details: `Successful authenticated login with role: ${user.role}`,
      ipAddress: ip,
      status: 'Success'
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        lastLogin: now
      },
      token
    });

    // Set HTTP-only secure session cookie
    response.cookies.set('gujcorr_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;
  } catch (err: any) {
    console.error('[API/AUTH/LOGIN] Server error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server authentication error.' },
      { status: 500 }
    );
  }
}
