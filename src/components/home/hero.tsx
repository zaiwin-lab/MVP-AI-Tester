import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

export function Hero({ content }: { content: SiteContent["hero"] }) {
  return (
    <section className="relative overflow-hidden">
      {/* Quiet institutional backdrop: soft top-lit wash, no flashy gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(80%_70%_at_50%_-10%,oklch(0.95_0.02_196/0.9),transparent_70%)]" />
        <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-accent-soft/60 blur-3xl" />
      </div>

      <div className="container-cap pb-6 pt-14 sm:pt-20">
        <p className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 text-[0.78rem] font-semibold text-primary-ink shadow-sm">
          <Icon.Cap className="h-4 w-4" />
          {content.kicker}
        </p>

        <h1 className="reveal mt-6 max-w-4xl text-display font-extrabold text-ink" style={{ animationDelay: "60ms" }}>
          {content.headline}
        </h1>

        <p
          className="reveal mt-6 max-w-2xl font-serif text-lead text-ink-soft"
          style={{ animationDelay: "120ms" }}
        >
          {content.subhead}
        </p>

        <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "180ms" }}>
          <ButtonLink href="#magic" size="lg" className="w-full sm:w-auto">
            {content.primaryCta}
            <Icon.Arrow className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="#services" variant="secondary" size="lg" className="w-full sm:w-auto">
            {content.secondaryCta}
          </ButtonLink>
        </div>

        <p className="reveal mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted" style={{ animationDelay: "240ms" }}>
          <Icon.Check className="h-4 w-4 text-success" />
          {content.trust}
        </p>

        {/* Trust strip: the kinds of organisations served (text, not fake logos) */}
        <div className="reveal mt-12 border-t border-border pt-6" style={{ animationDelay: "300ms" }}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Built for the organisations that serve the public
          </p>
          <div className="no-scrollbar mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            {["Ministries", "Agencies", "Local authorities", "GLCs", "Cooperatives", "Universities", "NGOs", "Associations", "SMEs"].map(
              (o) => (
                <span key={o}>{o}</span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
