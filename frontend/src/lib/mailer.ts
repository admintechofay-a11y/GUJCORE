import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER || 'theaidrop80@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'brtowztxykrdeokt';
const SMTP_FROM = process.env.SMTP_FROM || 'GUJCORR 2027 Secretariat <theaidrop80@gmail.com>';

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: EmailPayload) {
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html
    });
    console.log(`[Mailer] Email delivered to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Mailer Error] Failed to send email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

// 1. Account Registration / Login Welcome Template
export function getWelcomeEmailHtml(data: {
  fullName: string;
  email: string;
  role: string;
  ticketId?: string;
  organization?: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: #0f172a; color: #ffffff; padding: 28px 24px; text-align: center; }
      .badge { display: inline-block; background: #dc2626; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px; }
      .content { padding: 28px 24px; line-height: 1.6; font-size: 14px; }
      .box { background: #f1f5f9; border-left: 4px solid #dc2626; padding: 14px 18px; border-radius: 8px; margin: 18px 0; }
      .cta { display: inline-block; background: #dc2626; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">GUJCORR 2027</div>
        <h2 style="margin:0; font-size:22px;">Welcome to GUJCORR 2027</h2>
        <p style="margin:6px 0 0 0; font-size:12px; color:#cbd5e1;">AMPP Gujarat & IIM Baroda Global Conference on Corrosion & Integrity</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>Thank you for creating your official conference account for <strong>GUJCORR 2027</strong> (18–20 February 2027 at The M.S. University of Baroda, Vadodara, Gujarat).</p>
        
        <div class="box">
          <strong>Your Account Credentials:</strong><br>
          &bull; <strong>Registered Email:</strong> ${data.email}<br>
          &bull; <strong>Role:</strong> ${data.role}<br>
          &bull; <strong>Attendee Reference ID:</strong> <span style="font-family:monospace; color:#dc2626; font-weight:bold;">${data.ticketId || 'GUJ27-DEL-PENDING'}</span><br>
          ${data.organization ? `&bull; <strong>Organization:</strong> ${data.organization}<br>` : ''}
        </div>

        <p><strong>Next Steps:</strong></p>
        <ul>
          <li><strong>Authors:</strong> Submit your 200–250 word research abstract across 14 symposia before 30th Sept 2026.</li>
          <li><strong>Delegates:</strong> Reserve your conference pass and download your Proforma GST Invoice.</li>
        </ul>

        <div style="text-align: center;">
          <a href="http://localhost:3000/masterhome" class="cta">Access Master Home Portal &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Secretariat</strong><br>
        Department of Metallurgical & Materials Engineering, The M.S. University of Baroda, Vadodara 390001<br>
        Email: iim.barodachapter@gmail.com &bull; Mobile: +91 99888 81674
      </div>
    </div>
  </body>
  </html>
  `;
}

// 2. Paper Submission Confirmation Template
export function getPaperSubmissionEmailHtml(data: {
  paperCode: string;
  fullName: string;
  email: string;
  paperTitle: string;
  symposiumTitle: string;
  presentationType: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: #0f766e; color: #ffffff; padding: 28px 24px; text-align: center; }
      .badge { display: inline-block; background: #042f2e; color: #5eead4; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px; }
      .content { padding: 28px 24px; line-height: 1.6; font-size: 14px; }
      .box { background: #f0fdfa; border-left: 4px solid #0f766e; padding: 14px 18px; border-radius: 8px; margin: 18px 0; }
      .cta { display: inline-block; background: #0f766e; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">Technical Proceedings</div>
        <h2 style="margin:0; font-size:22px;">Abstract Submission Acknowledgment</h2>
        <p style="margin:6px 0 0 0; font-size:12px; color:#ccfbf1;">GUJCORR 2027 Peer-Review Technical Committee</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>We have successfully received your research abstract for presentation at <strong>GUJCORR 2027</strong>.</p>
        
        <div class="box">
          <strong>Submission Details:</strong><br>
          &bull; <strong>Paper Reference ID:</strong> <span style="font-family:monospace; color:#0f766e; font-weight:bold; font-size:16px;">#${data.paperCode}</span><br>
          &bull; <strong>Paper Title:</strong> "${data.paperTitle}"<br>
          &bull; <strong>Symposium:</strong> ${data.symposiumTitle}<br>
          &bull; <strong>Presentation Category:</strong> ${data.presentationType} Presentation<br>
          &bull; <strong>Initial Status:</strong> Submitted (Under Peer Review)
        </div>

        <p><strong>Important Key Dates for Authors:</strong></p>
        <ul>
          <li><strong>Peer Review Notification:</strong> 31st October 2026</li>
          <li><strong>Full Camera-Ready Manuscript Due:</strong> 30th November 2026</li>
          <li><strong>Delegate Pass Registration Deadline:</strong> 15th December 2026 (Required to confirm podium presentation slot)</li>
        </ul>

        <div style="text-align: center;">
          <a href="http://localhost:3000/registration?from=paper&paperId=${data.paperCode}" class="cta">Book Author Delegate Pass &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Technical Committee</strong><br>
        AMPP Gujarat Chapter &amp; The Indian Institute of Metals Baroda Chapter<br>
        Email: iim.barodachapter@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}

// 3. Pass Registration (Payment Pending / Bank Wire Remittance)
export function getPaymentPendingEmailHtml(data: {
  ticketId: string;
  fullName: string;
  email: string;
  category: string;
  totalAmount: number;
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: #d97706; color: #ffffff; padding: 28px 24px; text-align: center; }
      .badge { display: inline-block; background: #78350f; color: #fde68a; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px; }
      .content { padding: 28px 24px; line-height: 1.6; font-size: 14px; }
      .box { background: #fffbeb; border-left: 4px solid #d97706; padding: 14px 18px; border-radius: 8px; margin: 18px 0; }
      .bank-box { background: #0f172a; color: #f8fafc; padding: 16px 20px; border-radius: 12px; margin: 18px 0; font-family: monospace; font-size: 12px; }
      .cta { display: inline-block; background: #2563eb; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">Provisional Booking</div>
        <h2 style="margin:0; font-size:22px;">Provisional Registration &amp; Proforma Invoice</h2>
        <p style="margin:6px 0 0 0; font-size:12px; color:#fef3c7;">Awaiting Wire Transfer / Online Checkout</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>Your provisional delegate seat for <strong>GUJCORR 2027</strong> has been reserved. Please complete your registration payment to confirm your digital badge.</p>
        
        <div class="box">
          <strong>Registration Summary:</strong><br>
          &bull; <strong>Provisional Ticket ID:</strong> <span style="font-family:monospace; font-weight:bold; color:#d97706;">${data.ticketId}</span><br>
          &bull; <strong>Pass Tier:</strong> ${data.category}<br>
          &bull; <strong>Total Amount Due (with 18% GST):</strong> <span style="font-size:16px; font-weight:bold; color:#0f172a;">₹${data.totalAmount.toLocaleString('en-IN')}</span><br>
          &bull; <strong>SAC Code:</strong> 998397 (Scientific &amp; Technical Services)
        </div>

        <p><strong>Bank Wire Transfer / NEFT / RTGS Coordinates:</strong></p>
        <div class="bank-box">
          <strong>Bank Name:</strong> Union Bank of India<br>
          <strong>Branch:</strong> Dandia Bazar, Vadodara<br>
          <strong>Account Name:</strong> INDIAN INSTITUTE OF METALS BARODA CHAPTER<br>
          <strong>Account Number:</strong> 520101234030441<br>
          <strong>IFSC Code:</strong> UBIN0901555<br>
          <strong>Account Type:</strong> Savings Account
        </div>

        <p>After transferring, please share your UTR / Transaction Reference number with the secretariat to receive your verified confirmed badge.</p>

        <div style="text-align: center;">
          <a href="http://localhost:3000/invoice" class="cta">View Proforma GST Invoice &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Secretariat</strong><br>
        The Indian Institute of Metals Baroda Chapter &bull; AMPP Gujarat Chapter<br>
        Email: iim.barodachapter@gmail.com &bull; Phone: +91 99888 81674
      </div>
    </div>
  </body>
  </html>
  `;
}

// 4. Confirmed Payment & Official Tax Receipt Template
export function getPaymentSuccessEmailHtml(data: {
  ticketId: string;
  fullName: string;
  email: string;
  category: string;
  amount: number;
  transactionRef: string;
  paymentMethod: string;
}) {
  const basePrice = Math.round(data.amount / 1.18);
  const gstAmount = data.amount - basePrice;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: #16a34a; color: #ffffff; padding: 28px 24px; text-align: center; }
      .badge { display: inline-block; background: #14532d; color: #86efac; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px; }
      .content { padding: 28px 24px; line-height: 1.6; font-size: 14px; }
      .box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 8px; margin: 18px 0; }
      .receipt-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
      .receipt-table th, .receipt-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
      .receipt-table th { background: #f8fafc; font-weight: 700; color: #475569; }
      .cta { display: inline-block; background: #16a34a; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">Official Tax Receipt &amp; Confirmed Pass</div>
        <h2 style="margin:0; font-size:22px;">Payment Successful &bull; Confirmed Delegate</h2>
        <p style="margin:6px 0 0 0; font-size:12px; color:#dcfce7;">GUJCORR 2027 &bull; 18–20 February 2027 &bull; Vadodara</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>We are pleased to confirm your full registration payment for <strong>GUJCORR 2027</strong>. Your official digital QR Delegate Badge has been activated.</p>
        
        <div class="box">
          <strong>Registration Credentials:</strong><br>
          &bull; <strong>Delegate Ticket ID:</strong> <span style="font-family:monospace; font-weight:bold; color:#16a34a; font-size:16px;">${data.ticketId}</span><br>
          &bull; <strong>Pass Category:</strong> ${data.category}<br>
          &bull; <strong>Payment Gateway Ref:</strong> <span style="font-family:monospace; color:#475569;">${data.transactionRef}</span><br>
          &bull; <strong>Payment Mode:</strong> ${data.paymentMethod}<br>
          &bull; <strong>Status:</strong> <span style="color:#16a34a; font-weight:bold;">CONFIRMED &amp; PAID</span>
        </div>

        <table class="receipt-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>SAC Code</th>
              <th>Rate</th>
              <th style="text-align:right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GUJCORR 2027 Delegate Pass (${data.category})</td>
              <td>998397</td>
              <td>1</td>
              <td style="text-align:right;">₹${basePrice.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td colspan="3">Central GST (CGST 9%)</td>
              <td style="text-align:right;">₹${(gstAmount / 2).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td colspan="3">State GST (SGST 9%)</td>
              <td style="text-align:right;">₹${(gstAmount / 2).toLocaleString('en-IN')}</td>
            </tr>
            <tr style="font-weight:bold; background:#f8fafc;">
              <td colspan="3">Total Paid (Inclusive of 18% GST)</td>
              <td style="text-align:right; color:#16a34a; font-size:14px;">₹${data.amount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div style="text-align: center;">
          <a href="http://localhost:3000/masterhome" class="cta">View &amp; Print QR Entry Badge &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Conference Secretariat</strong><br>
        Organized by AMPP Gujarat Chapter &amp; The Indian Institute of Metals Baroda Chapter<br>
        Department of Metallurgical &amp; Materials Engineering, The M.S. University of Baroda, Vadodara 390001<br>
        GST Registration SAC: 998397 &bull; Email: iim.barodachapter@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}

// 5. Contact Form Inquiry Notification Template
export function getContactInquiryEmailHtml(data: {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: #1e293b; color: #ffffff; padding: 24px; text-align: center; }
      .content { padding: 24px; line-height: 1.6; font-size: 14px; }
      .box { background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 8px; margin: 18px 0; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h2 style="margin:0; font-size:20px;">Inquiry Acknowledgment</h2>
        <p style="margin:4px 0 0 0; font-size:12px; color:#94a3b8;">GUJCORR 2027 Secretariat Desk</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.name}</strong>,</p>
        <p>Thank you for reaching out to the GUJCORR 2027 Organizing Committee. We have received your inquiry regarding <strong>"${data.subject}"</strong>.</p>
        
        <div class="box">
          <strong>Message Received:</strong><br>
          <p style="margin:8px 0; font-style:italic;">"${data.message}"</p>
          <small style="color:#64748b;">From: ${data.name} (${data.email}) ${data.phone ? `&bull; Tel: ${data.phone}` : ''}</small>
        </div>

        <p>Our secretariat desk will review your inquiry and respond within 24–48 hours.</p>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Secretariat</strong> &bull; iim.barodachapter@gmail.com &bull; +91 99888 81674
      </div>
    </div>
  </body>
  </html>
  `;
}
