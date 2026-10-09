import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { getStore, saveStore, appendAuditLog, forwardToWordPress } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || (!hasCapability(session.role, 'manage_papers') && !hasCapability(session.role, 'score_papers'))) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions for technical papers.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const symposiumId = searchParams.get('symposiumId');
    const status = searchParams.get('status') || 'all';

    const store = getStore();
    let list = [...store.papers];

    if (symposiumId && symposiumId !== 'all') {
      list = list.filter(p => String(p.symposiumId) === String(symposiumId));
    }

    if (status !== 'all') {
      list = list.filter(p => (p.status || '').toLowerCase().includes(status.toLowerCase()));
    }

    if (search) {
      list = list.filter(p =>
        (p.paperTitle || '').toLowerCase().includes(search) ||
        (p.fullName || '').toLowerCase().includes(search) ||
        (p.email || '').toLowerCase().includes(search) ||
        (p.paperCode || p.id || '').toLowerCase().includes(search) ||
        (p.companyName || '').toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: list
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed fetching technical papers.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || (!hasCapability(session.role, 'manage_papers') && !hasCapability(session.role, 'score_papers'))) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions to review or score papers.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { paperCode, score, comments, status, assignedReviewer } = body;

    if (!paperCode) {
      return NextResponse.json(
        { success: false, message: 'paperCode is required.' },
        { status: 400 }
      );
    }

    const store = getStore();
    const paper = store.papers.find(p => p.paperCode === paperCode || p.id === paperCode);

    if (!paper) {
      return NextResponse.json(
        { success: false, message: 'Paper record not found.' },
        { status: 404 }
      );
    }

    const oldStatus = paper.status;
    if (score !== undefined) paper.reviewScore = Number(score);
    if (comments !== undefined) paper.reviewComments = comments;
    if (status !== undefined) paper.status = status;
    if (assignedReviewer !== undefined) paper.assignedReviewer = assignedReviewer;
    paper.updatedAt = new Date().toISOString();
    paper.reviewedBy = session.email;

    saveStore(store);

    // Forward review score to WordPress REST API if connected
    forwardToWordPress('/papers/score', 'POST', { paperCode, score, comments, status });

    // Audit log
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    appendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'SCORE_TECHNICAL_PAPER',
      resourceType: 'Paper',
      resourceId: paperCode,
      details: `Score: ${score !== undefined ? score : 'N/A'}/10. Decision: '${status || oldStatus}'. Reviewer: ${session.email}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Paper ${paperCode} review decisions saved.`,
      data: paper
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed updating paper record.' },
      { status: 500 }
    );
  }
}
