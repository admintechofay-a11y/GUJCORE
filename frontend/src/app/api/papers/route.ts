import { NextRequest, NextResponse } from 'next/server';
import { dbGetPapers, dbInsertPaper, dbAttachPaperFile, dbAppendAuditLog } from '@/lib/server/db';

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

    // Support attaching/uploading a full text manuscript to an existing paper
    if (body.action === 'attach_file' || (body.paperCode && body.fileData && !body.paperTitle)) {
      if (!body.paperCode || !body.fileData) {
        return NextResponse.json(
          { success: false, message: 'paperCode and fileData are required to attach manuscript.' },
          { status: 400 }
        );
      }

      const docType = body.docType || 'full_paper';
      const chunkIndex = typeof body.chunkIndex === 'number' ? body.chunkIndex : undefined;
      await dbAttachPaperFile(body.paperCode, {
        fileName: body.fileName || (docType === 'presentation' ? 'presentation.pptx' : 'manuscript.pdf'),
        fileType: body.fileType || (docType === 'presentation' ? 'application/vnd.ms-powerpoint' : 'application/pdf'),
        fileSize: body.fileSize || 'Unknown',
        fileData: body.fileData
      }, docType, chunkIndex);

      if (chunkIndex === undefined || chunkIndex === 0) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
        await dbAppendAuditLog({
          userId: 'author_or_admin',
          userEmail: body.email || 'author@gujcorr.org',
          action: docType === 'presentation' ? 'ATTACH_PAPER_PRESENTATION' : docType === 'abstract' ? 'ATTACH_PAPER_ABSTRACT' : 'ATTACH_PAPER_MANUSCRIPT',
          resourceType: 'Paper',
          resourceId: body.paperCode,
          details: `Attached ${docType} file: ${body.fileName || 'document'} (${body.fileSize || 'N/A'})`,
          ipAddress: ip,
          status: 'Success'
        });
      }

      return NextResponse.json({
        success: true,
        message: `${docType === 'presentation' ? 'Presentation slide deck' : 'Document'} for paper #${body.paperCode} saved to live database successfully.`
      });
    }

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

