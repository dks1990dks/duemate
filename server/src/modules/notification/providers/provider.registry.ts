import { env } from "../../../config/env.js";

import { emailProvider } from "./email.provider.js";
import { mockSmsProvider } from "./mock-sms.provider.js";
import { mockWhatsAppProvider } from "./mock-whatsapp.provider.js";
import { smsProvider } from "./sms.provider.js";
import { whatsappProvider } from "./whatsapp.provider.js";

export const notificationProviders = {
  email: emailProvider,

  sms:
    env.smsProvider === "mock"
      ? mockSmsProvider
      : smsProvider,

  whatsapp:
    env.whatsappProvider === "mock"
      ? mockWhatsAppProvider
      : whatsappProvider,
} as const;