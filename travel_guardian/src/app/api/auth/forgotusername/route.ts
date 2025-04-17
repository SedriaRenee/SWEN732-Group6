import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'No user found with this email address' }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username,
    });
  } catch (error) {
    console.error('Error in forgot username route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
