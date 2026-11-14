import { NextRequest, NextResponse } from 'next/server';
import { dbGetRegistrations, dbInsertRegistration, dbAppendAuditLog } from '@/lib/server/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const list = await dbGetRegistrations({ status, search });
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Failed fetching registrations.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Delegate full name and email are required.' },
        { status: 400 }
      );
    }

    const saved = await dbInsertRegistration(body);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    await dbAppendAuditLog({
      userId: 'public_delegate',
      userEmail: body.email,
      action: 'SUBMIT_DELEGATE_REGISTRATION',
      resourceType: 'Registration',
      resourceId: saved.ticketId || saved.id,
      details: `New delegate pass registration: ${saved.ticketId} (${saved.category || saved.tierName || 'Delegate'})`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Registration confirmed and recorded in live database successfully.'
    });
  } catch (err: any) {
    console.error('[API/REGISTRATIONS] Submission error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error while recording registration.' },
      { status: 500 }
    );
  }
}

