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
  "I confirm the information is accurate to the best of my knowledge, contains no confidential or classified material, and I consent to CAP reviewing it to prepare an initial digital diagnosis. I understand this is not a contract or formal quotation.";

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
  const [showOptional, setShowOptional] = useState(false);
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setErrors({});
    if (!consent) {
      setErrors({ consent: "Please confirm consent so our team can review your challenge." });
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("renderedAt", String(renderedAt.current));
      files.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setFormError(data?.message ?? "Something went wrong. Please review the form and try again.");
        setSubmitting(false);
        // Focus first error
        const firstKey = data?.fieldErrors ? Object.keys(data.fieldErrors)[0] : null;
        if (firstKey) formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
        return;
      }
      sessionStorage.removeItem(DRAFT_KEY);
      router.push(`/submitted?ref=${encodeURIComponent(data.reference)}`);
    } catch {
      setFormError("We could not reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {/* Honeypot — hidden from humans, catches naive bots */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company_url">Company URL</label>
        <input id="company_url" name="company_url" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 1 — The challenge */}
      <fieldset className="space-y-5">
        <legend className="flex items-center gap-2 text-h3 font-bold text-ink">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm text-white">1</span>
          Your challenge
        </legend>
        <Field label="Challenge title" name="challengeTitle" required error={errors.challengeTitle} hint="A short line that captures the issue.">
          <input id="challengeTitle" name="challengeTitle" className="field-input" placeholder="e.g. Participant reporting takes too long" maxLength={160} />
        </Field>
        <Field
          label="Describe the challenge"
          name="challengeDescription"
          required
          error={errors.challengeDescription}
          hint="Explain it as you would to a colleague. What is happening, what is difficult, what you would like to improve."
        >
          <textarea
            id="challengeDescription"
            name="challengeDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={7}
            className="field-input resize-y leading-relaxed"
            maxLength={8000}
          />
        </Field>
        <Field label="What best describes it?" name="category" hint="Not sure is a perfectly good answer.">
          <select id="category" name="category" className="field-input" defaultValue="">
            <option value="" disabled>Select a category</option>
            {CHALLENGE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </fieldset>

      {/* 2 — About you */}
      <fieldset className="space-y-5 border-t border-border pt-8">
        <legend className="flex items-center gap-2 text-h3 font-bold text-ink">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm text-white">2</span>
          About you
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="fullName" required error={errors.fullName}>
            <input id="fullName" name="fullName" className="field-input" autoComplete="name" />
          </Field>
          <Field label="Position or role" name="position" required error={errors.position}>
            <input id="position" name="position" className="field-input" autoComplete="organization-title" />
          </Field>
          <Field label="Work email" name="workEmail" required error={errors.workEmail}>
            <input id="workEmail" name="workEmail" type="email" className="field-input" autoComplete="email" />
          </Field>
          <Field label="Mobile number" name="mobile" required error={errors.mobile}>
            <input id="mobile" name="mobile" type="tel" className="field-input" autoComplete="tel" placeholder="+60 ..." />
          </Field>
        </div>
      </fieldset>

      {/* 3 — Organisation */}
      <fieldset className="space-y-5 border-t border-border pt-8">
        <legend className="flex items-center gap-2 text-h3 font-bold text-ink">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm text-white">3</span>
          Your organisation
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Organisation name" name="organisationName" required error={errors.organisationName}>
            <input id="organisationName" name="organisationName" className="field-input" autoComplete="organization" />
          </Field>
          <Field label="Organisation type" name="organisationType" required error={errors.organisationType}>
            <select id="organisationType" name="organisationType" className="field-input" defaultValue="">
              <option value="" disabled>Select a type</option>
              {ORGANISATION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      {/* 4 — Optional detail (progressive disclosure) */}
      <div className="border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setShowOptional((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-primary hover:bg-primary-soft"
          aria-expanded={showOptional}
        >
          <Icon.ChevronDown className={`h-4 w-4 transition-transform ${showOptional ? "rotate-180" : ""}`} />
          Add more detail (optional — it sharpens the diagnosis)
        </button>

        {showOptional && (
          <div className="mt-5 grid animate-scale-in gap-5 sm:grid-cols-2">
            <Field label="Department or unit" name="department"><input id="department" name="department" className="field-input" /></Field>
            <Field label="Organisation website" name="website"><input id="website" name="website" className="field-input" placeholder="https://" /></Field>
            <Field label="Current tools being used" name="currentTools" hint="e.g. Excel, WhatsApp, Google Forms"><input id="currentTools" name="currentTools" className="field-input" /></Field>
            <Field label="Users or participants affected" name="affectedUsers"><input id="affectedUsers" name="affectedUsers" className="field-input" placeholder="e.g. ~2,000" /></Field>
            <Field label="Location" name="location"><input id="location" name="location" className="field-input" /></Field>
            <Field label="Target deadline" name="deadline"><input id="deadline" name="deadline" className="field-input" placeholder="e.g. Before Q4, or a specific date" /></Field>
            <Field label="Estimated budget range" name="budget" hint="Optional, never mandatory.">
              <select id="budget" name="budget" className="field-input" defaultValue="">
                <option value="">Prefer not to say</option>
                {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Preferred contact method" name="preferredContact">
              <select id="preferredContact" name="preferredContact" className="field-input" defaultValue={isConsultation ? "Video consultation" : ""}>
                <option value="">No preference</option>
                {CONTACT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Preferred consultation language" name="preferredLanguage">
              <select id="preferredLanguage" name="preferredLanguage" className="field-input" defaultValue="">
                <option value="">No preference</option>
                {CONSULTATION_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Supporting web link" name="supportingLink"><input id="supportingLink" name="supportingLink" className="field-input" placeholder="https://" /></Field>
          </div>
        )}
      </div>

      {/* 5 — Files + privacy warning */}
      <fieldset className="space-y-4 border-t border-border pt-8">
        <legend className="flex items-center gap-2 text-h3 font-bold text-ink">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm text-white">4</span>
          Supporting files <span className="text-sm font-normal text-muted">(optional)</span>
        </legend>

        <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning-soft/60 p-4 text-[0.88rem] text-ink">
          <Icon.Lock className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p>
            Please do not upload classified, restricted, confidential, security-sensitive, personal,
            medical, financial, or legally protected information. We can arrange a secure process
            where that is needed.
          </p>
        </div>

        <label
          htmlFor="files"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface/50 px-6 py-8 text-center transition-colors hover:border-primary hover:bg-primary-soft/40"
        >
          <Icon.Upload className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-ink">Click to add files</span>
          <span className="text-xs text-muted">PDF, Word, Excel, PowerPoint, JPEG, PNG · up to 15MB each · max 6 files</span>
          <input id="files" type="file" multiple accept={acceptAttr} className="sr-only" onChange={(e) => addFiles(e.target.files)} />
        </label>

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white px-3.5 py-2.5">
                <span className="flex items-center gap-2 truncate text-sm text-ink">
                  <Icon.Doc className="h-4 w-4 shrink-0 text-muted" />
                  <span className="truncate">{f.name}</span>
                  <span className="shrink-0 text-xs text-muted">{(f.size / 1024 / 1024).toFixed(1)}MB</span>
                </span>
                <button type="button" onClick={() => removeFile(i)} className="rounded p-1 text-muted hover:bg-surface-2 hover:text-danger" aria-label={`Remove ${f.name}`}>
                  <Icon.Plus className="h-4 w-4 rotate-45" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {/* Consent + submit */}
      <div className="space-y-4 border-t border-border pt-8">
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
            By submitting you agree to our{" "}
            <Link href="/terms" className="text-primary underline underline-offset-2">terms of submission</Link> and{" "}
            <Link href="/privacy" className="text-primary underline underline-offset-2">privacy notice</Link>.
          </p>
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Submitting…" : "Submit my challenge"}
            {!submitting && <Icon.Arrow className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </form>
  );
}
