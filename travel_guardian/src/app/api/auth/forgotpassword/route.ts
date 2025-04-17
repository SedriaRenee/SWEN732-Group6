import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto'; 
import { addMinutes } from 'date-fns';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { email } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const resetToken = crypto.randomUUID(); // secure token
    const resetTokenExpiry = addMinutes(new Date(), 30); // expires in 30 mins

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link below:\n\nhttp://localhost:3000/reset-password?token=${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Password reset link has been sent to your email.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error sending password reset email:', error?.message || error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
