import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability } from '@/lib/server/auth';
import { dbGetBooths, dbUpdateBooth, dbAppendAuditLog } from '@/lib/server/db';
import { forwardToWordPress } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_booths')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions for exhibition booths.' },
        { status: 403 }
      );
    }

    const booths = await dbGetBooths();
    return NextResponse.json({
      success: true,
      data: booths
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

    const booths = await dbGetBooths();
    const booth = booths.find(b => b.boothNumber === boothNumber || b.id === boothNumber);

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
    const updateData: any = {
      status,
      companyName: status === 'Available' ? '' : (companyName !== undefined ? companyName : booth.companyName),
      contactPerson: status === 'Available' ? '' : (contactPerson !== undefined ? contactPerson : booth.contactPerson),
      email: status === 'Available' ? '' : (email !== undefined ? email : booth.email),
      mobileNumber: status === 'Available' ? '' : (mobileNumber !== undefined ? mobileNumber : booth.mobileNumber),
      fasciaName: status === 'Available' ? '' : (fasciaName !== undefined ? fasciaName : booth.fasciaName),
      gstin: status === 'Available' ? '' : (gstin !== undefined ? gstin : booth.gstin)
    };

    await dbUpdateBooth(boothNumber, updateData);

    // Forward to WordPress REST API if connected
    forwardToWordPress('/booths/reserve', 'POST', {
      boothNumber,
      status,
      companyName: updateData.companyName,
      contactPerson: updateData.contactPerson,
      email: updateData.email,
      mobile: updateData.mobileNumber,
      fasciaName: updateData.fasciaName,
      gstin: updateData.gstin,
      boothSize: booth.boothSize,
      basePrice: booth.basePrice,
      gstAmount: booth.gstAmount,
      totalPrice: booth.totalPrice
    });

    // Audit log
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_BOOTH_STATUS',
      resourceType: 'Booth',
      resourceId: boothNumber,
      details: `Booth status updated from '${oldStatus}' to '${status}' for '${updateData.companyName || 'Unassigned'}'.`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Booth ${boothNumber} updated to ${status}.`,
      data: { ...booth, ...updateData }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed modifying booth record.' },
      { status: 500 }
    );
  }
}
