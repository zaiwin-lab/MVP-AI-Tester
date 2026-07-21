import type { Metadata } from "next";
import { defaultContent } from "@/lib/content";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "See how a diagnosis works",
  description: "Sample challenges and the digital directions KAPT would explore. Examples only.",
};

export default function DemoPage() {
  const demo = defaultContent.demo;
  return (
    <div>
      <section className="bg-surface/40">
        <div className="container-cap max-w-4xl py-14 sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[0.78rem] font-semibold text-primary-ink">
            <Icon.Spark className="h-4 w-4" /> Example mode
          </p>
          <h1 className="mt-5 text-h1 font-extrabold text-ink">{demo.heading}</h1>
          <p className="mt-4 max-w-2xl text-lead text-ink-soft">{demo.sub}</p>
        </div>
      </section>

      <div className="container-cap max-w-4xl space-y-6 py-14">
        {demo.items.map((item, i) => (
          <article key={i} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="grid md:grid-cols-2">
              <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent-ink">
                  What the organisation said
                </p>
                <p className="mt-2 font-serif text-lead italic text-ink">“{item.challenge}”</p>
              </div>
              <div className="bg-surface/50 p-6">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary-ink">
                  Direction KAPT would explore
                </p>
                <p className="mt-2 leading-relaxed text-ink-soft">{item.direction}</p>
              </div>
            </div>
          </article>
        ))}

        <div className="rounded-xl border border-warning/40 bg-warning-soft/50 p-4 text-sm text-ink">
          <Icon.Shield className="mr-1.5 inline h-4 w-4 -translate-y-px text-warning" />
          These are illustrative examples, not real client cases. A diagnosis for your organisation
          is prepared by a person after reviewing your actual submission.
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-h3 font-bold text-ink">Ready to describe your own challenge?</h2>
            <p className="mt-1 text-ink-soft">Free initial diagnosis. Response within 24 hours.</p>
          </div>
          <ButtonLink href="/submit" size="lg" className="w-full shrink-0 sm:w-auto">
            Describe my challenge <Icon.Arrow className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
