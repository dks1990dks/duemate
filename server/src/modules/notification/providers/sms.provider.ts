import twilio from "twilio";

import { env } from "../../../config/env.js";

const accountSid = env.twilioAccountSid;

const authToken = env.twilioAuthToken;

const fromPhoneNumber = env.twilioPhoneNumber;

if (!accountSid) {
  throw new Error("TWILIO_ACCOUNT_SID is not configured");
}

if (!authToken) {
  throw new Error("TWILIO_AUTH_TOKEN is not configured");
}

if (!fromPhoneNumber) {
  throw new Error("TWILIO_PHONE_NUMBER is not configured");
}

const client = twilio(accountSid, authToken);

export interface SendSmsInput {
  to: string;
  body: string;
}

export const sendSms = async ({
  to,
  body,
}: SendSmsInput) => {
  const message = await client.messages.create({
    body,
    from: fromPhoneNumber,
    to,
  });

  if (!message.sid) {
    throw new Error("Twilio did not return a message SID");
  }

  console.log("[SMS] Sent successfully:", {
    messageSid: message.sid,
    to,
  });

  return {
    messageId: message.sid,
  };
};