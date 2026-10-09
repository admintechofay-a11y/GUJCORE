import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/auth';
import { getStore } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Valid staff session required.' },
        { status: 401 }
      );
    }

    const store = getStore();

    // 1. Registrations stats
    const totalReg = store.registrations.length;
    const confirmedReg = store.registrations.filter(r => (r.status || '').toLowerCase().includes('confirmed')).length;
    const pendingReg = store.registrations.filter(r => (r.status || '').toLowerCase().includes('pending')).length;
    
    // Revenue calculations: strict separation between verified and pending
    const verifiedRevenue = store.registrations
      .filter(r => (r.status || '').toLowerCase().includes('confirmed'))
      .reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);

    const outstandingRevenue = store.registrations
      .filter(r => (r.status || '').toLowerCase().includes('pending'))
      .reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);

    // Category breakdown
    const categoryCounts: Record<string, { count: number; revenue: number }> = {};
    store.registrations.forEach(r => {
      const cat = r.category || 'Standard Delegate';
      if (!categoryCounts[cat]) {
        categoryCounts[cat] = { count: 0, revenue: 0 };
      }
      categoryCounts[cat].count += 1;
      if ((r.status || '').toLowerCase().includes('confirmed')) {
        categoryCounts[cat].revenue += (Number(r.totalAmount) || 0);
      }
    });

    // 2. Papers stats
    const totalPapers = store.papers.length;
    const acceptedPapers = store.papers.filter(p => (p.status || '').toLowerCase().includes('accepted')).length;
    const pendingPapers = store.papers.filter(p => (p.status || '').toLowerCase().includes('submitted') || (p.status || '').toLowerCase().includes('review')).length;
    const rejectedPapers = store.papers.filter(p => (p.status || '').toLowerCase().includes('reject')).length;

    // 3. Exhibition booths
    const totalBooths = store.booths.length; // 42
    const bookedBooths = store.booths.filter(b => b.status === 'Confirmed' || b.status === 'Reserved').length;
    const confirmedBooths = store.booths.filter(b => b.status === 'Confirmed').length;
    const availableBooths = store.booths.filter(b => b.status === 'Available').length;
    const boothRevenue = store.booths
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    // 4. Inquiries stats
    const totalInquiries = store.inquiries.length;
    const unreadInquiries = store.inquiries.filter(i => (i.status || '').toLowerCase() === 'unread').length;

    // 5. Recent audit logs
    const recentActivity = store.auditLogs.slice(0, 10);

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
