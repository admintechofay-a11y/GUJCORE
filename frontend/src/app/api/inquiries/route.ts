import { NextRequest, NextResponse } from 'next/server';
import { dbGetInquiries, dbInsertInquiry, dbAppendAuditLog } from '@/lib/server/db';

export async function GET() {
  try {
    const list = await dbGetInquiries();
    return NextResponse.json({
      success: true,
      data: list
    });
  } catch (err: any) {
    console.error('[API/INQUIRIES] GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed fetching inquiries.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, mobileNumber, organization, subject, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const inq = await dbInsertInquiry({
      name,
      email,
      mobileNumber: phone || mobileNumber || '',
      organization: organization || '',
      subject: subject || 'General Conference Inquiry',
      message: message || '',
      status: 'Unread'
    });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
      userId: 'public_visitor',
      userEmail: email,
      action: 'PUBLIC_CONTACT_INQUIRY',
      resourceType: 'Inquiry',
      resourceId: inq.id,
      details: `Inquiry submitted from ${name} (${email}) regarding '${subject || 'General'}'`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully.',
      data: inq
    });
  } catch (err: any) {
    console.error('[API/INQUIRIES] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed submitting inquiry.' },
      { status: 500 }
    );
  }
}

