import type {
  SmsProvider,
  SmsProviderInput,
} from "./provider.types.js";

export const mockSmsProvider: SmsProvider = {
  async send({
    to,
    body,
  }: SmsProviderInput) {
    const messageId = `mock-sms-${Date.now()}`;

    console.log("[Mock SMS] Notification simulated:", {
      messageId,
      to,
      body,
    });

    return {
      messageId,
    };
  },
};