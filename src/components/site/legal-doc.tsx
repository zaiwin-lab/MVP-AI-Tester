import Link from "next/link";
import { Icon } from "@/components/icons";
import { siteMeta } from "@/lib/content";

export interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalDoc({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-surface/40">
      <div className="container-cap max-w-3xl py-14 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <Icon.Arrow className="h-4 w-4 rotate-180" /> Back to home
        </Link>

        <h1 className="mt-5 text-h1 font-extrabold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
        <p className="mt-5 text-lead text-ink-soft">{intro}</p>

        <div className="mt-9 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-h3 font-bold text-ink">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-2.5 leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-white p-5 text-sm text-ink-soft">
          <p className="font-semibold text-ink">Questions about this notice?</p>
          <p className="mt-1">
            Contact {siteMeta.brand} at {siteMeta.email}. This document uses editable placeholder
            details and should be reviewed by {siteMeta.parent} before publication.
          </p>
        </div>
      </div>
    </div>
  );
}
