import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

const legal = [
  { href: "/privacy", label: "Privacy notice" },
  { href: "/terms", label: "Terms of submission" },
  { href: "/consent", label: "Data consent" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Trust({ content }: { content: SiteContent["trust"] }) {
  return (
    <Section id="trust">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
            <Icon.Shield className="h-6 w-6" />
          </span>
          <div className="mt-5">
            <SectionHeading title={content.heading} />
          </div>
          <p className="mt-4 max-w-prose text-ink-soft">
            These principles apply to every submission. They exist so government agencies,
            institutions, and organisations can engage with confidence.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-primary hover:text-primary"
              >
                {l.label}
                <Icon.Arrow className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <ul className="grid gap-3">
          {content.principles.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-lg border border-border bg-white p-4 text-[0.94rem] text-ink shadow-sm">
              <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
