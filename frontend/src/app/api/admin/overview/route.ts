import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/auth';
import { dbGetRegistrations, dbGetPapers, dbGetBooths, dbGetInquiries, dbGetAuditLogs, isRegistrationPaid } from '@/lib/server/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Valid staff session required.' },
        { status: 401 }
      );
    }

    const [registrations, papers, booths, inquiries, recentActivity] = await Promise.all([
      dbGetRegistrations(),
      dbGetPapers(),
      dbGetBooths(),
      dbGetInquiries(),
      dbGetAuditLogs(10)
    ]);

    // 1. Registrations stats
    const totalReg = registrations.length;
    const confirmedReg = registrations.filter(r => isRegistrationPaid(r.status)).length;
    const pendingReg = registrations.filter(r => !isRegistrationPaid(r.status)).length;
    
    // Revenue calculations: strict separation between verified and pending
    const verifiedRevenue = registrations
      .filter(r => isRegistrationPaid(r.status))
      .reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);

    const outstandingRevenue = registrations
      .filter(r => !isRegistrationPaid(r.status))
      .reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);

    // Category breakdown
    const categoryCounts: Record<string, { count: number; revenue: number }> = {};
    registrations.forEach(r => {
      const cat = r.category || 'Standard Delegate';
      if (!categoryCounts[cat]) {
        categoryCounts[cat] = { count: 0, revenue: 0 };
      }
      categoryCounts[cat].count += 1;
      if (isRegistrationPaid(r.status)) {
        categoryCounts[cat].revenue += (Number(r.totalAmount) || 0);
      }
    });

    // 2. Papers stats
    const totalPapers = papers.length;
    const acceptedPapers = papers.filter(p => (p.status || '').toLowerCase().includes('accepted')).length;
    const pendingPapers = papers.filter(p => (p.status || '').toLowerCase().includes('submitted') || (p.status || '').toLowerCase().includes('review')).length;
    const rejectedPapers = papers.filter(p => (p.status || '').toLowerCase().includes('reject')).length;

    // 3. Exhibition booths
    const totalBooths = booths.length; // 42
    const bookedBooths = booths.filter(b => b.status === 'Confirmed' || b.status === 'Reserved').length;
    const confirmedBooths = booths.filter(b => b.status === 'Confirmed').length;
    const availableBooths = booths.filter(b => b.status === 'Available').length;
    const boothRevenue = booths
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    // 4. Inquiries stats
    const totalInquiries = inquiries.length;
    const unreadInquiries = inquiries.filter(i => (i.status || '').toLowerCase() === 'unread').length;

    return NextResponse.json({
      success: true,
      data: {
        registrations: {
          total: totalReg,
          confirmed: confirmedReg,
          pending: pendingReg,
          verifiedRevenue,
          outstandingRevenue,
          categories: Object.entries(categoryCounts).map(([category, val]) => ({
            category,
            count: val.count,
            revenue: val.revenue
          }))
        },
        papers: {
          total: totalPapers,
          accepted: acceptedPapers,
          pendingReview: pendingPapers,
          rejected: rejectedPapers
        },
        exhibition: {
          totalCapacity: totalBooths,
          booked: bookedBooths,
          confirmed: confirmedBooths,
          available: availableBooths,
          revenue: boothRevenue
        },
        inquiries: {
          total: totalInquiries,
          unread: unreadInquiries
        },
        recentActivity
      }
    });
  } catch (err: any) {
    console.error('[API/ADMIN/OVERVIEW] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to load administrative overview.' },
      { status: 500 }
    );
  }
}
