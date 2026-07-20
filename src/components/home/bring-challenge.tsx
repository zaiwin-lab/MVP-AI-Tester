import { Section } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

export function BringChallenge({ content }: { content: SiteContent["bringChallenge"] }) {
  return (
    <Section id="approach">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <h2 className="max-w-xl text-h2 font-bold text-ink">{content.heading}</h2>
          <p className="mt-4 max-w-prose text-lead text-ink-soft">{content.body}</p>
        </div>

        {/* The path from problem to build — a real sequence, so numbering earns its place */}
        <ol className="relative space-y-3">
          {content.flow.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="text-[1.02rem] font-semibold text-ink">{step}</span>
              {i < content.flow.length - 1 && (
                <Icon.Arrow className="ml-auto h-4 w-4 rotate-90 text-border-strong" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
