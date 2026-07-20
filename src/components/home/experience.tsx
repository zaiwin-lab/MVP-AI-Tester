import { Section, SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

export function Experience({ content }: { content: SiteContent["experience"] }) {
  return (
    <Section id="experience" tone="surface">
      <SectionHeading title={content.heading} sub={content.note} />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item) => (
          <article key={item.challenge} className="flex flex-col rounded-xl border border-border bg-white p-5 shadow-sm">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent-ink">Challenge</p>
            <p className="mt-1.5 text-[0.98rem] font-medium leading-snug text-ink">{item.challenge}</p>

            <div className="my-4 flex items-center gap-2 text-muted">
              <span className="h-px flex-1 bg-border" />
              <Icon.Arrow className="h-4 w-4 rotate-90" />
              <span className="h-px flex-1 bg-border" />
            </div>

            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary-ink">Direction</p>
            <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">{item.direction}</p>

            <p className="mt-4 flex items-start gap-2 border-t border-border pt-3 text-[0.88rem] text-ink-soft">
              <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {item.outcome}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
