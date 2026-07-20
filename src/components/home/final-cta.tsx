import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";
import { siteMeta } from "@/lib/content";

export function FinalCta({ content }: { content: SiteContent["finalCta"] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-cap">
        <div className="deep-band relative overflow-hidden rounded-2xl px-7 py-14 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <h2 className="mx-auto max-w-2xl text-h2 font-bold text-white">{content.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lead text-white/70">{content.body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/submit" variant="accent" size="lg" className="w-full sm:w-auto">
              {content.primaryCta}
              <Icon.Arrow className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/submit?intent=consultation"
              size="lg"
              variant="secondary"
              className="w-full border-white/25 bg-white/5 text-white hover:border-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              {content.secondaryCta}
            </ButtonLink>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-white/55">
            <Icon.Clock className="h-4 w-4" />
            Free initial diagnosis · Response within {siteMeta.responseWindow}
          </p>
        </div>
      </div>
    </section>
  );
}
