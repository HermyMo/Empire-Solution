import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import path from "path";

// Load environment variables from .env file before other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import express from "express";
import fs from "fs";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail, sendPasswordResetEmail } from "./mailer.js";
import twilio from "twilio";
import { Vonage } from "@vonage/server-sdk";
import AfricasTalking from "africastalking";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "alerts.jsonl");
const SMS_DIR = path.join(__dirname, "sms");
const REPORTS_DIR = path.join(__dirname, "reports_vault");
const ALLOW_UNVERIFIED_ALERTS = (process.env.ALLOW_UNVERIFIED_ALERTS === 'true');
const ALLOW_PUBLIC_ALERTS = (process.env.ALLOW_PUBLIC_ALERTS === 'true');

// Multi-provider SMS configuration
const TWILIO_SID = process.env.TWILIO_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_FROM = process.env.TWILIO_FROM || "";

const VONAGE_API_KEY = process.env.VONAGE_API_KEY || "";
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET || "";
const VONAGE_FROM = process.env.VONAGE_FROM || "";

const AT_USERNAME = process.env.AT_USERNAME || "";
const AT_API_KEY = process.env.AT_API_KEY || "";
const AT_FROM = process.env.AT_FROM || "";

// Detect which SMS provider is configured (priority: Twilio > Vonage > Africa's Talking)
function getSmsProvider() {
  if (TWILIO_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM) return "twilio";
  if (VONAGE_API_KEY && VONAGE_API_SECRET && VONAGE_FROM) return "vonage";
  if (AT_USERNAME && AT_API_KEY && AT_FROM) return "africastalking";
  return null;
}

async function sendSmsReal(to, message) {
  const provider = getSmsProvider();
  if (!provider) return { ok: false, reason: "no_sms_provider_configured" };

  try {
    if (provider === "twilio") {
      const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
      const result = await client.messages.create({ to, from: TWILIO_FROM, body: message });
      return { ok: true, provider: "twilio", sid: result.sid };
    }

    if (provider === "vonage") {
      const vonage = new Vonage({
        apiKey: VONAGE_API_KEY,
        apiSecret: VONAGE_API_SECRET,
      });
      try {
        const responseData = await vonage.sms.send({ to, from: VONAGE_FROM, text: message });
        const msg = responseData?.messages?.[0];
        if (msg?.status === "0") {
          return { ok: true, provider: "vonage", messageId: msg["message-id"] };
        } else {
          return { ok: false, provider: "vonage", reason: "vonage_send_failed", error: msg?.["error-text"] || msg?.status };
        }
      } catch (err) {
        console.error("Vonage send failed", err);
        return { ok: false, provider: "vonage", reason: "vonage_send_exception", error: err?.message };
      }
    }

    if (provider === "africastalking") {
      const africastalking = AfricasTalking({ username: AT_USERNAME, apiKey: AT_API_KEY });
      const sms = africastalking.SMS;
      const result = await sms.send({ to: [to], message, from: AT_FROM });
      const recipient = result?.SMSMessageData?.Recipients?.[0];
      if (recipient?.status === "Success") {
        return { ok: true, provider: "africastalking", messageId: recipient.messageId };
      } else {
        return { ok: false, reason: "africastalking_send_failed", error: recipient?.status };
      }
    }
  } catch (e) {
    console.error(`${provider} send failed`, e);
    return { ok: false, reason: `${provider}_send_failed`, error: e?.message };
  }

  return { ok: false, reason: "unknown_provider" };
}
const USERS_FILE = path.join(__dirname, "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Initialize users.json if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }), "utf8");
}

app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Load users
function getUsers() {
  const data = fs.readFileSync(USERS_FILE, "utf8");
  return JSON.parse(data).users;
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2), "utf8");
}

// Auth endpoints
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, phone, notifyBySMS } = req.body;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      name,
      phone,
      notifyBySMS,
      isVerified: false,
      password: hashedPassword,
      trustedContacts: [],
    };

    users.push(user);
    saveUsers(users);

    // generate auth token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
    const { password: _, ...userWithoutPassword } = user;

    // generate email verification token and send verification email
    try {
      const verifyToken = jwt.sign({ id: user.id, type: "verify" }, JWT_SECRET, { expiresIn: "24h" });
      const appUrl = process.env.APP_URL || "http://localhost:5173";
      const verifyUrl = `http://localhost:3000/api/auth/verify?token=${verifyToken}`;
      await sendEmail({
        to: email,
        subject: "Verify your email",
        text: `Please verify your email by visiting: ${verifyUrl}`,
        html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`,
      });
    } catch (e) {
      console.error("Failed to send verification email:", e);
    }

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please check your email for a verification link." });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Verify email endpoint
app.get("/api/auth/verify", (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Missing token");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== "verify") return res.status(400).send("Invalid token");
    const users = getUsers();
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(404).send("User not found");
    if (user.isVerified) return res.send("Already verified");
    user.isVerified = true;
    saveUsers(users);
    // Redirect to the frontend after verification
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    return res.redirect(`${appUrl}`);
  } catch (e) {
    console.error("Verify error:", e);
    return res.status(400).send("Verification failed or token expired");
  }
});

// Request password reset
app.post("/api/auth/request-password-reset", async (req, res) => {
  try {
    const { email } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(200).json({ ok: true }); // do not reveal

    const resetToken = jwt.sign({ id: user.id, type: "reset" }, JWT_SECRET, { expiresIn: "1h" });
    
    try {
      console.log(`Sending password reset email to ${email}`);
      await sendPasswordResetEmail(email, resetToken);
      console.log(`Password reset email sent successfully to ${email}`);
    } catch (e) {
      console.error("Failed to send reset email:", e);
      console.error("Error details:", e.message, e.stack);
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error("Password reset request error:", e);
    return res.status(500).json({ message: "Failed" });
  }
});

// Reset password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Missing token or password" });
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (payload.type !== "reset") return res.status(400).json({ message: "Invalid token" });
    const users = getUsers();
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    saveUsers(users);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to reset password" });
  }
});

// In case users click a legacy or incorrect base URL that points to the API server,
// redirect browser traffic for the password reset page to the frontend app.
// This preserves the query string (?token=...).
app.get("/reset-password", (req, res) => {
  try {
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    return res.redirect(`${appUrl}/reset-password${qs}`);
  } catch (e) {
    console.error("Redirect /reset-password failed:", e);
    return res.status(404).send("File not found");
  }
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Authentication check failed" });
  }
});

function appendLine(obj) {
  const line = JSON.stringify(obj) + "\n";
  fs.appendFileSync(DATA_FILE, line, { encoding: "utf8" });
}

app.post("/api/panic-alert", authenticateToken, (req, res) => {
  const payload = req.body;
  console.log("[panic-alert] received:", payload);
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user || (!user.isVerified && !ALLOW_UNVERIFIED_ALERTS)) return res.status(403).json({ message: "Email not verified" });
    appendLine({ type: "panic-alert", receivedAt: Date.now(), userId: req.user.id, payload });
  } catch (e) {
    console.error("Failed to write alert", e);
  }
  res.status(200).json({ ok: true });
});

app.post("/api/panic-audit", authenticateToken, (req, res) => {
  const payload = req.body;
  console.log("[panic-audit] received:", payload);
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user || (!user.isVerified && !ALLOW_UNVERIFIED_ALERTS)) return res.status(403).json({ message: "Email not verified" });
    appendLine({ type: "panic-audit", receivedAt: Date.now(), userId: req.user.id, payload });
  } catch (e) {
    console.error("Failed to write audit", e);
  }
  res.status(200).json({ ok: true });
});

// Trusted Contacts endpoints
app.get("/api/trusted-contacts", authenticateToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Initialize trustedContacts if not present (for existing users)
    if (!user.trustedContacts) {
      user.trustedContacts = [];
    }
    res.json({ trustedContacts: user.trustedContacts });
  } catch (error) {
    console.error("Failed to fetch trusted contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

app.post("/api/trusted-contacts", authenticateToken, (req, res) => {
  try {
    const { trustedContacts } = req.body;
    if (!Array.isArray(trustedContacts)) {
      return res.status(400).json({ message: "trustedContacts must be an array" });
    }
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.trustedContacts = trustedContacts;
    saveUsers(users);
    res.json({ ok: true, trustedContacts: user.trustedContacts });
  } catch (error) {
    console.error("Failed to save trusted contacts:", error);
    res.status(500).json({ message: "Failed to save contacts" });
  }
});

// Encrypted Reports Vault endpoints
// Helper function to encrypt data
function encryptData(data, password) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
}

// Helper function to decrypt data
function decryptData(encrypted, password) {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(password, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encrypted.iv, 'hex'));
    let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}

// Save encrypted report
app.post("/api/reports", async (req, res) => {
  try {
    const { vaultPassword, ...reportData } = req.body;
    
    if (!vaultPassword) {
      return res.status(400).json({ message: "Vault password required" });
    }

    // Get user ID from token if authenticated (not anonymous)
    let userId = "anonymous";
    if (reportData.userId) {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token) {
        try {
          const payload = jwt.verify(token, JWT_SECRET);
          userId = payload.id;
        } catch (e) {
          // Invalid token, treat as anonymous
        }
      }
    }

    // Create reports directory if it doesn't exist
    if (!fs.existsSync(REPORTS_DIR)) {
      fs.mkdirSync(REPORTS_DIR, { recursive: true });
    }

    // Encrypt the report data
    const encrypted = encryptData(reportData, vaultPassword);
    
    // Create unique filename
    const reportId = `report_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const reportFile = path.join(REPORTS_DIR, `${reportId}.json`);
    
    // Save encrypted report
    const reportRecord = {
      id: reportId,
      userId: userId,
      createdAt: new Date().toISOString(),
      category: reportData.category,
      isAnonymous: reportData.isAnonymous || false,
      isWitness: reportData.isWitness || false,
      encrypted: encrypted
    };
    
    fs.writeFileSync(reportFile, JSON.stringify(reportRecord, null, 2), "utf8");
    console.log(`[report] saved encrypted: ${reportId}`);
    
    res.json({ ok: true, reportId });
  } catch (error) {
    console.error("Failed to save report:", error);
    res.status(500).json({ message: "Failed to save report" });
  }
});

// Get encrypted reports (requires password to decrypt)
app.get("/api/reports", async (req, res) => {
  try {
    const { password, reportId } = req.query;
    
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    if (!fs.existsSync(REPORTS_DIR)) {
      return res.json({ reports: [] });
    }

    const files = fs.readdirSync(REPORTS_DIR);
    const reports = [];

    for (const file of files) {
      if (reportId && !file.startsWith(reportId)) {
        continue; // Skip if looking for specific report
      }
      
      try {
        const filePath = path.join(REPORTS_DIR, file);
        const reportRecord = JSON.parse(fs.readFileSync(filePath, "utf8"));
        
        // Try to decrypt with provided password
        const decrypted = decryptData(reportRecord.encrypted, password);
        
        if (decrypted) {
          reports.push({
            id: reportRecord.id,
            userId: reportRecord.userId,
            createdAt: reportRecord.createdAt,
            category: reportRecord.category,
            isAnonymous: reportRecord.isAnonymous,
            isWitness: reportRecord.isWitness,
            ...decrypted
          });
        }
      } catch (e) {
        console.error(`Failed to read report ${file}:`, e);
      }
    }

    res.json({ reports });
  } catch (error) {
    console.error("Failed to retrieve reports:", error);
    res.status(500).json({ message: "Failed to retrieve reports" });
  }
});

// Simple SMS alert endpoint: writes SMS messages to server/sms directory (fallback) for now
// If you later add a provider (e.g., Twilio), wire it here using env vars.
// Normalize a `to` field that can be string, comma-string, or array into a unique array of recipients
function normalizeRecipients(to) {
  let list = [];
  if (Array.isArray(to)) list = to;
  else if (typeof to === "string") list = to.split(",");
  list = list.map((s) => String(s).trim()).filter(Boolean);
  // de-duplicate while preserving order
  const seen = new Set();
  const uniq = [];
  for (const r of list) {
    if (!seen.has(r)) {
      seen.add(r);
      uniq.push(r);
    }
  }
  return uniq;
}

app.post("/api/alerts/sms", async (req, res) => {
  try {
    const { to, message } = req.body || {};
    if (!to || !message) return res.status(400).json({ message: "Missing 'to' or 'message'" });

    // Try to authenticate user from Authorization header; if missing and ALLOW_PUBLIC_ALERTS, proceed as anonymous
    let authedUser = null;
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token) {
        const payload = jwt.verify(token, JWT_SECRET);
        const users = getUsers();
        const user = users.find((u) => u.id === payload.id);
        if (user) authedUser = user;
      }
    } catch (e) {
      // invalid token - treat as unauthenticated below
    }

    if (!authedUser && !ALLOW_PUBLIC_ALERTS) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // If authenticated, enforce verification unless ALLOW_UNVERIFIED_ALERTS is enabled
    if (authedUser && (!authedUser.isVerified && !ALLOW_UNVERIFIED_ALERTS)) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const recipients = normalizeRecipients(to);
    if (!recipients.length) return res.status(400).json({ message: "No valid recipients" });

    // Try real SMS first (if configured)
    const results = [];
    for (const r of recipients) {
      const out = await sendSmsReal(r, message);
      console.log(`[sms] attempt provider=${out.provider || 'none'} to=${r} ok=${out.ok} reason=${out.reason || ''}`);
      results.push({ to: r, ...out });
    }
    const anySuccess = results.some((r) => r.ok);
    if (anySuccess) {
      const successProvider = (results.find((r) => r.ok)?.provider) || "sms";
      appendLine({ type: "sms", transport: successProvider, userId: authedUser ? authedUser.id : "public-anon", to: recipients, receivedAt: Date.now() });
      return res.json({ ok: true, mode: successProvider, results });
    }

    // Fallback to file (configurable)
    const SMS_FALLBACK_TO_FILE = (process.env.SMS_FALLBACK_TO_FILE ?? "true").toLowerCase() !== "false";
    if (!SMS_FALLBACK_TO_FILE) {
      console.warn("SMS fallback to file disabled via env. Returning error.");
      return res.status(502).json({ ok: false, mode: "none", message: "SMS send failed and fallback disabled", results });
    }

    if (!fs.existsSync(SMS_DIR)) {
      fs.mkdirSync(SMS_DIR, { recursive: true });
    }
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.join(SMS_DIR, `sms-${ts}.json`);
    const record = {
      userId: authedUser ? authedUser.id : "public-anon",
      to: recipients,
      message,
      receivedAt: Date.now(),
      userAgent: req.headers['user-agent'] || null,
    };
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");
    console.log(`[sms] saved to ${filePath}`);
    return res.json({ ok: true, mode: "file", file: filePath, results });
  } catch (e) {
    console.error("/api/alerts/sms failed", e);
    return res.status(500).json({ message: "Failed to send SMS alert" });
  }
});

// Email alert endpoint: sends email to one or more recipients and logs the event
app.post("/api/alerts/email", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body || {};
    if (!to || !(subject || text || html)) {
      return res.status(400).json({ message: "Missing 'to' or content ('subject'/'text'/'html')" });
    }

    // Try to authenticate user from Authorization header; if missing and ALLOW_PUBLIC_ALERTS, proceed as anonymous
    let authedUser = null;
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token) {
        const payload = jwt.verify(token, JWT_SECRET);
        const users = getUsers();
        const user = users.find((u) => u.id === payload.id);
        if (user) authedUser = user;
      }
    } catch (e) {
      // invalid token - treat as unauthenticated below
    }

    if (!authedUser && !ALLOW_PUBLIC_ALERTS) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // If authenticated, enforce verification unless ALLOW_UNVERIFIED_ALERTS is enabled
    if (authedUser && (!authedUser.isVerified && !ALLOW_UNVERIFIED_ALERTS)) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const recipients = normalizeRecipients(to);
    if (!recipients.length) return res.status(400).json({ message: "No valid recipients" });

    const results = [];
    for (const r of recipients) {
      try {
        const info = await sendEmail({ to: r, subject, text, html });
        results.push({ to: r, ok: true, transport: info?.messageId?.startsWith("file:") ? "file" : "smtp", messageId: info?.messageId || null });
      } catch (err) {
        console.error(`[email] send failed to=${r}`, err);
        results.push({ to: r, ok: false, reason: err?.message || "send_failed" });
      }
    }

    const anySuccess = results.some((r) => r.ok);
    appendLine({ type: "email", transport: anySuccess ? (results.find((r) => r.ok)?.transport || "email") : "none", userId: authedUser ? authedUser.id : "public-anon", to: recipients, receivedAt: Date.now(), meta: { subjectPresent: Boolean(subject), textPresent: Boolean(text), htmlPresent: Boolean(html) } });

    return res.json({ ok: anySuccess, results });
  } catch (e) {
    console.error("/api/alerts/email failed", e);
    return res.status(500).json({ message: "Failed to send Email alert" });
  }
});

app.get("/alerts", authenticateToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user || !user.isVerified) return res.status(403).json({ message: "Email not verified" });
    if (!fs.existsSync(DATA_FILE)) return res.json([]);
    const lines = fs.readFileSync(DATA_FILE, "utf8").trim().split(/\r?\n/).filter(Boolean);
    const last = lines.slice(-200)
      .map((l) => {
        try { return JSON.parse(l); } catch(e) { return { raw: l }; }
      })
      // Only return alerts for the authenticated user
      .filter(alert => alert.userId === req.user.id);
    res.json(last.reverse());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to read alerts" });
  }
});

// Test endpoint for email configuration
app.post("/api/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email address is required" });
    }

    await sendEmail({
      to: email,
      subject: "Test Email from SafeSupport",
      text: "This is a test email to verify your SMTP configuration is working.",
      html: "<h1>Test Email</h1><p>This is a test email to verify your SMTP configuration is working.</p>"
    });

    res.json({ 
      message: "Test email sent successfully",
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? "configured" : "missing",
        pass: process.env.SMTP_PASS ? "configured" : "missing"
      }
    });
  } catch (error) {
    console.error("Test email failed:", error);
    res.status(500).json({ 
      message: "Failed to send test email",
      error: error.message,
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? "configured" : "missing",
        pass: process.env.SMTP_PASS ? "configured" : "missing"
      }
    });
  }
});

// Simple homepage to avoid "Cannot GET /" when visiting the server root
app.get("/", (req, res) => {
  res.type("html").send(`
    <html>
      <head><title>Demo Panic Server</title></head>
      <body style="font-family:system-ui,Arial,sans-serif;margin:40px;">
        <h1>Demo Panic Server</h1>
        <p>This server receives <code>/api/panic-alert</code> and <code>/api/panic-audit</code> POST requests.</p>
        <p><a href="/alerts">View recent events (/alerts)</a></p>
        <p>Authentication required for all API endpoints.</p>
        <p>To test email configuration: POST to <code>/api/test-email</code> with {"email": "your@email.com"}</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  const provider = getSmsProvider();
  console.log(`SMS Provider detected: ${provider || 'none (file fallback)'}`);
  console.log("Available endpoints:");
  console.log("- POST /api/auth/register - Register new user");
  console.log("- POST /api/auth/login - Login user");
  console.log("- GET /api/auth/me - Get current user (requires auth)");
  console.log("- POST /api/panic-alert - Send panic alert (requires auth)");
  console.log("- POST /api/panic-audit - Send audit event (requires auth)");
  console.log("- POST /api/alerts/sms - Send SMS alert (requires auth)");
  console.log("- POST /api/alerts/email - Send Email alert (requires auth)");
  console.log("- GET /api/trusted-contacts - Get user's trusted contacts (requires auth)");
  console.log("- POST /api/trusted-contacts - Save user's trusted contacts (requires auth)");
  console.log("- POST /api/reports - Save encrypted incident report");
  console.log("- GET /api/reports?password=xxx - Retrieve encrypted reports (requires password)");
  console.log("- GET /alerts - View user's recent events (requires auth)");
});
