import { Resend } from "resend";
import { env } from "../../../config/env.js";

const apiKey = env.resendApiKey;
const fromEmail = env.fromEmail;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not configured");
}

if (!fromEmail) {
  throw new Error("FROM_EMAIL is not configured");
}

const resend = new Resend(apiKey);

import type {
  EmailProvider,
  EmailProviderInput,
} from "./provider.types.js";

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailProviderInput) => {
  
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(
      `Resend email delivery failed: ${error.message}`,
    );
  }

  if (!data?.id) {
    throw new Error("Resend did not return an email ID");
  }

  console.log("[Email] Sent successfully:", {
    emailId: data.id,
    to,
  });

  return {
    messageId: data.id,
  };
};

export const emailProvider: EmailProvider = {
  send: sendEmail,
};