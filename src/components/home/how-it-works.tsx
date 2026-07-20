import { Section, SectionHeading } from "@/components/ui/section";
import type { SiteContent } from "@/lib/content";

export function HowItWorks({ content }: { content: SiteContent["howItWorks"] }) {
  return (
    <Section id="how">
      <SectionHeading title={content.heading} />
      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.steps.map((step, i) => (
          <li key={step.title} className="relative">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl font-semibold text-primary/25">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <h3 className="mt-3 text-[1.05rem] font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
