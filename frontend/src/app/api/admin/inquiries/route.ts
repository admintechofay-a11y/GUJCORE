import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { dbGetInquiries, dbUpdateInquiry, dbAppendAuditLog } from '@/lib/server/db';

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

    const list = await dbGetInquiries({ status, search });

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

    const existingList = await dbGetInquiries();
    const inq = existingList.find(i => i.id === id);

    if (!inq) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found.' },
        { status: 404 }
      );
    }

    const oldStatus = inq.status;
    await dbUpdateInquiry(id, { status, internalNotes, assignedTo });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
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
      data: { ...inq, status: status ?? inq.status, internalNotes: internalNotes ?? inq.internalNotes, assignedTo: assignedTo ?? inq.assignedTo }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed updating inquiry.' },
      { status: 500 }
    );
  }
}
