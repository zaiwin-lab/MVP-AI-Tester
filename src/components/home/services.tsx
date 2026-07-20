import { Section, SectionHeading } from "@/components/ui/section";
import { Icon, type IconName } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

// Map each service to a distinct mark so the grid reads as a set, not clones.
const ICONS: IconName[] = [
  "Users",
  "Gauge",
  "Calendar",
  "Spark",
  "Doc",
  "Cap",
  "Megaphone",
  "Globe",
  "Kanban",
  "Flow",
  "Prototype",
  "Prototype",
];

export function Services({ content }: { content: SiteContent["services"] }) {
  return (
    <Section id="services" tone="surface">
      <SectionHeading title={content.heading} sub={content.sub} />
      <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item, i) => {
          const IconEl = Icon[ICONS[i % ICONS.length]];
          return (
            <div key={item.title} className="group">
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-white text-primary shadow-sm transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                <IconEl className="h-[1.35rem] w-[1.35rem]" />
              </span>
              <h3 className="mt-3.5 text-[1.02rem] font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
