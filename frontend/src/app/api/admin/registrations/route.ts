import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { dbGetRegistrations, dbUpdateRegistrationStatus, dbDeleteRegistration, dbAppendAuditLog } from '@/lib/server/db';
import { forwardToWordPress } from '@/lib/server/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_registrations')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions for delegate registrations.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const list = await dbGetRegistrations({ status, search });

    return NextResponse.json(
      {
        success: true,
        data: list
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed fetching registrations.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_registrations')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions to modify registrations.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ticketId, status } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { success: false, message: 'ticketId and status are required.' },
        { status: 400 }
      );
    }

    await dbUpdateRegistrationStatus(ticketId, status);

    // Forward update to WordPress REST API if connected
    forwardToWordPress('/registrations/status', 'POST', { ticketId, status });

    // Audit log
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_REGISTRATION_STATUS',
      resourceType: 'Registration',
      resourceId: ticketId,
      details: `Status updated to: "${status}". Staff: ${session.email}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Registration ${ticketId} status updated in live database.`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed updating registration status.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_registrations')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions to delete registrations.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId') || searchParams.get('id');

    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: 'ticketId is required for deletion.' },
        { status: 400 }
      );
    }

    await dbDeleteRegistration(ticketId);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'DELETE_DELEGATE_REGISTRATION',
      resourceType: 'Registration',
      resourceId: ticketId,
      details: `Delegate registration #${ticketId} permanently deleted by administrator ${session.email}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Registration #${ticketId} deleted from database successfully.`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed deleting registration.' },
      { status: 500 }
    );
  }
}
