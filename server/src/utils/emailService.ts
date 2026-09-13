import { Resend } from "resend";

import { env } from "../config/env.js";

const apiKey = env.resendApiKey;
const fromEmail = env.fromEmail;
const clientUrl = env.clientUrl;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not configured");
}

const resend = new Resend(apiKey);

export const sendVerificationEmail = async (
  toEmail: string,
  token: string,
): Promise<void> => {
  const verifyUrl = `${clientUrl}/verify-email?token=${encodeURIComponent(
    token,
  )}`;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: "Verify your DueMate account",
    text: `
Welcome to DueMate.

Please verify your email address by opening the following link:

${verifyUrl}

This link will expire in 24 hours.
`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Verify your DueMate account</title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f1f5f9;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          <div style="padding:32px 16px;">
            <div
              style="
                max-width:600px;
                margin:0 auto;
                background:#ffffff;
                border-radius:12px;
                overflow:hidden;
                border:1px solid #e2e8f0;
              "
            >
              <div
                style="
                  padding:24px;
                  background:#0f172a;
                "
              >
                <div
                  style="
                    font-size:24px;
                    font-weight:700;
                    color:#ffffff;
                  "
                >
                  DueMate
                </div>

                <div
                  style="
                    margin-top:4px;
                    font-size:13px;
                    color:#cbd5e1;
                  "
                >
                  Never miss a due date.
                </div>
              </div>

              <div style="padding:32px 24px;">
                <h1
                  style="
                    margin:0;
                    color:#0f172a;
                    font-size:22px;
                  "
                >
                  Verify your email address
                </h1>

                <p
                  style="
                    margin:20px 0 0;
                    color:#475569;
                    font-size:15px;
                    line-height:1.7;
                  "
                >
                  Welcome to DueMate. Please verify your email address
                  to activate your account.
                </p>

                <div style="margin-top:28px;text-align:center;">
                  <a
                    href="${verifyUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="
                      display:inline-block;
                      padding:12px 22px;
                      background:#0f172a;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:8px;
                      font-size:14px;
                      font-weight:600;
                    "
                  >
                    Verify Email Address
                  </a>
                </div>

                <p
                  style="
                    margin:24px 0 0;
                    color:#64748b;
                    font-size:13px;
                    line-height:1.6;
                  "
                >
                  This verification link will expire in 24 hours.
                </p>

                <p
                  style="
                    margin:16px 0 0;
                    color:#94a3b8;
                    font-size:12px;
                    line-height:1.6;
                    word-break:break-all;
                  "
                >
                  If the button does not work, copy and paste this URL
                  into your browser:<br />
                  ${verifyUrl}
                </p>
              </div>

              <div
                style="
                  padding:20px 24px;
                  background:#f8fafc;
                  border-top:1px solid #e2e8f0;
                "
              >
                <p
                  style="
                    margin:0;
                    color:#64748b;
                    font-size:12px;
                  "
                >
                  This is an automated email from DueMate.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(
      `Resend verification email failed: ${error.message}`,
    );
  }

  console.log("Verification email sent:", data?.id);
};

export const sendPasswordResetEmail = async (
  toEmail: string,
  token: string,
): Promise<void> => {
  const resetUrl = `${clientUrl}/reset-password?token=${encodeURIComponent(
    token,
  )}`;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: "Reset Your Password - DueMate",
    text: `
Password Reset Request

Click the following link to reset your DueMate password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.
`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Reset Your Password - DueMate</title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f1f5f9;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          <div style="padding:32px 16px;">
            <div
              style="
                max-width:600px;
                margin:0 auto;
                background:#ffffff;
                border-radius:12px;
                overflow:hidden;
                border:1px solid #e2e8f0;
              "
            >
              <div
                style="
                  padding:24px;
                  background:#0f172a;
                "
              >
                <div
                  style="
                    font-size:24px;
                    font-weight:700;
                    color:#ffffff;
                  "
                >
                  DueMate
                </div>

                <div
                  style="
                    margin-top:4px;
                    font-size:13px;
                    color:#cbd5e1;
                  "
                >
                  Never miss a due date.
                </div>
              </div>

              <div style="padding:32px 24px;">
                <h1
                  style="
                    margin:0;
                    color:#0f172a;
                    font-size:22px;
                  "
                >
                  Reset your password
                </h1>

                <p
                  style="
                    margin:20px 0 0;
                    color:#475569;
                    font-size:15px;
                    line-height:1.7;
                  "
                >
                  We received a request to reset your DueMate password.
                </p>

                <div style="margin-top:28px;text-align:center;">
                  <a
                    href="${resetUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="
                      display:inline-block;
                      padding:12px 22px;
                      background:#0f172a;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:8px;
                      font-size:14px;
                      font-weight:600;
                    "
                  >
                    Reset Password
                  </a>
                </div>

                <p
                  style="
                    margin:24px 0 0;
                    color:#64748b;
                    font-size:13px;
                    line-height:1.6;
                  "
                >
                  This password reset link will expire in 15 minutes.
                </p>

                <p
                  style="
                    margin:16px 0 0;
                    color:#94a3b8;
                    font-size:12px;
                    line-height:1.6;
                    word-break:break-all;
                  "
                >
                  If the button does not work, copy and paste this URL
                  into your browser:<br />
                  ${resetUrl}
                </p>

                <p
                  style="
                    margin:24px 0 0;
                    color:#64748b;
                    font-size:13px;
                    line-height:1.6;
                  "
                >
                  If you did not request a password reset, you can
                  safely ignore this email.
                </p>
              </div>

              <div
                style="
                  padding:20px 24px;
                  background:#f8fafc;
                  border-top:1px solid #e2e8f0;
                "
              >
                <p
                  style="
                    margin:0;
                    color:#64748b;
                    font-size:12px;
                  "
                >
                  This is an automated email from DueMate.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(
      `Resend password reset email failed: ${error.message}`,
    );
  }

  console.log("Password reset email sent:", data?.id);
};