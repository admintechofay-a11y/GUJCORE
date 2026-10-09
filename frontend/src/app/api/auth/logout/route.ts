import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/auth';
import { appendAuditLog } from '@/lib/server/store';

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    if (session) {
      appendAuditLog({
        userId: session.userId,
        userEmail: session.email,
        action: 'ADMIN_LOGOUT',
        resourceType: 'Security',
        resourceId: session.email,
        details: 'Staff member signed out.',
        ipAddress: ip,
        status: 'Success'
      });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.'
    });

    // Clear cookie
    response.cookies.set('gujcorr_session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Logout failed.' },
      { status: 500 }
    );
  }
}
