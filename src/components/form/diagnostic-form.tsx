"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import {
  BUDGET_RANGES,
  CHALLENGE_CATEGORIES,
  CONSULTATION_LANGUAGES,
  CONTACT_METHODS,
  ORGANISATION_TYPES,
} from "@/lib/domain";
import { DRAFT_KEY } from "@/components/home/magic-box";
import { ALLOWED_UPLOAD_EXTENSIONS } from "@/lib/validation";

type Errors = Record<string, string>;

const CONSENT_TEXT =
  "I confirm this contains no confidential or classified material, and I consent to KAPT reviewing it to prepare an initial digital diagnosis. This is not a contract or quotation.";

function Field({
  label,
  name,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function DiagnosticForm() {
  const router = useRouter();
  const params = useSearchParams();
  const isConsultation = params.get("intent") === "consultation";

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const renderedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const draft = sessionStorage.getItem(DRAFT_KEY);
    if (draft) setDescription(draft);
  }, []);

  const acceptAttr = useMemo(() => ALLOWED_UPLOAD_EXTENSIONS.join(","), []);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, 6));
  }
  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  // Demo build: no backend. Validate on the client, then show the confirmation
  // screen with a demo reference. The tech team wires the real submission API.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setErrors({});

    const form = e.currentTarget;
    const nextErrors: Errors = {};
    const required: [string, string][] = [
      ["challengeDescription", "Please describe the challenge."],
      ["fullName", "Please enter your full name."],
      ["workEmail", "Please enter your work email."],
      ["mobile", "Please enter a contact number."],
      ["organisationName", "Please enter your organisation."],
    ];
    for (const [name, msg] of required) {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
      if (!el || !el.value.trim()) nextErrors[name] = msg;
    }
    if (!consent) nextErrors.consent = "Please tick the box so our team can review your challenge.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstKey = Object.keys(nextErrors)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    const year = new Date().getFullYear();
    const ref = `KAPT-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    sessionStorage.removeItem(DRAFT_KEY);
    router.push(`/submitted?ref=${encodeURIComponent(ref)}`);
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot — hidden from humans, catches naive bots */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company_url">Company URL</label>
        <input id="company_url" name="company_url" tabIndex={-1} autoComplete="off" />
      </div>

      {/* The one thing that matters: describe it */}
      <Field
        label="What is slowing your organisation down?"
        name="challengeDescription"
        required
        error={errors.challengeDescription}
        hint="Explain it as you would to a colleague. A few honest sentences is enough."
      >
        <textarea
          id="challengeDescription"
          name="challengeDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="field-input resize-y leading-relaxed"
          maxLength={8000}
          placeholder="e.g. We manage hundreds of participants across WhatsApp and Excel, and monthly reporting takes us almost two weeks."
        />
      </Field>

      {/* Who you are — four short fields */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required error={errors.fullName}>
          <input id="fullName" name="fullName" className="field-input" autoComplete="name" />
        </Field>
        <Field label="Work email" name="workEmail" required error={errors.workEmail}>
          <input id="workEmail" name="workEmail" type="email" className="field-input" autoComplete="email" />
        </Field>
        <Field label="Mobile / WhatsApp" name="mobile" required error={errors.mobile}>
          <input id="mobile" name="mobile" type="tel" className="field-input" autoComplete="tel" placeholder="+60 ..." />
        </Field>
        <Field label="Organisation" name="organisationName" required error={errors.organisationName}>
          <input id="organisationName" name="organisationName" className="field-input" autoComplete="organization" />
        </Field>
      </div>

      {/* Everything else is optional and out of the way */}
      <div>
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-primary hover:bg-primary-soft"
          aria-expanded={showMore}
        >
          <Icon.ChevronDown className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
          Add more detail or a file (optional)
        </button>

        {showMore && (
          <div className="mt-4 animate-scale-in space-y-5 rounded-xl border border-border bg-surface/50 p-4 sm:p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Organisation type" name="organisationType">
                <select id="organisationType" name="organisationType" className="field-input" defaultValue="">
                  <option value="">Select (optional)</option>
                  {ORGANISATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Your role" name="position">
                <input id="position" name="position" className="field-input" autoComplete="organization-title" />
              </Field>
              <Field label="What best describes it?" name="category">
                <select id="category" name="category" className="field-input" defaultValue="">
                  <option value="">Not sure / not listed</option>
                  {CHALLENGE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </Field>
              <Field label="People affected" name="affectedUsers">
                <input id="affectedUsers" name="affectedUsers" className="field-input" placeholder="e.g. ~2,000" />
              </Field>
              <Field label="Target deadline" name="deadline">
                <input id="deadline" name="deadline" className="field-input" placeholder="e.g. before Q4" />
              </Field>
              <Field label="Budget range" name="budget" hint="Optional — never required.">
                <select id="budget" name="budget" className="field-input" defaultValue="">
                  <option value="">Prefer not to say</option>
                  {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Current tools" name="currentTools">
                <input id="currentTools" name="currentTools" className="field-input" placeholder="e.g. Excel, WhatsApp" />
              </Field>
              <Field label="Preferred contact" name="preferredContact">
                <select id="preferredContact" name="preferredContact" className="field-input" defaultValue={isConsultation ? "Video consultation" : ""}>
                  <option value="">No preference</option>
                  {CONTACT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Language" name="preferredLanguage">
                <select id="preferredLanguage" name="preferredLanguage" className="field-input" defaultValue="">
                  <option value="">No preference</option>
                  {CONSULTATION_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Website or link" name="supportingLink">
                <input id="supportingLink" name="supportingLink" className="field-input" placeholder="https://" />
              </Field>
            </div>

            {/* Optional file upload */}
            <div>
              <label
                htmlFor="files"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-white px-4 py-4 text-center text-sm transition-colors hover:border-primary"
              >
                <Icon.Upload className="h-4 w-4 text-primary" />
                <span className="font-medium text-ink">Attach a file</span>
                <span className="text-xs text-muted">PDF, Word, Excel, PPT, JPG, PNG · up to 15MB</span>
                <input id="files" type="file" multiple accept={acceptAttr} className="sr-only" onChange={(e) => addFiles(e.target.files)} />
              </label>
              {files.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-md border border-border bg-white px-3 py-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-ink">
                        <Icon.Doc className="h-4 w-4 shrink-0 text-muted" />
                        <span className="truncate">{f.name}</span>
                      </span>
                      <button type="button" onClick={() => removeFile(i)} className="rounded p-1 text-muted hover:text-danger" aria-label={`Remove ${f.name}`}>
                        <Icon.Plus className="h-4 w-4 rotate-45" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
                <Icon.Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Please do not upload confidential, classified, or personal-data files here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Consent + submit */}
      <div className="space-y-4 border-t border-border pt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border-strong text-primary focus:ring-primary/30"
          />
          <span className="text-[0.9rem] leading-relaxed text-ink-soft">{CONSENT_TEXT}</span>
        </label>
        {errors.consent && <p className="field-error" role="alert">{errors.consent}</p>}

        {formError && (
          <div className="flex items-start gap-2 rounded-lg border border-danger/40 bg-danger-soft/60 p-4 text-sm text-ink" role="alert">
            <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            {formError}
          </div>
        )}

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            Free · no obligation ·{" "}
            <Link href="/privacy" className="text-primary underline underline-offset-2">privacy</Link>
          </p>
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Sending…" : "Send my challenge"}
            {!submitting && <Icon.Arrow className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Keys that live inside the collapsed "more detail" area (used to auto-expand on error).
const OPTIONAL_KEYS = new Set([
  "organisationType", "position", "category", "affectedUsers", "deadline",
  "budget", "currentTools", "preferredContact", "preferredLanguage", "supportingLink",
]);
