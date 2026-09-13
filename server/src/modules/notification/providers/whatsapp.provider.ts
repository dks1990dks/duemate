import twilio from "twilio";

import { env } from "../../../config/env.js";

const accountSid = env.twilioAccountSid;
const authToken = env.twilioAuthToken;
const whatsappFrom = env.twilioWhatsAppFrom;
const contentSid = env.twilioWhatsAppContentSid;

if (!accountSid) {
  throw new Error("TWILIO_ACCOUNT_SID is not configured");
}

if (!authToken) {
  throw new Error("TWILIO_AUTH_TOKEN is not configured");
}

if (!whatsappFrom) {
  throw new Error("TWILIO_WHATSAPP_FROM is not configured");
}

if (!contentSid) {
  throw new Error(
    "TWILIO_WHATSAPP_CONTENT_SID is not configured",
  );
}

const client = twilio(accountSid, authToken);

export interface SendWhatsAppInput {
  to: string;
  variables: Record<string, string>;
}

export const sendWhatsApp = async ({
  to,
  variables,
}: SendWhatsAppInput) => {
  const message = await client.messages.create({
    from: whatsappFrom,
    to: `whatsapp:${to}`,
    contentSid,
    contentVariables: JSON.stringify(variables),
  });

  if (!message.sid) {
    throw new Error(
      "Twilio did not return a WhatsApp message SID",
    );
  }

  console.log("[WhatsApp] Sent successfully:", {
    messageSid: message.sid,
    to,
  });

  return {
    messageId: message.sid,
  };
};