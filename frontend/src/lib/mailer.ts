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

export function getBaseUrl(overrideUrl?: string): string {
  // 1. If explicit override passed and not localhost, use it
  if (overrideUrl && overrideUrl.startsWith('http') && !overrideUrl.includes('localhost')) {
    return overrideUrl.replace(/\/$/, '');
  }

  // 2. Custom environment variable (e.g. from Vercel or .env.local)
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('localhost')) {
    return envUrl.replace(/\/$/, '');
  }

  // 3. Vercel deployment URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, '')}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }

  // 4. If override or envUrl provided (even if localhost)
  if (overrideUrl && overrideUrl.startsWith('http')) {
    return overrideUrl.replace(/\/$/, '');
  }

  if (envUrl && envUrl.startsWith('http')) {
    return envUrl.replace(/\/$/, '');
  }

  // 5. Safe production fallback so buttons in emails always open live portal
  return 'https://amppgujarat.org';
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
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
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
          <li><strong>Authors:</strong> Submit your 200–250 word research abstract across 14 symposia before 28th October 2026.</li>
          <li><strong>Delegates:</strong> Reserve your conference pass and download your Proforma GST Invoice.</li>
        </ul>

        <div style="text-align: center;">
          <a href="${baseUrl}/masterhome" class="cta">Access Master Home Portal &rarr;</a>
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
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
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
          <li><strong>Full Camera-Ready Manuscript Due:</strong> 25th November 2026</li>
          <li><strong>Delegate Pass Registration Deadline:</strong> 25th December 2026 (Required to confirm podium presentation slot)</li>
        </ul>

        <div style="text-align: center;">
          <a href="${baseUrl}/registration?from=paper&paperId=${data.paperCode}" class="cta">Book Author Delegate Pass &rarr;</a>
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
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
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
          <a href="${baseUrl}/invoice" class="cta">View Proforma GST Invoice &rarr;</a>
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
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
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
      .cta-outline { display: inline-block; background: #ffffff; color: #0f172a !important; font-weight: bold; text-decoration: none; padding: 12px 20px; border-radius: 10px; margin-top: 14px; margin-left: 8px; border: 1px solid #cbd5e1; }
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

        <div style="text-align: center; margin-top: 20px;">
          <a href="${baseUrl}/masterhome" class="cta">View &amp; Print QR Entry Badge &rarr;</a>
          <a href="${baseUrl}/invoice" class="cta-outline">Download Tax Invoice</a>
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

// 5. Exhibition Stall Booking Confirmation Template
export function getExhibitionBookedEmailHtml(data: {
  stallNumber: string;
  stallType: string;
  areaSqm: number;
  companyName: string;
  contactPerson: string;
  fasciaName: string;
  totalPrice: number;
  status: string;
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: #831843; color: #ffffff; padding: 28px 24px; text-align: center; }
      .badge { display: inline-block; background: #500724; color: #fbcfe8; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px; }
      .content { padding: 28px 24px; line-height: 1.6; font-size: 14px; }
      .box { background: #fdf2f8; border-left: 4px solid #db2777; padding: 14px 18px; border-radius: 8px; margin: 18px 0; }
      .cta { display: inline-block; background: #db2777; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">Trade Expo &bull; Sarabhai Pavilion</div>
        <h2 style="margin:0; font-size:22px;">Exhibition Stall Reservation</h2>
        <p style="margin:6px 0 0 0; font-size:12px; color:#fce7f3;">GUJCORR 2027 &bull; 18–20 February 2027 &bull; Vadodara</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.contactPerson}</strong>,</p>
        <p>We are pleased to acknowledge the booth reservation for <strong>${data.companyName}</strong> at the GUJCORR 2027 Technology Exhibition Arena.</p>
        
        <div class="box">
          <strong>Stall Allocation Details:</strong><br>
          &bull; <strong>Allocated Stall Number:</strong> <span style="font-family:monospace; font-weight:bold; color:#831843; font-size:16px;">#${data.stallNumber}</span><br>
          &bull; <strong>Booth Category:</strong> ${data.stallType} (${data.areaSqm} sqm)<br>
          &bull; <strong>Fascia Board Title:</strong> <span style="font-family:monospace; font-weight:bold;">${data.fasciaName}</span><br>
          &bull; <strong>Total Tariff:</strong> ₹${data.totalPrice.toLocaleString('en-IN')} (Inclusive of 18% GST)<br>
          &bull; <strong>Booking Status:</strong> <span style="color:#db2777; font-weight:bold;">${data.status}</span>
        </div>

        <p><strong>Standard Stall Inclusions:</strong></p>
        <ul>
          <li>Pre-fabricated Octanorm modular shell scheme with corporate fascia lettering</li>
          <li>Power sockets (5A/15A), spotlights, executive table, and visitor chairs</li>
          <li>Complimentary full-conference delegate passes with VIP lunch catering</li>
          <li>Corporate logo & profile listing in the printed GUJCORR 2027 Souvenir Directory</li>
        </ul>

        <div style="text-align: center;">
          <a href="${baseUrl}/exhibition" class="cta">View Interactive Floor Plan &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Exhibition Secretariat</strong><br>
        The Indian Institute of Metals Baroda Chapter &bull; AMPP Gujarat Chapter<br>
        Email: iim.barodachapter@gmail.com &bull; Phone: +91 99888 81674
      </div>
    </div>
  </body>
  </html>
  `;
}

// 6. Contact Form Inquiry Notification Template
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

// 7. Abstract Accepted by Technical Committee Notification Template
export function getAbstractAcceptedEmailHtml(data: {
  fullName: string;
  email: string;
  paperCode: string;
  paperTitle: string;
  symposiumTitle: string;
  symposiumId?: number | string;
  presentationType?: string;
  score?: number | string;
  comments?: string;
  status?: string;
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
      .header { background: #065f46; color: #ffffff; padding: 30px 24px; text-align: center; }
      .badge { display: inline-block; background: #022c22; color: #6ee7b7; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 6px; margin-bottom: 8px; letter-spacing: 0.5px; }
      .content { padding: 30px 26px; line-height: 1.6; font-size: 14px; }
      .box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 8px; margin: 20px 0; }
      .comments-box { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #065f46; padding: 14px 18px; border-radius: 8px; margin: 16px 0; font-size: 13px; }
      .cta { display: inline-block; background: #059669; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin: 8px 4px; }
      .cta-outline { display: inline-block; background: #ffffff; color: #065f46 !important; font-weight: bold; text-decoration: none; padding: 12px 22px; border-radius: 10px; margin: 8px 4px; border: 1.5px solid #059669; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">GUJCORR 2027 &bull; Official Acceptance Notification</div>
        <h2 style="margin:0; font-size:22px;">Congratulations! Your Abstract Has Been Accepted</h2>
        <p style="margin:6px 0 0 0; font-size:13px; color:#d1fae5;">Technical Review Committee &bull; GUJCORR 2027 (18–20 Feb 2027, Vadodara)</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>On behalf of the <strong>GUJCORR 2027 Technical Program Committee</strong> (jointly organized by AMPP Gujarat Chapter and The Indian Institute of Metals Baroda Chapter), we are pleased to inform you that your research abstract has been <strong>ACCEPTED</strong> for presentation at the conference.</p>
        
        <div class="box">
          <strong style="color:#065f46; font-size:15px;">Accepted Abstract Details:</strong><br><br>
          &bull; <strong>Paper Code:</strong> <span style="font-family:monospace; font-weight:bold; color:#065f46; font-size:15px;">#${data.paperCode}</span><br>
          &bull; <strong>Paper Title:</strong> "${data.paperTitle}"<br>
          &bull; <strong>Symposium:</strong> Track ${data.symposiumId ? `${data.symposiumId}: ` : ''}${data.symposiumTitle}<br>
          &bull; <strong>Presentation Format:</strong> <span style="font-weight:bold; color:#047857;">${data.presentationType || 'Oral'} Presentation</span><br>
          &bull; <strong>Decision Status:</strong> <span style="color:#059669; font-weight:bold;">${data.status || 'Accepted for Oral Presentation'}</span>
          ${data.score ? `<br>&bull; <strong>Technical Evaluation Score:</strong> <strong>${data.score}/10</strong>` : ''}
        </div>

        ${data.comments ? `
        <div class="comments-box">
          <strong>Review Committee Remarks:</strong><br>
          <p style="margin:6px 0 0 0; font-style:italic;">"${data.comments}"</p>
        </div>` : ''}

        <p><strong>Critical Next Milestones for Authors:</strong></p>
        <ol style="padding-left: 20px; line-height: 1.8;">
          <li><strong>Download Official Acceptance Letter:</strong> Your formal signed Acceptance Letter is ready on your author portal.</li>
          <li><strong>Submit Camera-Ready Full Paper:</strong> The deadline to upload your camera-ready full paper manuscript (.pdf or .docx) for publication in the official ISBN Conference Proceedings is <strong>15 December 2026</strong>.</li>
          <li><strong>Author Delegate Registration:</strong> At least one author must register for the conference by <strong>25 December 2026</strong> to confirm your podium slot in the technical program.</li>
        </ol>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${baseUrl}/masterhome" class="cta">Download Acceptance Letter &rarr;</a>
          <a href="${baseUrl}/registration?from=paper&paperId=${data.paperCode}" class="cta-outline">Register Delegate Pass</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Technical Committee</strong><br>
        Department of Metallurgical &amp; Materials Engineering, The M.S. University of Baroda, Vadodara 390001<br>
        Organized by AMPP Gujarat Chapter &amp; The Indian Institute of Metals Baroda Chapter<br>
        Email: iim.barodachapter@gmail.com &bull; Phone: +91 99888 81674
      </div>
    </div>
  </body>
  </html>
  `;
}

// 8. Abstract Revisions Requested Notification Template
export function getAbstractRevisionEmailHtml(data: {
  fullName: string;
  email: string;
  paperCode: string;
  paperTitle: string;
  symposiumTitle: string;
  symposiumId?: number | string;
  presentationType?: string;
  score?: number | string;
  comments: string;
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
      .header { background: #b45309; color: #ffffff; padding: 30px 24px; text-align: center; }
      .badge { display: inline-block; background: #78350f; color: #fde68a; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 6px; margin-bottom: 8px; letter-spacing: 0.5px; }
      .content { padding: 30px 26px; line-height: 1.6; font-size: 14px; }
      .box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin: 20px 0; }
      .comments-box { background: #fff7ed; border: 1.5px solid #fed7aa; border-left: 4px solid #ea580c; padding: 16px 20px; border-radius: 8px; margin: 18px 0; }
      .cta { display: inline-block; background: #d97706; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">Action Required &bull; Revisions Requested</div>
        <h2 style="margin:0; font-size:22px;">Revisions Requested for Your Abstract</h2>
        <p style="margin:6px 0 0 0; font-size:13px; color:#fef3c7;">GUJCORR 2027 Technical Review Committee</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>The <strong>GUJCORR 2027 Technical Review Committee</strong> has completed the peer review of your abstract submission. Revisions have been requested before final acceptance decision.</p>
        
        <div class="box">
          <strong>Submission Details:</strong><br>
          &bull; <strong>Paper Code:</strong> <span style="font-family:monospace; font-weight:bold; color:#b45309; font-size:15px;">#${data.paperCode}</span><br>
          &bull; <strong>Paper Title:</strong> "${data.paperTitle}"<br>
          &bull; <strong>Symposium:</strong> Track ${data.symposiumId ? `${data.symposiumId}: ` : ''}${data.symposiumTitle}<br>
          &bull; <strong>Status:</strong> <span style="color:#b45309; font-weight:bold;">Revision Required</span>
          ${data.score ? `<br>&bull; <strong>Review Score:</strong> <strong>${data.score}/10</strong>` : ''}
        </div>

        <div class="comments-box">
          <strong style="color:#9a3412; font-size:14px;">Reviewer Comments &amp; Changes Requested:</strong>
          <p style="margin:10px 0 0 0; font-weight:600; color:#431407; white-space:pre-wrap;">${data.comments || 'Please revise your abstract according to the conference technical guidelines.'}</p>
        </div>

        <p><strong>How to submit your revised abstract:</strong></p>
        <p>Log in to your author portal at the link below, review the committee comments, and update your abstract text or upload your revised document.</p>

        <div style="text-align: center; margin-top: 22px;">
          <a href="${baseUrl}/masterhome" class="cta">Submit Revised Abstract &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Technical Committee</strong><br>
        Department of Metallurgical &amp; Materials Engineering, The M.S. University of Baroda, Vadodara 390001<br>
        Email: iim.barodachapter@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}

// 9. Full Paper Accepted for ISBN Proceedings Notification Template
export function getFullPaperAcceptedEmailHtml(data: {
  fullName: string;
  email: string;
  paperCode: string;
  paperTitle: string;
  symposiumTitle: string;
  symposiumId?: number | string;
  score?: number | string;
  comments?: string;
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
      .header { background: #1e3a8a; color: #ffffff; padding: 30px 24px; text-align: center; }
      .badge { display: inline-block; background: #0f172a; color: #93c5fd; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 6px; margin-bottom: 8px; letter-spacing: 0.5px; }
      .content { padding: 30px 26px; line-height: 1.6; font-size: 14px; }
      .box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 8px; margin: 20px 0; }
      .comments-box { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #1e3a8a; padding: 14px 18px; border-radius: 8px; margin: 16px 0; font-size: 13px; }
      .cta { display: inline-block; background: #1d4ed8; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">Official Proceedings Decision &bull; ISBN Publication</div>
        <h2 style="margin:0; font-size:22px;">Congratulations! Full Paper Accepted for Proceedings</h2>
        <p style="margin:6px 0 0 0; font-size:13px; color:#bfdbfe;">GUJCORR 2027 Editorial Board &bull; Peer-Reviewed Proceedings</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>We are delighted to inform you that your camera-ready full paper has been reviewed and officially <strong>ACCEPTED for publication</strong> in the <strong>Official ISBN Conference Proceedings</strong> of <strong>GUJCORR 2027</strong>.</p>
        
        <div class="box">
          <strong style="color:#1e3a8a; font-size:15px;">Proceedings Acceptance Details:</strong><br><br>
          &bull; <strong>Paper Code:</strong> <span style="font-family:monospace; font-weight:bold; color:#1e3a8a; font-size:15px;">#${data.paperCode}</span><br>
          &bull; <strong>Paper Title:</strong> "${data.paperTitle}"<br>
          &bull; <strong>Symposium Track:</strong> Track ${data.symposiumId ? `${data.symposiumId}: ` : ''}${data.symposiumTitle}<br>
          &bull; <strong>Full Paper Status:</strong> <span style="color:#1d4ed8; font-weight:bold;">Accepted for ISBN Proceedings</span>
          ${data.score ? `<br>&bull; <strong>Technical Evaluation Score:</strong> <strong>${data.score}/10</strong>` : ''}
        </div>

        ${data.comments ? `
        <div class="comments-box">
          <strong>Review Committee Comments:</strong><br>
          <p style="margin:6px 0 0 0; font-style:italic;">"${data.comments}"</p>
        </div>` : ''}

        <p><strong>Next Action Items:</strong></p>
        <ul style="padding-left: 20px; line-height: 1.8;">
          <li><strong>Upload Oral Presentation Slide Deck:</strong> Please upload your 16:9 PowerPoint presentation file (.pptx or .pdf) by <strong>25 December 2026</strong> via your author portal.</li>
          <li><strong>Delegate Registration:</strong> Ensure your author pass is confirmed so your paper is scheduled in the scientific sessions.</li>
        </ul>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${baseUrl}/masterhome" class="cta">Access Author Portal &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Technical &amp; Editorial Committee</strong><br>
        Department of Metallurgical &amp; Materials Engineering, The M.S. University of Baroda, Vadodara 390001<br>
        Email: iim.barodachapter@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}

// 10. Full Paper Revisions Requested Notification Template
export function getFullPaperRevisionEmailHtml(data: {
  fullName: string;
  email: string;
  paperCode: string;
  paperTitle: string;
  symposiumTitle: string;
  symposiumId?: number | string;
  score?: number | string;
  comments: string;
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
      .header { background: #b45309; color: #ffffff; padding: 30px 24px; text-align: center; }
      .badge { display: inline-block; background: #78350f; color: #fde68a; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 6px; margin-bottom: 8px; letter-spacing: 0.5px; }
      .content { padding: 30px 26px; line-height: 1.6; font-size: 14px; }
      .box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin: 20px 0; }
      .comments-box { background: #fff7ed; border: 1.5px solid #fed7aa; border-left: 4px solid #ea580c; padding: 16px 20px; border-radius: 8px; margin: 18px 0; }
      .cta { display: inline-block; background: #d97706; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">Action Required &bull; Full Paper Revisions</div>
        <h2 style="margin:0; font-size:22px;">Revisions Required for Your Full Paper</h2>
        <p style="margin:6px 0 0 0; font-size:13px; color:#fef3c7;">GUJCORR 2027 Technical Review Committee</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>The <strong>GUJCORR 2027 Editorial &amp; Technical Review Committee</strong> has reviewed your camera-ready full paper manuscript. Specific revisions are required before it can be accepted for the ISBN proceedings volume.</p>
        
        <div class="box">
          <strong>Full Paper Submission Details:</strong><br>
          &bull; <strong>Paper Code:</strong> <span style="font-family:monospace; font-weight:bold; color:#b45309; font-size:15px;">#${data.paperCode}</span><br>
          &bull; <strong>Paper Title:</strong> "${data.paperTitle}"<br>
          &bull; <strong>Symposium:</strong> Track ${data.symposiumId ? `${data.symposiumId}: ` : ''}${data.symposiumTitle}<br>
          &bull; <strong>Status:</strong> <span style="color:#b45309; font-weight:bold;">Revision Required</span>
          ${data.score ? `<br>&bull; <strong>Full Paper Score:</strong> <strong>${data.score}/10</strong>` : ''}
        </div>

        <div class="comments-box">
          <strong style="color:#9a3412; font-size:14px;">Technical Committee Comments &amp; Required Corrections:</strong>
          <p style="margin:10px 0 0 0; font-weight:600; color:#431407; white-space:pre-wrap;">${data.comments || 'Please revise your full paper according to the editorial comments and formatting standards.'}</p>
        </div>

        <p><strong>Instructions to Upload Revised Full Paper:</strong></p>
        <ol style="padding-left: 20px; line-height: 1.8;">
          <li>Implement the modifications requested above in your full paper document.</li>
          <li>Log in to your author portal at the link below.</li>
          <li>Click <strong>"Replace / Re-upload Full Paper"</strong> to attach your updated PDF or DOCX file before <strong>15 December 2026</strong>.</li>
        </ol>

        <div style="text-align: center; margin-top: 22px;">
          <a href="${baseUrl}/masterhome" class="cta">Upload Revised Full Paper &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Technical Committee</strong><br>
        Department of Metallurgical &amp; Materials Engineering, The M.S. University of Baroda, Vadodara 390001<br>
        Email: iim.barodachapter@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}

// 11. General Status Change Notification Template
export function getPaperStatusNotificationEmailHtml(data: {
  fullName: string;
  email: string;
  paperCode: string;
  paperTitle: string;
  symposiumTitle: string;
  symposiumId?: number | string;
  reviewType: 'abstract' | 'full_paper';
  status: string;
  score?: number | string;
  comments?: string;
  baseUrl?: string;
}) {
  const baseUrl = getBaseUrl(data.baseUrl);
  const isFullPaper = data.reviewType === 'full_paper';
  const docTypeLabel = isFullPaper ? 'Full Paper' : 'Abstract';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
      .header { background: #334155; color: #ffffff; padding: 28px 24px; text-align: center; }
      .badge { display: inline-block; background: #0f172a; color: #cbd5e1; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 6px; margin-bottom: 8px; }
      .content { padding: 28px 24px; line-height: 1.6; font-size: 14px; }
      .box { background: #f1f5f9; border-left: 4px solid #475569; padding: 14px 18px; border-radius: 8px; margin: 18px 0; }
      .comments-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #64748b; padding: 14px 18px; border-radius: 8px; margin: 16px 0; }
      .cta { display: inline-block; background: #0f172a; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 14px; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">GUJCORR 2027 &bull; Status Update</div>
        <h2 style="margin:0; font-size:22px;">${docTypeLabel} Status Update</h2>
        <p style="margin:6px 0 0 0; font-size:12px; color:#cbd5e1;">Technical Review Committee &bull; GUJCORR 2027</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.fullName}</strong>,</p>
        <p>This is to inform you that your <strong>${docTypeLabel}</strong> status for paper <strong>#${data.paperCode}</strong> has been updated by the Technical Review Committee.</p>
        
        <div class="box">
          <strong>Updated Status Details:</strong><br>
          &bull; <strong>Paper Code:</strong> <span style="font-family:monospace; font-weight:bold;">#${data.paperCode}</span><br>
          &bull; <strong>Paper Title:</strong> "${data.paperTitle}"<br>
          &bull; <strong>Track:</strong> ${data.symposiumTitle}<br>
          &bull; <strong>${docTypeLabel} Status:</strong> <strong>${data.status}</strong>
          ${data.score ? `<br>&bull; <strong>Score:</strong> ${data.score}/10` : ''}
        </div>

        ${data.comments ? `
        <div class="comments-box">
          <strong>Committee Comments:</strong>
          <p style="margin:8px 0 0 0; font-style:italic;">"${data.comments}"</p>
        </div>` : ''}

        <div style="text-align: center;">
          <a href="${baseUrl}/masterhome" class="cta">View Author Portal &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <strong>GUJCORR 2027 Technical Secretariat</strong> &bull; iim.barodachapter@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}
