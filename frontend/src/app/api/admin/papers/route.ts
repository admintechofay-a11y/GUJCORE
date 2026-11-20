import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { dbGetPapers, dbGetPaperByCode, dbUpdatePaperDecision, dbDeletePaper, dbAppendAuditLog } from '@/lib/server/db';
import { forwardToWordPress } from '@/lib/server/store';
import { 
  sendMail, 
  getAbstractAcceptedEmailHtml, 
  getAbstractRevisionEmailHtml, 
  getFullPaperAcceptedEmailHtml, 
  getFullPaperRevisionEmailHtml, 
  getPaperStatusNotificationEmailHtml 
} from '@/lib/mailer';

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

    // Fetch updated paper details to deliver automated email to author
    let emailSent = false;
    let emailTypeSent = '';
    let authorEmail = '';

    try {
      const paper = await dbGetPaperByCode(paperCode);
      if (paper && paper.email && paper.email.includes('@')) {
        authorEmail = paper.email.trim();
        const origin = request.headers.get('origin');
        const fHost = request.headers.get('x-forwarded-host');
        const host = fHost || request.headers.get('host');
        const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
        const detectedUrl = origin || (host ? `${proto}://${host}` : undefined);

        const emailPayloadData = {
          fullName: paper.fullName || 'Author',
          email: authorEmail,
          paperCode: paper.paperCode || paper.id,
          paperTitle: paper.paperTitle || 'Technical Research Paper',
          symposiumTitle: paper.symposiumTitle || 'Technical Session',
          symposiumId: paper.symposiumId,
          presentationType: paper.presentationType || 'Oral',
          score: score ?? (reviewType === 'full_paper' ? paper.fullPaperScore : paper.reviewScore),
          comments: comments ?? (reviewType === 'full_paper' ? paper.fullPaperReviewComments : paper.reviewComments),
          status: status ?? (reviewType === 'full_paper' ? paper.fullPaperStatus : paper.status),
          reviewType: reviewType as 'abstract' | 'full_paper',
          baseUrl: detectedUrl && !detectedUrl.includes('localhost') ? detectedUrl : undefined
        };

        const effectiveStatus = (emailPayloadData.status || '').toLowerCase();
        const hasComments = Boolean(emailPayloadData.comments && emailPayloadData.comments.trim().length > 0);

        let emailSubject = '';
        let emailHtml = '';

        if (reviewType === 'full_paper') {
          if (effectiveStatus.includes('accept') || effectiveStatus.includes('proceeding')) {
            emailSubject = `🎉 ACCEPTED FOR PROCEEDINGS: Full Paper Approved - GUJCORR 2027 [Paper #${emailPayloadData.paperCode}]`;
            emailHtml = getFullPaperAcceptedEmailHtml(emailPayloadData);
            emailTypeSent = 'full_paper_accepted';
          } else if (effectiveStatus.includes('revision') || (hasComments && !effectiveStatus.includes('accept'))) {
            emailSubject = `[ACTION REQUIRED] GUJCORR 2027: Revisions Requested for Full Paper #${emailPayloadData.paperCode}`;
            emailHtml = getFullPaperRevisionEmailHtml({ ...emailPayloadData, comments: emailPayloadData.comments || 'Revisions requested by technical committee.' });
            emailTypeSent = 'full_paper_revision';
          } else {
            emailSubject = `[GUJCORR 2027] Full Paper Status Update: Paper #${emailPayloadData.paperCode} - ${emailPayloadData.status}`;
            emailHtml = getPaperStatusNotificationEmailHtml(emailPayloadData);
            emailTypeSent = 'full_paper_status_update';
          }
        } else {
          // Abstract review decision
          if (effectiveStatus.includes('accept') || effectiveStatus.includes('oral') || effectiveStatus.includes('poster')) {
            emailSubject = `🎉 CONGRATULATIONS: Abstract Accepted for Presentation at GUJCORR 2027 [Paper #${emailPayloadData.paperCode}]`;
            emailHtml = getAbstractAcceptedEmailHtml(emailPayloadData);
            emailTypeSent = 'abstract_accepted';
          } else if (effectiveStatus.includes('revision') || (hasComments && !effectiveStatus.includes('accept'))) {
            emailSubject = `[ACTION REQUIRED] GUJCORR 2027: Revisions Requested for Abstract #${emailPayloadData.paperCode}`;
            emailHtml = getAbstractRevisionEmailHtml({ ...emailPayloadData, comments: emailPayloadData.comments || 'Revisions requested by technical committee.' });
            emailTypeSent = 'abstract_revision';
          } else {
            emailSubject = `[GUJCORR 2027] Abstract Status Update: Paper #${emailPayloadData.paperCode} - ${emailPayloadData.status}`;
            emailHtml = getPaperStatusNotificationEmailHtml(emailPayloadData);
            emailTypeSent = 'abstract_status_update';
          }
        }

        const mailRes = await sendMail({
          to: authorEmail,
          subject: emailSubject,
          html: emailHtml
        });
        emailSent = mailRes.success;
        if (emailSent) {
          console.log(`[API /admin/papers] Sent ${emailTypeSent} notification to author ${authorEmail} for paper ${paperCode}`);
        }
      }
    } catch (mErr) {
      console.warn(`[API /admin/papers] Failed delivering review notification email for paper ${paperCode}:`, mErr);
    }

    // Audit log
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: reviewType === 'full_paper' ? 'REVIEW_FULL_PAPER_MANUSCRIPT' : 'SCORE_TECHNICAL_PAPER',
      resourceType: 'Paper',
      resourceId: paperCode,
      details: `${reviewType === 'full_paper' ? 'Full Paper' : 'Abstract'} Decision: '${status || 'Updated'}'. Score: ${score !== undefined ? score : 'N/A'}/10. Reviewer: ${session.email}${emailSent ? ` (Notification email delivered to ${authorEmail})` : ''}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `${reviewType === 'full_paper' ? 'Full paper' : 'Abstract'} decision for paper ${paperCode} saved in live database.${emailSent ? ` Notification email sent to ${authorEmail}.` : ''}`,
      emailSent,
      authorEmail
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
