"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonLink, Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { siteMeta } from "@/lib/content";

export function Confirmation() {
  const params = useSearchParams();
  const reference = params.get("ref") ?? "KAPT-—";
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    setStamp(new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" }));
  }, []);

  const nextSteps = [
    "Check your email (including the spam folder) for a confirmation from KAPT.",
    "Keep your reference number for any follow-up.",
    `Our team will review your challenge and reply, usually within ${siteMeta.responseWindow}.`,
    "We may contact you if we need to clarify any detail.",
  ];

  return (
    <div className="bg-surface/40">
      <div className="container-cap max-w-3xl py-16 sm:py-20">
        <div className="rounded-2xl border border-border bg-white p-7 shadow-card sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-16 w-16 animate-scale-in place-items-center rounded-full bg-success-soft text-success">
              <Icon.Check className="h-8 w-8" />
            </span>
            <h1 className="mt-5 text-h1 font-extrabold text-ink">Thank you. Your challenge has been received.</h1>
            <p className="mt-3 max-w-xl text-lead text-ink-soft">
              Our KAPT team will review your submission and prepare an initial digital diagnosis.
            </p>
          </div>

          <dl className="mt-8 grid gap-3 rounded-xl border border-border bg-surface/60 p-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Reference number</dt>
              <dd className="mt-0.5 text-lg font-bold text-primary">{reference}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Submitted</dt>
              <dd className="mt-0.5 text-[0.95rem] font-medium text-ink">{stamp || "Just now"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Expected response</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-[0.95rem] font-medium text-ink">
                <Icon.Clock className="h-4 w-4 text-primary" /> Within {siteMeta.responseWindow}, by email
              </dd>
            </div>
          </dl>

          <div className="mt-7">
            <h2 className="text-h3 font-bold text-ink">What happens next</h2>
            <ul className="mt-3 space-y-2.5">
              {nextSteps.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-[0.94rem] text-ink-soft">
                  <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" size="md" onClick={() => window.print()} className="w-full sm:w-auto">
              <Icon.Doc className="h-4 w-4" /> Save a summary
            </Button>
            <ButtonLink href="/submit" variant="secondary" size="md" className="w-full sm:w-auto">
              <Icon.Plus className="h-4 w-4" /> Submit another challenge
            </ButtonLink>
            <ButtonLink href="/submit?intent=consultation" size="md" className="w-full sm:w-auto">
              Request an urgent consultation <Icon.Arrow className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          Need help? Contact {siteMeta.email}. An initial diagnosis is preliminary and does not
          constitute a formal quotation.
        </p>
      </div>
    </div>
  );
}
