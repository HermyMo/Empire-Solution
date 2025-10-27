import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

// Use the file's directory so behaviour is stable regardless of where Node was started from
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMAIL_DIR = path.join(__dirname, "emails");
const EMAIL_FALLBACK_TO_FILE = (process.env.EMAIL_FALLBACK_TO_FILE ?? "true").toLowerCase() !== "false";

if (EMAIL_FALLBACK_TO_FILE && !fs.existsSync(EMAIL_DIR)) {
  fs.mkdirSync(EMAIL_DIR, { recursive: true });
}

let transporter = null;

export async function sendEmail({ to, subject, text, html }) {
  const timestamp = Date.now();

  // Lazily (re)create transporter using current env vars. This lets the app call dotenv.config() before
  // we attempt to send email even if mailer.js was imported earlier.
  if (!transporter) {
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_PORT) {
      try {
        transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465, // true for 465, false for other ports (587 uses STARTTLS)
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
          debug: true, // Enable debug logging
          logger: true, // Enable built-in logger
        });

        // attempt verify (await so we know whether it's usable)
        try {
          console.log("Testing SMTP connection with:", {
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            user: SMTP_USER,
            pass: SMTP_PASS ? "(password provided)" : "(no password)",
          });
          await transporter.verify();
          console.log("SMTP transporter configured and verified successfully");
        } catch (err) {
          console.warn("SMTP transporter verification failed:", err && (err.message || err));
          console.log("Falling back to file-based mailer. To fix SMTP:");
          console.log("1. Ensure 2-Step Verification is enabled in your Google Account");
          console.log("2. Generate a new App Password at https://myaccount.google.com/apppasswords");
          console.log("3. Update SMTP_PASS in .env with the new 16-character App Password (no spaces)");
          transporter = null;
        }
      } catch (err) {
        console.warn("Failed to create SMTP transporter, falling back to file-based mailer:", err && (err.message || err));
        transporter = null;
      }
    } else {
      console.log("SMTP not configured. Using file-based mailer (emails saved to server/emails/). To enable real sending, set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS env vars.");
    }
  }

  const FROM_EMAIL = process.env.FROM_EMAIL || (process.env.SMTP_USER || "no-reply@example.com");

  // If transporter is available, try sending real email
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        text,
        html,
      });
      console.log(`Email sent to ${to} via SMTP: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error("Failed to send email via SMTP, falling back to file-based mailer:", err && (err.message || err));
      // fall through to write file
    }
  }

  // As a fallback, save email to file so developers can inspect output (unless disabled)
  if (!EMAIL_FALLBACK_TO_FILE) {
    const err = new Error("Email fallback to file is disabled. Configure SMTP to enable real sending.");
    err.name = "EmailFallbackDisabled";
    throw err;
  }

  const email = {
    timestamp,
    to,
    from: FROM_EMAIL,
    subject,
    text,
    html,
  };

  const safeTo = String(to).replace(/[^a-z0-9@.]/gi, "_");
  const filename = path.join(EMAIL_DIR, `${timestamp}-${safeTo}.json`);
  try {
    fs.writeFileSync(filename, JSON.stringify(email, null, 2));
    console.log(`Email saved to ${filename}`);
  } catch (err) {
    console.error("Failed to write email file fallback:", err && (err.message || err));
  }

  return { messageId: `file:${filename}`, filename };
}

export async function sendPasswordResetEmail(to, resetToken) {
  const baseUrl = process.env.APP_URL || "http://localhost:5173";
  const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const subject = "Reset Your Password";
  const text = `Reset your password: ${resetLink}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <p>
        <a href="${resetLink}" style="background-color:#007BFF;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
      </p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you,<br/>The Support Team</p>
    </div>
  `;

  return await sendEmail({ to, subject, text, html });
}


export default { sendEmail, sendPasswordResetEmail };
