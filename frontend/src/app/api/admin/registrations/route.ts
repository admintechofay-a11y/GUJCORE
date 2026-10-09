import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { getStore, saveStore, appendAuditLog, forwardToWordPress } from '@/lib/server/store';

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
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';

    const store = getStore();
    let list = [...store.registrations];

    if (status !== 'all') {
      list = list.filter(r => (r.status || '').toLowerCase() === status.toLowerCase());
    }

    if (category !== 'all') {
      list = list.filter(r => (r.category || '').toLowerCase() === category.toLowerCase());
    }

    if (search) {
      list = list.filter(r => 
        (r.fullName || '').toLowerCase().includes(search) ||
        (r.email || '').toLowerCase().includes(search) ||
        (r.ticketId || '').toLowerCase().includes(search) ||
        (r.organization || '').toLowerCase().includes(search) ||
        (r.mobileNumber || '').includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: list
    });
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
    const { ticketId, status, transactionReference, notes } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { success: false, message: 'ticketId and status are required.' },
        { status: 400 }
      );
    }

    const store = getStore();
    const reg = store.registrations.find(r => r.ticketId === ticketId || r.id === ticketId);

    if (!reg) {
      return NextResponse.json(
        { success: false, message: 'Registration record not found.' },
        { status: 404 }
      );
    }

    const oldStatus = reg.status;
    reg.status = status;
    if (transactionReference !== undefined) {
      reg.transactionReference = transactionReference;
    }
    if (notes !== undefined) {
      reg.adminNotes = notes;
    }
    reg.updatedAt = new Date().toISOString();
    reg.updatedBy = session.email;

    saveStore(store);

    // Forward update to WordPress REST API if connected
    forwardToWordPress('/registrations/status', 'POST', { ticketId, status });

    // Audit log
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    appendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_REGISTRATION_STATUS',
      resourceType: 'Registration',
      resourceId: ticketId,
      details: `Changed status from '${oldStatus}' to '${status}'. Ref: ${transactionReference || reg.transactionReference || 'N/A'}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Registration ${ticketId} status updated to ${status}.`,
      data: reg
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed updating registration record.' },
      { status: 500 }
    );
  }
}
