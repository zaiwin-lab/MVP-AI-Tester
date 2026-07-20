import { Section, SectionHeading } from "@/components/ui/section";
import type { SiteContent } from "@/lib/content";

export function Ecosystem({ content }: { content: SiteContent["ecosystem"] }) {
  return (
    <Section id="ecosystem">
      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHeading title={content.heading} />
          <p className="mt-4 max-w-prose text-lead text-ink-soft">{content.body}</p>
          <p className="mt-6 font-serif text-h3 italic text-primary-ink">{content.closing}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Platforms our team may draw on
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {content.tools.map((tool) => (
              <span key={tool} className="chip">
                {tool}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted">
            Not every tool is used on every project. We select responsibly based on the work, its
            data sensitivity, and its governance.
          </p>
        </div>
      </div>
    </Section>
  );
}
