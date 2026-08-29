import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  isConfigured: boolean;
}

function cleanVal(v: string | undefined): string {
  if (!v) return '';
  return v.trim().replace(/^[\"']|[\"']$/g, '').trim();
}

export function getEmailConfig(): EmailConfig {
  const envMap: Record<string, string> = {};
  const rootDir = process.cwd();
  const envFiles = [
    path.resolve(rootDir, '.env'),
    path.resolve(rootDir, '.env.local'),
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      try {
        const content = fs.readFileSync(envFile, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            val = val.replace(/^[\"']|[\"']$/g, '').trim();
            if (val) {
              envMap[key] = val;
            }
          }
        }
      } catch {
        // Fallback to process.env
      }
    }
  }

  const host = cleanVal(envMap.SMTP_HOST || process.env.SMTP_HOST);
  const port = parseInt(cleanVal(envMap.SMTP_PORT || process.env.SMTP_PORT) || '587', 10);
  const user = cleanVal(envMap.SMTP_USER || process.env.SMTP_USER || envMap.SMTP_USERNAME || process.env.SMTP_USERNAME);
  const pass = cleanVal(envMap.SMTP_PASSWORD || process.env.SMTP_PASSWORD || envMap.SMTP_PASS || process.env.SMTP_PASS);
  const from = cleanVal(envMap.SMTP_FROM || process.env.SMTP_FROM || envMap.EMAIL_FROM || process.env.EMAIL_FROM) || '"Auric Travels Concierge" <concierge@aurictravels.com>';
  const secure = port === 465 || cleanVal(envMap.SMTP_SECURE || process.env.SMTP_SECURE) === 'true';

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    isConfigured: Boolean(host && user && pass),
  };
}

export async function sendPasswordResetEmail(
  toEmail: string,
  _recipientName: string,
  resetUrl: string,
  expiresMinutes: number = 15
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const config = getEmailConfig();

  // Bulletproof HTML email with solid table button and explicit fallback link
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auric Travels - Password Reset Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #121212; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #121212; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #1E1E1E; border: 1px solid #C5A059; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #333333; background-color: #181818;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: #C5A059; letter-spacing: 2px;">
                AURIC TRAVELS
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #a3a3a3; letter-spacing: 1px; text-transform: uppercase;">
                Password Reset Request
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 18px 0; font-size: 15px; color: #ffffff; line-height: 1.6;">
                Someone requested a password reset for your <strong>Auric Travels</strong> account.
              </p>

              <!-- CTA Button (Bulletproof table) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #C5A059;">
                    <a href="${resetUrl}" target="_blank" style="font-size: 14px; font-family: sans-serif; font-weight: bold; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; border: 1px solid #C5A059; display: inline-block; background-color: #C5A059;">
                      RESET PASSWORD
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice -->
              <p style="margin: 24px 0 12px 0; font-size: 13px; color: #e5e5e5; line-height: 1.5;">
                This link expires in <strong>${expiresMinutes} minutes</strong>.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 13px; color: #888888; line-height: 1.5;">
                If you did not request this, you can safely ignore this email.
              </p>

              <hr style="border: none; border-top: 1px solid #333333; margin: 24px 0;">

              <!-- Fallback Plain-Text Link -->
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888;">
                If the button above does not work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0; font-size: 12px; word-break: break-all;">
                <a href="${resetUrl}" target="_blank" style="color: #C5A059; text-decoration: underline;">
                  ${resetUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #141414; border-top: 1px solid #292929; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #666666;">
                Auric Travels &bull; Bespoke Global Journeys &bull; Luxury Member Society
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `
Auric Travels
Password Reset Request

Someone requested a password reset for your Auric Travels account.

Click the link below to reset your password:
${resetUrl}

This link expires in ${expiresMinutes} minutes.

If you did not request this, you can safely ignore this email.
  `.trim();

  if (!config.isConfigured) {
    console.warn('\n[Email Service Notice]: SMTP credentials are not configured in .env.');
    console.log(`[Generated Reset Link for ${toEmail}]:\n${resetUrl}\n`);
    return {
      success: false,
      error: 'SMTP email provider is not configured in .env',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: config.from,
      to: toEmail,
      subject: 'Auric Travels - Password Reset Request',
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Email Service]: Password reset email dispatched to ${toEmail} (Message ID: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[Email Service Error]: Failed to send email to ${toEmail}:`, err.message);
    return {
      success: false,
      error: err.message || 'SMTP transmission failure',
    };
  }
}
