import type {
  WhatsAppProvider,
  WhatsAppProviderInput,
} from "./provider.types.js";

export const mockWhatsAppProvider: WhatsAppProvider = {
  async send({
    to,
    variables,
  }: WhatsAppProviderInput) {
    const messageId = `mock-whatsapp-${Date.now()}`;

    console.log("[Mock WhatsApp] Notification simulated:", {
      messageId,
      to,
      variables,
    });

    return {
      messageId,
    };
  },
};