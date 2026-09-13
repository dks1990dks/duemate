import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // ------------------------------------------------------------
  // Application
  // ------------------------------------------------------------

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5000),

  CLIENT_URL: z
    .string()
    .url()
    .refine(
      (value) => !value.endsWith("/"),
      "CLIENT_URL must not end with /",
    ),

  // ------------------------------------------------------------
  // Database
  // ------------------------------------------------------------

  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required"),

  // ------------------------------------------------------------
  // Authentication
  // ------------------------------------------------------------

  JWT_ACCESS_SECRET: z
    .string()
    .min(
      32,
      "JWT_ACCESS_SECRET must be at least 32 characters",
    ),

  JWT_REFRESH_SECRET: z
    .string()
    .min(
      32,
      "JWT_REFRESH_SECRET must be at least 32 characters",
    ),

  // ------------------------------------------------------------
  // Email - Resend
  // ------------------------------------------------------------

  RESEND_API_KEY: z
    .string()
    .min(1, "RESEND_API_KEY is required"),

  FROM_EMAIL: z
    .string()
    .min(1, "FROM_EMAIL is required"),

  // ------------------------------------------------------------
  // Twilio
  // ------------------------------------------------------------

  TWILIO_ACCOUNT_SID: z
    .string()
    .optional(),

  TWILIO_AUTH_TOKEN: z
    .string()
    .optional(),

  // SMS
  TWILIO_PHONE_NUMBER: z
    .string()
    .optional(),

  // WhatsApp
  TWILIO_WHATSAPP_FROM: z
    .string()
    .optional(),

  TWILIO_WHATSAPP_CONTENT_SID: z
    .string()
    .optional(),

  // ------------------------------------------------------------
  // Reminder Scheduler
  // ------------------------------------------------------------

  REMINDER_SCHEDULER_INTERVAL_MS: z.coerce
    .number()
    .int()
    .min(
      10_000,
      "REMINDER_SCHEDULER_INTERVAL_MS must be at least 10000",
    )
    .default(60_000),

  REMINDER_SCHEDULER_RUN_ON_START: z
    .enum(["true", "false"])
    .default("true"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "\n❌ Invalid environment variables:\n",
    parsedEnv.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,

  clientUrl: parsedEnv.data.CLIENT_URL,

  mongodbUri: parsedEnv.data.MONGODB_URI,

  jwtAccessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,

  resendApiKey: parsedEnv.data.RESEND_API_KEY,
  fromEmail: parsedEnv.data.FROM_EMAIL,

  twilioAccountSid: parsedEnv.data.TWILIO_ACCOUNT_SID,
  twilioAuthToken: parsedEnv.data.TWILIO_AUTH_TOKEN,

  twilioPhoneNumber: parsedEnv.data.TWILIO_PHONE_NUMBER,

  twilioWhatsAppFrom:
    parsedEnv.data.TWILIO_WHATSAPP_FROM,

  twilioWhatsAppContentSid:
    parsedEnv.data.TWILIO_WHATSAPP_CONTENT_SID,

  reminderSchedulerIntervalMs:
    parsedEnv.data.REMINDER_SCHEDULER_INTERVAL_MS,

  reminderSchedulerRunOnStart:
    parsedEnv.data.REMINDER_SCHEDULER_RUN_ON_START === "true",
};