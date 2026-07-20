import { Section, SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

export function Receive({ content }: { content: SiteContent["receive"] }) {
  return (
    <Section id="receive" tone="surface">
      <SectionHeading title={content.heading} />
      <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {content.items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
              <Icon.Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-[0.98rem] text-ink">{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-prose rounded-lg border border-border bg-white p-4 text-sm text-ink-soft">
        <Icon.Shield className="mr-1.5 inline h-4 w-4 -translate-y-px text-primary" />
        {content.note}
      </p>
    </Section>
  );
}
