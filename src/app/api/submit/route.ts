import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validation";
import { saveUpload, maxUploadFiles } from "@/lib/uploads";
import { createCaseFromSubmission, logEmail } from "@/lib/cases";
import { clientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { clientConfirmationEmail, internalNotificationEmail, sendEmail } from "@/lib/email";
import type { AttachmentMeta } from "@/lib/domain";

export const runtime = "nodejs";

const CONSENT_TEXT =
  "Consent given via public diagnostic form: information reviewed to prepare an initial diagnosis; no confidential/classified material; not a contract or quotation.";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);

  // Rate limit: 5 submissions / 10 min / IP
  const rl = rateLimit(`submit:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { message: `Too many submissions. Please try again in ${rl.retryAfter} seconds.` },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form submission." }, { status: 400 });
  }

  // Honeypot: if filled, silently accept without storing (don't tip off bots)
  if ((form.get("company_url") as string)?.length) {
    return NextResponse.json({ reference: "CAP-0000-0000" }, { status: 200 });
  }

  // Timing check: reject submissions faster than 2.5s (likely automated)
  const renderedAt = Number(form.get("renderedAt"));
  if (renderedAt && Date.now() - renderedAt < 2500) {
    return NextResponse.json(
      { message: "That was a little too quick. Please review and submit again." },
      { status: 400 },
    );
  }

  const raw = Object.fromEntries(
    [
      "fullName", "workEmail", "mobile", "organisationName", "organisationType", "position",
      "challengeTitle", "challengeDescription", "consent", "department", "website", "currentTools",
      "affectedUsers", "location", "deadline", "budget", "category", "preferredContact",
      "preferredLanguage", "supportingLink", "company_url", "renderedAt",
    ].map((k) => [k, form.get(k) ?? undefined]),
  );

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  // Handle uploads (validated + stored securely)
  const attachments: AttachmentMeta[] = [];
  const uploadErrors: string[] = [];
  const uploaded = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of uploaded.slice(0, maxUploadFiles())) {
    const outcome = await saveUpload(file);
    if (outcome.ok && outcome.meta) attachments.push(outcome.meta);
    else if (outcome.error) uploadErrors.push(outcome.error);
  }
  if (uploadErrors.length > 0) {
    return NextResponse.json({ message: uploadErrors.join(" ") }, { status: 422 });
  }

  const record = await createCaseFromSubmission(parsed.data, {
    attachments,
    consentText: CONSENT_TEXT,
    ipHash: hashIp(ip),
    userAgent: req.headers.get("user-agent") ?? undefined,
    source: "web",
  });

  // Fire notifications (log-mode when SMTP unset). Never blocks on failure.
  try {
    const confirm = clientConfirmationEmail(record);
    const confirmResult = await sendEmail(record.workEmail, confirm);
    await logEmail(record.id, {
      template: "client_confirmation",
      to: record.workEmail,
      subject: confirm.subject,
      status: confirmResult.status,
      error: confirmResult.error,
    });

    const internalTo = process.env.MAIL_INTERNAL_TO || "cap-team@kobis.example";
    const notify = internalNotificationEmail(record);
    const notifyResult = await sendEmail(internalTo, notify);
    await logEmail(record.id, {
      template: "internal_notification",
      to: internalTo,
      subject: notify.subject,
      status: notifyResult.status,
      error: notifyResult.error,
    });
  } catch (err) {
    console.error("[submit] notification error:", err);
  }

  return NextResponse.json({ reference: record.reference }, { status: 201 });
}
