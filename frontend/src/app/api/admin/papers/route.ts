import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { dbGetPapers, dbUpdatePaperDecision, dbDeletePaper, dbAppendAuditLog } from '@/lib/server/db';
import { forwardToWordPress } from '@/lib/server/store';

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
    const search = searchParams.get('search');
    const symposiumId = searchParams.get('symposiumId');
    const status = searchParams.get('status');

    const list = await dbGetPapers({ symposiumId, status, search });

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
    const { paperCode, score, comments, status, assignedReviewer, reviewType = 'abstract' } = body;

    if (!paperCode) {
      return NextResponse.json(
        { success: false, message: 'paperCode is required.' },
        { status: 400 }
      );
    }

    await dbUpdatePaperDecision(paperCode, score, comments, status, assignedReviewer, session.email, reviewType);

    // Forward review score to WordPress REST API if connected
    forwardToWordPress('/papers/score', 'POST', { paperCode, score, comments, status, reviewType });

    // Audit log
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: reviewType === 'full_paper' ? 'REVIEW_FULL_PAPER_MANUSCRIPT' : 'SCORE_TECHNICAL_PAPER',
      resourceType: 'Paper',
      resourceId: paperCode,
      details: `${reviewType === 'full_paper' ? 'Full Paper' : 'Abstract'} Decision: '${status || 'Updated'}'. Score: ${score !== undefined ? score : 'N/A'}/10. Reviewer: ${session.email}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `${reviewType === 'full_paper' ? 'Full paper manuscript' : 'Abstract'} decision for paper ${paperCode} saved in live database.`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed saving review decision.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_papers')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions to delete papers.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const paperCode = searchParams.get('paperCode') || searchParams.get('id');

    if (!paperCode) {
      return NextResponse.json(
        { success: false, message: 'paperCode is required for deletion.' },
        { status: 400 }
      );
    }

    await dbDeletePaper(paperCode);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'DELETE_TECHNICAL_PAPER',
      resourceType: 'Paper',
      resourceId: paperCode,
      details: `Paper #${paperCode} permanently deleted by administrator ${session.email}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Paper #${paperCode} deleted from database successfully.`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed deleting paper.' },
      { status: 500 }
    );
  }
}
