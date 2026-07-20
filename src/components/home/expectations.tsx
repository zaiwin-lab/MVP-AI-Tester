import { Section, SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

const marks = [Icon.Shield, Icon.Gauge, Icon.Clock, Icon.Spark];

export function Expectations({ content }: { content: SiteContent["expectations"] }) {
  return (
    <Section id="expectations" tone="deep">
      <SectionHeading title={content.heading} sub={content.intro} tone="light" />
      <div className="mt-11 grid gap-x-8 gap-y-9 sm:grid-cols-2">
        {content.pillars.map((pillar, i) => {
          const Mark = marks[i % marks.length];
          return (
            <div key={pillar.title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10 text-accent ring-1 ring-white/15">
                <Mark className="h-[1.35rem] w-[1.35rem]" />
              </span>
              <div>
                <h3 className="text-[1.08rem] font-semibold text-white">{pillar.title}</h3>
                <p className="mt-1.5 text-[0.94rem] leading-relaxed text-white/70">{pillar.body}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-11 max-w-prose rounded-xl border border-white/12 bg-white/[0.04] p-4 text-[0.9rem] leading-relaxed text-white/65">
        {content.caveat}
      </p>
    </Section>
  );
}
