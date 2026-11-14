import { NextRequest, NextResponse } from 'next/server';
import { dbGetPapers, dbInsertPaper, dbAppendAuditLog } from '@/lib/server/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symposiumId = searchParams.get('symposiumId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const list = await dbGetPapers({ symposiumId, status, search });
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Failed fetching papers.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.paperTitle || !body.fullName || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Paper title, author full name, and email are required.' },
        { status: 400 }
      );
    }

    const saved = await dbInsertPaper(body);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    await dbAppendAuditLog({
      userId: 'public_author',
      userEmail: body.email,
      action: 'SUBMIT_PAPER_ABSTRACT',
      resourceType: 'Paper',
      resourceId: saved.paperCode || saved.id,
      details: `New paper abstract submitted: "${saved.paperTitle}"`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Abstract submitted and recorded in live database successfully.'
    });
  } catch (err: any) {
    console.error('[API/PAPERS] Submission error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error while recording paper submission.' },
      { status: 500 }
    );
  }
}

