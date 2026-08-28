import { NextRequest, NextResponse } from 'next/server';
import { 
  sendMail, 
  getWelcomeEmailHtml, 
  getPaperSubmissionEmailHtml, 
  getPaymentPendingEmailHtml, 
  getPaymentSuccessEmailHtml, 
  getContactInquiryEmailHtml 
} from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json({ success: false, error: 'Recipient email is required.' }, { status: 400 });
    }

    let subject = 'GUJCORR 2027 Conference Notification';
    let html = '';

    switch (type) {
      case 'welcome':
      case 'registration':
        subject = `Welcome to GUJCORR 2027 – Account Created [${data.ticketId || 'GUJ27'}]`;
        html = getWelcomeEmailHtml(data);
        break;

      case 'paper_submitted':
        subject = `[GUJCORR 2027] Abstract Received: #${data.paperCode} - ${data.paperTitle?.substring(0, 45)}...`;
        html = getPaperSubmissionEmailHtml(data);
        break;

      case 'payment_pending':
      case 'provisional_pass':
        subject = `[GUJCORR 2027] Provisional Booking & Proforma Invoice #${data.ticketId}`;
        html = getPaymentPendingEmailHtml(data);
        break;

      case 'payment_success':
      case 'confirmed_badge':
        subject = `[CONFIRMED] GUJCORR 2027 Payment Receipt & Digital Entry Badge - ${data.ticketId}`;
        html = getPaymentSuccessEmailHtml(data);
        break;

      case 'contact_inquiry':
        subject = `[GUJCORR 2027] We have received your inquiry: ${data.subject}`;
        html = getContactInquiryEmailHtml(data);
        break;

      default:
        return NextResponse.json({ success: false, error: `Unsupported email template type: ${type}` }, { status: 400 });
    }

    const result = await sendMail({ to, subject, html });

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[API Send-Email Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
