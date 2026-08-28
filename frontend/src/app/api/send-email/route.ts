import { NextRequest, NextResponse } from 'next/server';
import { 
  sendMail, 
  getWelcomeEmailHtml, 
  getPaperSubmissionEmailHtml, 
  getPaymentPendingEmailHtml, 
  getPaymentSuccessEmailHtml, 
  getExhibitionBookedEmailHtml,
  getContactInquiryEmailHtml 
} from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, data = {} } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json({ success: false, error: 'Recipient email is required.' }, { status: 400 });
    }

    // Automatically resolve caller's host URL if in production / preview
    const origin = request.headers.get('origin');
    const fHost = request.headers.get('x-forwarded-host');
    const host = fHost || request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
    const detectedUrl = origin || (host ? `${proto}://${host}` : undefined);

    const emailData = {
      ...data,
      baseUrl: data.baseUrl || (detectedUrl && !detectedUrl.includes('localhost') ? detectedUrl : undefined)
    };

    let subject = 'GUJCORR 2027 Conference Notification';
    let html = '';

    switch (type) {
      case 'welcome':
      case 'registration':
        subject = `Welcome to GUJCORR 2027 – Account Created [${emailData.ticketId || 'GUJ27'}]`;
        html = getWelcomeEmailHtml(emailData);
        break;

      case 'paper_submitted':
        subject = `[GUJCORR 2027] Abstract Received: #${emailData.paperCode} - ${emailData.paperTitle?.substring(0, 45)}...`;
        html = getPaperSubmissionEmailHtml(emailData);
        break;

      case 'payment_pending':
      case 'provisional_pass':
        subject = `[GUJCORR 2027] Provisional Booking & Proforma Invoice #${emailData.ticketId}`;
        html = getPaymentPendingEmailHtml(emailData);
        break;

      case 'payment_success':
      case 'confirmed_badge':
        subject = `[CONFIRMED] GUJCORR 2027 Payment Receipt & Digital Entry Badge - ${emailData.ticketId}`;
        html = getPaymentSuccessEmailHtml(emailData);
        break;

      case 'exhibition_booked':
        subject = `[CONFIRMED] GUJCORR 2027 Exhibition Stall Reservation - #${emailData.stallNumber} (${emailData.companyName})`;
        html = getExhibitionBookedEmailHtml(emailData);
        break;

      case 'contact_inquiry':
        subject = `[GUJCORR 2027] We have received your inquiry: ${emailData.subject}`;
        html = getContactInquiryEmailHtml(emailData);
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
