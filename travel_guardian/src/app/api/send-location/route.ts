
import { NextResponse } from "next/server";
import { transporter } from "./mailer";
import twilio from "twilio";

// Twilio credentials
const accountSid = process.env.TWILIO_SID!;
const authToken  = process.env.TWILIO_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE!;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error("Twilio credentials are missing in env");
}
const smsClient = twilio(accountSid, authToken);

export async function POST(request: Request) {
  const { method, to, link } = await request.json();

  if (!method || !to || !link) {
    return NextResponse.json(
      { error: "Missing method, to, or link" },
      { status: 400 }
    );
  }

  try {
    if (method === "sms") {
      await smsClient.messages.create({
        body: `Here's my location: ${link}`,
        from: fromNumber,
        to,
      });
      return NextResponse.json({ success: true, via: "sms" });
    }

    if (method === "email") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "📍 My location from Travel Guardian",
        text: `Hey! Here's my live location: ${link}`,
      });
      return NextResponse.json({ success: true, via: "email" });
    }

    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  } catch (err: any) {
    console.error("share-location error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to share location" },
      { status: 500 }
    );
  }
}
