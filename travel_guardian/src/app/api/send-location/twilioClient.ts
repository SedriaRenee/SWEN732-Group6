// src/app/api/send-location/twilioClient.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID || 'your_account_sid';
const authToken = process.env.TWILIO_TOKEN || 'your_auth_token';
const fromNumber = process.env.TWILIO_PHONE || 'your_twilio_number';

const client = twilio(accountSid, authToken);

export const sendLocation = async (phone: string, link: string) => {
  try {
    const message = await client.messages.create({
      body: `Here's my location: ${link}`,
      from: fromNumber,
      to: phone,
    });
    return message.sid;
  } catch (error) {
    throw new Error('Twilio Error: ' + error.message);
  }
};
