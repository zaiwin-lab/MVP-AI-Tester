import nodemailer from "nodemailer";
import type { CaseRecord } from "./domain";
import { siteMeta } from "./content";

/**
 * Email delivery. If SMTP_HOST is configured, mail is sent via nodemailer.
 * Otherwise the app runs in "log" mode: the message is printed to the server
 * console and recorded in the case timeline, so the whole flow is testable
 * without any provider. No secrets are ever sent to the client.
 */

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export interface SendResult {
  status: "sent" | "logged" | "failed";
  error?: string;
}

let transportCache: nodemailer.Transporter | null | undefined;

function transport(): nodemailer.Transporter | null {
  if (transportCache !== undefined) return transportCache;
  const host = process.env.SMTP_HOST;
  if (!host) {
    transportCache = null;
    return null;
  }
  transportCache = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transportCache;
}

export async function sendEmail(to: string, email: RenderedEmail): Promise<SendResult> {
  const from = process.env.MAIL_FROM || `${siteMeta.brand} <no-reply@kobis.example>`;
  const tx = transport();
  if (!tx) {
    console.info(
      `\n[email:log-mode] To: ${to}\nSubject: ${email.subject}\n${email.text}\n[/email]\n`,
    );
    return { status: "logged" };
  }
  try {
    await tx.sendMail({ from, to, subject: email.subject, html: email.html, text: email.text });
    return { status: "sent" };
  } catch (err) {
    console.error("[email:error]", err);
    return { status: "failed", error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Layout ──────────────────────────────────────────────────────────────────

function layout(bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f6f7;padding:24px 0;font-family:'Public Sans',Segoe UI,Arial,sans-serif;color:#22323b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8ea;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#173139;padding:22px 28px;color:#ffffff;">
        <div style="font-size:17px;font-weight:700;letter-spacing:-0.01em;">${siteMeta.brand}</div>
        <div style="font-size:12px;color:#a9c3c9;margin-top:2px;">${siteMeta.tagline} · ${siteMeta.parent}</div>
      </td></tr>
      <tr><td style="padding:28px;">${bodyHtml}</td></tr>
      <tr><td style="padding:18px 28px;background:#f7f9f9;border-top:1px solid #e2e8ea;font-size:11px;color:#6b7c84;line-height:1.6;">
        ${siteMeta.motto}<br/>
        This message relates to a digital solution enquiry. An initial diagnosis is preliminary, carries no obligation, and does not constitute a formal quotation or contract.
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

const btn = "display:inline-block;background:#2a6b74;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:600;font-size:14px;";

// ── Templates ─────────────────────────────────────────────────────────────

export function clientConfirmationEmail(c: CaseRecord): RenderedEmail {
  const subject = `We received your challenge — ${c.reference}`;
  const html = layout(`
    <p style="margin:0 0 14px;">Dear ${escapeHtml(c.fullName)},</p>
    <p style="margin:0 0 14px;line-height:1.6;">Thank you for sharing your challenge with the KAPT team at ${escapeHtml(c.organisationName)}. Your submission has been received and is now with us for review.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f7f9f9;border:1px solid #e2e8ea;border-radius:10px;margin:6px 0 18px;">
      <tr><td style="padding:16px 18px;font-size:14px;line-height:1.9;">
        <strong>Reference:</strong> ${c.reference}<br/>
        <strong>Challenge:</strong> ${escapeHtml(c.challengeTitle)}<br/>
        <strong>Organisation:</strong> ${escapeHtml(c.organisationName)}<br/>
        <strong>Submitted:</strong> ${formatDate(c.createdAt)}
      </td></tr>
    </table>
    <p style="margin:0 0 14px;line-height:1.6;">Our team will prepare an initial digital diagnosis and reply, usually within <strong>${siteMeta.responseWindow}</strong>. We may contact you if we need any clarification.</p>
    <p style="margin:0 0 6px;line-height:1.6;font-size:13px;color:#5a6b73;">Please keep this reference for future correspondence. If you did not make this submission, you can ignore this email.</p>
  `);
  const text = `Dear ${c.fullName},\n\nThank you for sharing your challenge with the KAPT team. Your submission has been received.\n\nReference: ${c.reference}\nChallenge: ${c.challengeTitle}\nOrganisation: ${c.organisationName}\nSubmitted: ${formatDate(c.createdAt)}\n\nWe will prepare an initial digital diagnosis and reply, usually within ${siteMeta.responseWindow}.\n\n${siteMeta.brand} — ${siteMeta.motto}`;
  return { subject, html, text };
}

export function internalNotificationEmail(c: CaseRecord): RenderedEmail {
  const subject = `New challenge ${c.reference} · ${c.organisationType} · ${c.challengeTitle}`;
  const html = layout(`
    <p style="margin:0 0 12px;font-weight:600;">A new challenge has been submitted.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;line-height:1.9;">
      <tr><td><strong>Reference:</strong> ${c.reference}</td></tr>
      <tr><td><strong>Contact:</strong> ${escapeHtml(c.fullName)}${c.position ? ` (${escapeHtml(c.position)})` : ""}</td></tr>
      <tr><td><strong>Organisation:</strong> ${escapeHtml(c.organisationName)} — ${c.organisationType}</td></tr>
      <tr><td><strong>Email:</strong> ${escapeHtml(c.workEmail)} · <strong>Mobile:</strong> ${escapeHtml(c.mobile)}</td></tr>
      <tr><td><strong>Category:</strong> ${c.category ?? "Not specified"} · <strong>Budget:</strong> ${c.budget ?? "Not specified"}</td></tr>
    </table>
    <p style="margin:16px 0 6px;font-weight:600;">${escapeHtml(c.challengeTitle)}</p>
    <p style="margin:0 0 18px;line-height:1.6;white-space:pre-wrap;color:#3c4c54;">${escapeHtml(c.challengeDescription).slice(0, 1200)}</p>
    <a href="#" style="${btn}">Open in KAPT admin</a>
  `);
  const text = `New challenge submitted.\n\nReference: ${c.reference}\nContact: ${c.fullName}${c.position ? ` (${c.position})` : ""}\nOrganisation: ${c.organisationName} — ${c.organisationType}\nEmail: ${c.workEmail} · Mobile: ${c.mobile}\nCategory: ${c.category ?? "-"} · Budget: ${c.budget ?? "-"}\n\n${c.challengeTitle}\n${c.challengeDescription}`;
  return { subject, html, text };
}

export function clarificationEmail(c: CaseRecord, message: string): RenderedEmail {
  const subject = `We need a little more detail — ${c.reference}`;
  const html = layout(`
    <p style="margin:0 0 14px;">Dear ${escapeHtml(c.fullName)},</p>
    <p style="margin:0 0 14px;line-height:1.6;">Thank you for your submission (<strong>${c.reference}</strong>). To prepare a useful diagnosis, our team would like to clarify a few points:</p>
    <div style="background:#f7f9f9;border:1px solid #e2e8ea;border-radius:10px;padding:16px 18px;line-height:1.7;white-space:pre-wrap;margin:0 0 18px;">${escapeHtml(message)}</div>
    <p style="margin:0;line-height:1.6;">You can reply directly to this email. Thank you.</p>
  `);
  const text = `Dear ${c.fullName},\n\nThank you for your submission (${c.reference}). To prepare a useful diagnosis we would like to clarify:\n\n${message}\n\nYou can reply directly to this email.`;
  return { subject, html, text };
}

export function diagnosisReadyEmail(c: CaseRecord, summaryHtml: string, summaryText: string): RenderedEmail {
  const subject = `Your initial digital diagnosis — ${c.reference}`;
  const html = layout(`
    <p style="margin:0 0 14px;">Dear ${escapeHtml(c.fullName)},</p>
    <p style="margin:0 0 16px;line-height:1.6;">Our KAPT team has reviewed your challenge (<strong>${c.reference}</strong>) and prepared an initial digital diagnosis. This is a preliminary direction, not a formal quotation.</p>
    <div style="border:1px solid #e2e8ea;border-radius:10px;padding:18px;line-height:1.65;margin:0 0 18px;">${summaryHtml}</div>
    <p style="margin:0 0 16px;line-height:1.6;">If this direction fits, we would be glad to arrange a consultation to refine scope, timeline, and cost.</p>
    <a href="#" style="${btn}">Request a consultation</a>
  `);
  const text = `Dear ${c.fullName},\n\nOur KAPT team has reviewed your challenge (${c.reference}) and prepared an initial digital diagnosis. This is preliminary, not a formal quotation.\n\n${summaryText}\n\nIf this direction fits, we would be glad to arrange a consultation.`;
  return { subject, html, text };
}

// ── utils ─────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
