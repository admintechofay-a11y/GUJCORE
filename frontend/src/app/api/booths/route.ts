import { NextRequest, NextResponse } from 'next/server';
import { dbGetBooths, dbUpdateBooth, dbAppendAuditLog } from '@/lib/server/db';

export async function GET() {
  try {
    const booths = await dbGetBooths();
    return NextResponse.json({
      success: true,
      data: booths
    });
  } catch (err: any) {
    console.error('[API/BOOTHS] GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed fetching booths.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      boothNumber,
      stallNumber,
      companyName,
      contactPerson,
      email,
      mobile,
      mobileNumber,
      fasciaName,
      gstin,
      status = 'Reserved'
    } = body;

    const bNum = boothNumber || stallNumber;
    if (!bNum) {
      return NextResponse.json(
        { success: false, message: 'boothNumber or stallNumber is required.' },
        { status: 400 }
      );
    }

    const booths = await dbGetBooths();
    const booth = booths.find(b => b.boothNumber === bNum || b.id === bNum);

    if (!booth) {
      return NextResponse.json(
        { success: false, message: `Booth ${bNum} not found in inventory.` },
        { status: 404 }
      );
    }

    if (booth.status === 'Confirmed' || booth.status === 'Booked') {
      return NextResponse.json(
        { success: false, message: `Booth ${bNum} is already booked by ${booth.companyName || 'another exhibitor'}.` },
        { status: 409 }
      );
    }

    const updateData = {
      status,
      companyName: companyName || booth.companyName,
      contactPerson: contactPerson || booth.contactPerson,
      email: email || booth.email,
      mobileNumber: mobile || mobileNumber || booth.mobileNumber,
      fasciaName: fasciaName || booth.fasciaName,
      gstin: gstin || booth.gstin
    };

    await dbUpdateBooth(bNum, updateData);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    await dbAppendAuditLog({
      userId: 'public_exhibitor',
      userEmail: email || 'exhibitor@gujcorr.org',
      action: 'PUBLIC_BOOTH_RESERVATION',
      resourceType: 'Booth',
      resourceId: bNum,
      details: `Booth reserved by company: '${companyName || 'Unknown'}'. Contact: ${contactPerson || ''}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Booth ${bNum} reserved successfully.`,
      data: { ...booth, ...updateData }
    });
  } catch (err: any) {
    console.error('[API/BOOTHS] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed reserving booth.' },
      { status: 500 }
    );
  }
}

