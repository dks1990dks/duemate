export interface NotificationProviderResult {
  messageId?: string;
}

export interface SmsProviderInput {
  to: string;
  body: string;
}

export interface WhatsAppProviderInput {
  to: string;
  variables: Record<string, string>;
}

export interface EmailProviderInput {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface SmsProvider {
  send(
    input: SmsProviderInput,
  ): Promise<NotificationProviderResult>;
}

export interface WhatsAppProvider {
  send(
    input: WhatsAppProviderInput,
  ): Promise<NotificationProviderResult>;
}

export interface EmailProvider {
  send(
    input: EmailProviderInput,
  ): Promise<NotificationProviderResult>;
}