import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/auth';
import { getStore } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated session.' },
        { status: 401 }
      );
    }

    const store = getStore();
    const user = store.users.find(u => u.id === session.userId || u.email.toLowerCase() === session.email.toLowerCase());

    if (!user || user.status === 'Disabled') {
      return NextResponse.json(
        { success: false, message: 'User account not found or disabled.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Error verifying session.' },
      { status: 500 }
    );
  }
}
