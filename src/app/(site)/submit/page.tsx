import { Suspense } from "react";
import type { Metadata } from "next";
import { DiagnosticForm } from "@/components/form/diagnostic-form";
import { Icon } from "@/components/icons";
import { siteMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "Describe your challenge",
  description:
    "Share your operational challenge with the CAP team. Free initial digital diagnosis, response within 24 hours.",
};

const assurances = [
  { icon: Icon.Clock, label: `Response within ${siteMeta.responseWindow}` },
  { icon: Icon.Check, label: "Free & no obligation" },
  { icon: Icon.Shield, label: "Reviewed by a human" },
];

export default function SubmitPage() {
  return (
    <div className="bg-surface/40">
      <div className="container-cap grid gap-10 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:py-16">
        {/* Left rail — reassurance, sticky on desktop */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[0.78rem] font-semibold text-primary-ink">
            <Icon.Cap className="h-4 w-4" /> Digital solution diagnosis
          </p>
          <h1 className="mt-5 text-h1 font-extrabold text-ink">Tell us what is slowing you down.</h1>
          <p className="mt-4 max-w-md font-serif text-lead text-ink-soft">
            You do not need a technical brief or a system name. Describe the problem, and our CAP team
            will recommend a practical digital direction.
          </p>

          <ul className="mt-7 space-y-3">
            {assurances.map((a) => (
              <li key={a.label} className="flex items-center gap-3 text-[0.95rem] text-ink">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
                  <a.icon className="h-[1.1rem] w-[1.1rem]" />
                </span>
                {a.label}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-border bg-white p-5 text-sm text-ink-soft">
            <p className="font-semibold text-ink">You will not receive an instant AI reply.</p>
            <p className="mt-1.5 leading-relaxed">
              Your submission is read by our team. AI may support internal analysis, but a person
              prepares and checks every response before it reaches you.
            </p>
          </div>
        </aside>

        {/* Right — the form */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-9">
          <Suspense fallback={<div className="py-20 text-center text-muted">Loading form…</div>}>
            <DiagnosticForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
