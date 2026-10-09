import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { getStore, saveStore, appendAuditLog } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const store = getStore();
    return NextResponse.json({
      success: true,
      data: store.content
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed fetching CMS content.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_content')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions to edit conference website content.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { sectionKey, data } = body;

    if (!sectionKey || data === undefined) {
      return NextResponse.json(
        { success: false, message: 'sectionKey and data are required.' },
        { status: 400 }
      );
    }

    const store = getStore();
    store.content[sectionKey] = data;
    saveStore(store);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    appendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_CMS_CONTENT',
      resourceType: 'CMS_Content',
      resourceId: sectionKey,
      details: `Live conference CMS content updated for section: '${sectionKey}'`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Content section '${sectionKey}' published successfully.`,
      data: store.content[sectionKey]
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed updating CMS content.' },
      { status: 500 }
    );
  }
}
