import logger from "../../../utils/logger.js";
import { env } from "../../../config/env.js";

import type {
  WhatsAppProvider,
  WhatsAppProviderInput,
} from "./provider.types.js";

const GUPSHUP_API_URL = "https://api.gupshup.io/wa/api/v1/template/msg";

const getRequiredConfig = () => {
  if (!env.gupshupApiKey) {
    throw new Error("Gupshup API key is not configured");
  }

  if (!env.gupshupAppName) {
    throw new Error("Gupshup app name is not configured");
  }

  if (!env.gupshupSourcePhone) {
    throw new Error("Gupshup source phone is not configured");
  }

  if (!env.gupshupTemplateId) {
    throw new Error("Gupshup template ID is not configured");
  }

  return {
    apiKey: env.gupshupApiKey,
    appName: env.gupshupAppName,
    sourcePhone: env.gupshupSourcePhone,
    templateId: env.gupshupTemplateId,
  };
};

export const sendWhatsApp = async ({
  to,
  variables,
}: WhatsAppProviderInput) => {
  const config = getRequiredConfig();

  const params = Object.keys(variables)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => variables[key]);

  const response = await fetch(GUPSHUP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      apikey: config.apiKey,
    },
    body: new URLSearchParams({
      channel: "whatsapp",
      source: config.sourcePhone,
      destination: to.replace(/\D/g, ""),
      "src.name": config.appName,
      template: JSON.stringify({
        id: config.templateId,
        params,
      }),
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Gupshup WhatsApp API request failed with status ${response.status}`,
    );
  }

  let responseData: unknown;

  try {
    responseData = JSON.parse(responseText);
  } catch {
    throw new Error("Gupshup returned an invalid response");
  }

  if (
    typeof responseData !== "object" ||
    responseData === null ||
    !("messageId" in responseData) ||
    typeof responseData.messageId !== "string" ||
    !responseData.messageId
  ) {
    throw new Error("Gupshup did not return a WhatsApp message ID");
  }

  logger.info("[WhatsApp] Gupshup message sent successfully", {
    messageId: responseData.messageId,
  });

  return {
    messageId: responseData.messageId,
  };
};

export const gupshupWhatsAppProvider: WhatsAppProvider = {
  send: sendWhatsApp,
};