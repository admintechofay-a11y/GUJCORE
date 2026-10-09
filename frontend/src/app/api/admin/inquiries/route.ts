import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { getStore, saveStore, appendAuditLog } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_inquiries')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions for inquiries.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const status = searchParams.get('status') || 'all';

    const store = getStore();
    let list = [...store.inquiries];

    if (status !== 'all') {
      list = list.filter(i => (i.status || '').toLowerCase() === status.toLowerCase());
    }

    if (search) {
      list = list.filter(i =>
        (i.name || '').toLowerCase().includes(search) ||
        (i.email || '').toLowerCase().includes(search) ||
        (i.subject || '').toLowerCase().includes(search) ||
        (i.organization || '').toLowerCase().includes(search) ||
        (i.message || '').toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: list
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed fetching inquiries.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_inquiries')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions to update inquiries.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status, internalNotes, assignedTo } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Inquiry id is required.' },
        { status: 400 }
      );
    }

    const store = getStore();
    const inq = store.inquiries.find(i => i.id === id);

    if (!inq) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found.' },
        { status: 404 }
      );
    }

    const oldStatus = inq.status;
    if (status !== undefined) inq.status = status;
    if (internalNotes !== undefined) inq.internalNotes = internalNotes;
    if (assignedTo !== undefined) inq.assignedTo = assignedTo;
    inq.updatedAt = new Date().toISOString();
    inq.updatedBy = session.email;

    saveStore(store);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    appendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_INQUIRY',
      resourceType: 'Inquiry',
      resourceId: id,
      details: `Status: '${oldStatus}' -> '${status || oldStatus}'. Assigned: ${assignedTo || inq.assignedTo || 'Unassigned'}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry updated successfully.',
      data: inq
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed updating inquiry.' },
      { status: 500 }
    );
  }
}
