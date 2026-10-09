import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { getStore, saveStore, appendAuditLog, forwardToWordPress } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_booths')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions for exhibition booths.' },
        { status: 403 }
      );
    }

    const store = getStore();
    return NextResponse.json({
      success: true,
      data: store.booths
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed fetching exhibition booths.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_booths')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions to modify exhibition booths.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { boothNumber, status, companyName, contactPerson, email, mobileNumber, fasciaName, gstin } = body;

    if (!boothNumber || !status) {
      return NextResponse.json(
        { success: false, message: 'boothNumber and status are required.' },
        { status: 400 }
      );
    }

    const store = getStore();
    const booth = store.booths.find(b => b.boothNumber === boothNumber || b.id === boothNumber);

    if (!booth) {
      return NextResponse.json(
        { success: false, message: `Booth ${boothNumber} not found in inventory.` },
        { status: 404 }
      );
    }

    // Atomic conflict check: prevent overriding another company if status is trying to reserve
    if (status === 'Confirmed' || status === 'Reserved') {
      if (booth.status === 'Confirmed' && booth.companyName && companyName && booth.companyName !== companyName) {
        return NextResponse.json(
          {
            success: false,
            message: `Conflict: Booth ${boothNumber} is already confirmed for '${booth.companyName}'. Release or cancel existing reservation first.`
          },
          { status: 409 }
        );
      }
    }

    const oldStatus = booth.status;
    booth.status = status;
    if (companyName !== undefined) booth.companyName = companyName;
    if (contactPerson !== undefined) booth.contactPerson = contactPerson;
    if (email !== undefined) booth.email = email;
    if (mobileNumber !== undefined) booth.mobileNumber = mobileNumber;
    if (fasciaName !== undefined) booth.fasciaName = fasciaName;
    if (gstin !== undefined) booth.gstin = gstin;

    if (status === 'Available') {
      booth.companyName = '';
      booth.contactPerson = '';
      booth.email = '';
      booth.mobileNumber = '';
      booth.fasciaName = '';
      booth.gstin = '';
      booth.bookedAt = null;
    } else if (!booth.bookedAt) {
      booth.bookedAt = new Date().toISOString();
    }

    booth.updatedAt = new Date().toISOString();
    booth.updatedBy = session.email;

    saveStore(store);

    // Forward to WordPress REST API if connected
    forwardToWordPress('/booths/reserve', 'POST', {
      boothNumber,
      status,
      companyName: booth.companyName,
      contactPerson: booth.contactPerson,
      email: booth.email,
      mobile: booth.mobileNumber,
      fasciaName: booth.fasciaName,
      gstin: booth.gstin,
      boothSize: booth.boothSize,
      basePrice: booth.basePrice,
      gstAmount: booth.gstAmount,
      totalPrice: booth.totalPrice
    });

    // Audit log
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    appendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_BOOTH_STATUS',
      resourceType: 'Booth',
      resourceId: boothNumber,
      details: `Booth status updated from '${oldStatus}' to '${status}' for '${booth.companyName || 'Unassigned'}'.`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Booth ${boothNumber} updated to ${status}.`,
      data: booth
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed modifying booth record.' },
      { status: 500 }
    );
  }
}
