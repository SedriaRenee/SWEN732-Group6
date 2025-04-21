import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { decrypt } from '@/lib/session';

export async function PUT(req: NextRequest, context: { params: { username: string } }) {
  const { username } = context.params;

  const body = await req.json();
  const { newUsername, email, currentPassword, newPassword } = body;

  const sessionCookie = req.cookies.get('session')?.value;
  const session = await decrypt(sessionCookie);

  if (!session || session.username !== username) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  if (newUsername || email) {
    await prisma.user.update({
      where: { username },
      data: {
        username: newUsername || undefined,
        email: email || undefined,
      },
    });
  }

  if (currentPassword && newPassword) {
    const valid = await compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ message: 'Invalid current password' }, { status: 400 });
    }

    const newHash = await hash(newPassword, 10);
    await prisma.user.update({
      where: { username },
      data: { password: newHash },
    });
  }

  return NextResponse.json({ message: 'Settings updated successfully' });
}

export async function DELETE(req: NextRequest, context: { params: { username: string } }) {
  const { username } = context.params;

  const sessionCookie = req.cookies.get('session')?.value;
  const session = await decrypt(sessionCookie);

  if (!session || session.username !== username) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await prisma.user.delete({ where: { username } });

  return NextResponse.json({ message: 'User deleted successfully' });
}
