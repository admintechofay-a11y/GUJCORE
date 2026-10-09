import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { getStore } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'view_audit_logs')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions to view administrative audit logs.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(200, Math.max(10, Number(searchParams.get('limit')) || 100));
    const action = searchParams.get('action') || 'all';

    const store = getStore();
    let logs = [...store.auditLogs];

    if (action !== 'all') {
      logs = logs.filter(l => l.action.toLowerCase() === action.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: logs.slice(0, limit)
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed fetching audit logs.' },
      { status: 500 }
    );
  }
}
