import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'smtp' | 'none';
  resendApiKey?: string;
  sendgridApiKey?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  from: string;
  isConfigured: boolean;
}

function cleanVal(v: string | undefined): string {
  if (!v) return '';
  return v.trim().replace(/^["']|["']$/g, '').trim();
}

function loadEnvMap(): Record<string, string> {
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
            val = val.replace(/^["']|["']$/g, '').trim();
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
  return envMap;
}

export function getEmailConfig(): EmailConfig {
  const envMap = loadEnvMap();

  const resendApiKey = cleanVal(envMap.RESEND_API_KEY || process.env.RESEND_API_KEY);
  const sendgridApiKey = cleanVal(envMap.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY);
  const host = cleanVal(envMap.SMTP_HOST || process.env.SMTP_HOST);
  const port = parseInt(cleanVal(envMap.SMTP_PORT || process.env.SMTP_PORT) || '587', 10);
  const user = cleanVal(envMap.SMTP_USER || process.env.SMTP_USER || envMap.SMTP_USERNAME || process.env.SMTP_USERNAME);
  const pass = cleanVal(envMap.SMTP_PASSWORD || process.env.SMTP_PASSWORD || envMap.SMTP_PASS || process.env.SMTP_PASS);
  const from = cleanVal(envMap.SMTP_FROM || process.env.SMTP_FROM || envMap.EMAIL_FROM || process.env.EMAIL_FROM) || '"Auric Travels Concierge" <concierge@aurictravels.com>';
  const secure = port === 465 || cleanVal(envMap.SMTP_SECURE || process.env.SMTP_SECURE) === 'true';

  if (resendApiKey) {
    const resendFrom = cleanVal(envMap.RESEND_FROM || process.env.RESEND_FROM);
    const validResendFrom = (resendFrom && !resendFrom.includes('gmail.com') && !resendFrom.includes('yahoo.com') && !resendFrom.includes('hotmail.com') && !resendFrom.includes('aurictravels.com'))
      ? resendFrom
      : 'Auric Travels <onboarding@resend.dev>';
    return {
      provider: 'resend',
      resendApiKey,
      from: validResendFrom,
      isConfigured: true,
    };
  }

  if (sendgridApiKey) {
    return {
      provider: 'sendgrid',
      sendgridApiKey,
      from,
      isConfigured: true,
    };
  }

  if (host && user && pass) {
    return {
      provider: 'smtp',
      host,
      port,
      secure,
      user,
      pass,
      from,
      isConfigured: true,
    };
  }

  return {
    provider: 'none',
    from,
    isConfigured: false,
  };
}

/**
 * Sends a password reset email using the fastest and most reliable available provider:
 * 1. Resend HTTP API (HTTPS port 443 — Recommended for Render, zero TCP timeout risk)
 * 2. SendGrid HTTP API (HTTPS port 443)
 * 3. Direct SMTP (with strict 5-second socket timeouts to prevent client hangs)
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  _recipientName: string,
  resetUrl: string,
  expiresMinutes: number = 15
): Promise<{ success: boolean; error?: string; messageId?: string; provider?: string }> {
  const config = getEmailConfig();

  // Solid gold table button HTML template for maximum email client compatibility
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

  // --- 1. RESEND HTTP REST API (HTTPS / Port 443 — Ideal for Render) ---
  if (config.provider === 'resend' && config.resendApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s strict timeout

      // Ensure allowed testing sender for Resend
      let fromAddress = 'Auric Travels <onboarding@resend.dev>';
      if (config.from && !config.from.includes('gmail.com') && !config.from.includes('yahoo.com') && !config.from.includes('hotmail.com') && !config.from.includes('aurictravels.com')) {
        fromAddress = config.from;
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [toEmail],
          subject: 'Auric Travels - Password Reset Request',
          html: htmlContent,
          text: textContent,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Resend API HTTP ${res.status}: ${errBody}`);
      }

      const data = (await res.json()) as any;
      console.log(`[Email Service - Resend]: Password reset email dispatched to ${toEmail} (ID: ${data.id})`);
      return {
        success: true,
        messageId: data.id,
        provider: 'resend',
      };
    } catch (err: any) {
      console.error(`[Email Service - Resend Error]: Failed to send to ${toEmail}:`, err.message);
      // Fall through to log reset link
    }
  }

  // --- 2. SENDGRID HTTP REST API (HTTPS / Port 443) ---
  if (config.provider === 'sendgrid' && config.sendgridApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: config.from.replace(/.*<([^>]+)>.*/, '$1') || 'concierge@aurictravels.com', name: 'Auric Travels' },
          subject: 'Auric Travels - Password Reset Request',
          content: [
            { type: 'text/plain', value: textContent },
            { type: 'text/html', value: htmlContent },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 202 || res.status === 200) {
        console.log(`[Email Service - SendGrid]: Password reset email dispatched to ${toEmail}`);
        return {
          success: true,
          provider: 'sendgrid',
        };
      } else {
        const errBody = await res.text();
        throw new Error(`SendGrid HTTP ${res.status}: ${errBody}`);
      }
    } catch (err: any) {
      console.error(`[Email Service - SendGrid Error]: Failed to send to ${toEmail}:`, err.message);
    }
  }

  // --- 3. SMTP TRANSPORT (With strict connection & socket timeouts) ---
  if (config.provider === 'smtp' && config.host && config.user && config.pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port || 587,
        secure: config.secure || false,
        auth: {
          user: config.user,
          pass: config.pass,
        },
        connectionTimeout: 4000, // 4s timeout connecting to host
        greetingTimeout: 4000,   // 4s timeout waiting for SMTP greeting
        socketTimeout: 5000,     // 5s timeout on socket operations
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Wrap in strict 6s overall timeout promise
      const sendPromise = transporter.sendMail({
        from: config.from,
        to: toEmail,
        subject: 'Auric Travels - Password Reset Request',
        text: textContent,
        html: htmlContent,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('SMTP Connection timed out (outbound TCP port blocked)')), 6000)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]);
      console.log(`[Email Service - SMTP]: Password reset email dispatched to ${toEmail} (ID: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
        provider: 'smtp',
      };
    } catch (err: any) {
      console.error(`[Email Service - SMTP Error]: Failed to send email to ${toEmail}:`, err.message);
      console.warn('[Email Service Notice]: If deployed on Render/Cloud, outbound SMTP ports (587/465) are often blocked by the host. Set RESEND_API_KEY to use HTTP API delivery.');
    }
  }

  // --- 4. SECURE CONSOLE LOGGING (Fallback for Render logs & testing) ---
  console.log(`\n================================================================`);
  console.log(`[PASSWORD RESET LINK GENERATED]`);
  console.log(`User: ${toEmail}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log(`Expires: In ${expiresMinutes} minutes`);
  console.log(`================================================================\n`);

  return {
    success: false,
    error: 'Email delivery provider unreachable or not configured. Reset link generated in server logs.',
    provider: config.provider,
  };
}
