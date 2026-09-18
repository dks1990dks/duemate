import twilio from "twilio";

import { env } from "../../../config/env.js";

import logger from "../../../utils/logger.js";

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

import type { SmsProvider, SmsProviderInput } from "./provider.types.js";

export const sendSms = async ({ to, body }: SmsProviderInput) => {
  const message = await client.messages.create({
    body,
    from: fromPhoneNumber,
    to,
  });

  if (!message.sid) {
    throw new Error("Twilio did not return a message SID");
  }

  logger.info("[SMS] Sent successfully:", {
    messageSid: message.sid,
    to,
  });

  return {
    messageId: message.sid,
  };
};

export const smsProvider: SmsProvider = {
  send: sendSms,
};
