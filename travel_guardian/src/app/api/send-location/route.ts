import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const fromNumber = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { phone, link } = await request.json();

    const message = await client.messages.create({
      body: `Here's my location: ${link}`,
      from: fromNumber,
      to: phone,
    });

    return NextResponse.json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error("Error sending location:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
