import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, hasCapability, hashPassword, StaffRole } from '@/lib/server/auth';
import { dbGetUsers, dbInsertUser, dbUpdateUserStatus, dbAppendAuditLog } from '@/lib/server/db';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !hasCapability(session.role, 'manage_users')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions for administrative accounts.' },
        { status: 403 }
      );
    }

    const users = await dbGetUsers();
    // Exclude password hashes!
    const safeUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      status: u.status,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt
    }));

    return NextResponse.json({
      success: true,
      data: safeUsers
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed fetching users.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    // ONLY Super Administrator or Admin can create or modify staff accounts!
    if (!session || (session.role !== 'Super Administrator' && session.role !== 'Admin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only Super Administrator can provision staff accounts.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, userId, email, fullName, role, password, status } = body;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    if (action === 'update_status') {
      if (!userId || !status) {
        return NextResponse.json({ success: false, message: 'userId and status are required.' }, { status: 400 });
      }

      const users = await dbGetUsers();
      const target = users.find(u => u.id === userId);
      if (!target) {
        return NextResponse.json({ success: false, message: 'Staff user not found.' }, { status: 404 });
      }

      // Prevent deactivating own account
      if (target.id === session.userId) {
        return NextResponse.json({ success: false, message: 'Cannot deactivate your own logged-in account.' }, { status: 400 });
      }

      await dbUpdateUserStatus(userId, status);

      await dbAppendAuditLog({
        userId: session.userId,
        userEmail: session.email,
        action: 'UPDATE_STAFF_STATUS',
        resourceType: 'User',
        resourceId: target.email,
        details: `Account status updated to '${status}'.`,
        ipAddress: ip,
        status: 'Success'
      });

      return NextResponse.json({ success: true, message: `Account ${target.email} status set to ${status}.` });
    }

    // Default action: Create new staff account
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { success: false, message: 'email, password, fullName, and role are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = await dbGetUsers();
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const validRoles: StaffRole[] = [
      'Super Administrator',
      'Administrator',
      'Secretariat Staff',
      'Finance Staff',
      'Paper Coordinator',
      'Reviewer',
      'Content Editor'
    ];

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid staff role specified.' },
        { status: 400 }
      );
    }

    const newUser = await dbInsertUser({
      id: 'usr-' + Date.now().toString(36),
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      fullName: fullName.trim(),
      role: role as StaffRole,
      passwordHash: hashPassword(password),
      status: 'Active' as const
    });

    await dbAppendAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: 'CREATE_STAFF_ACCOUNT',
      resourceType: 'User',
      resourceId: cleanEmail,
      details: `Provisioned account for ${fullName} with role: ${role}`,
      ipAddress: ip,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Staff account provisioned for ${cleanEmail} with role '${role}'.`,
      data: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed creating staff user.' },
      { status: 500 }
    );
  }
}
