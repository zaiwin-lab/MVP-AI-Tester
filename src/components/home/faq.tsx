"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

export function Faq({ content }: { content: SiteContent["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  // Keep the landing page light: the seven questions people actually ask first.
  const items = content.items.slice(0, 7);
  return (
    <Section id="faq" tone="surface">
      <SectionHeading title={content.heading} align="center" />
      <div className="mx-auto mt-9 max-w-3xl divide-y divide-border rounded-xl border border-border bg-white">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[0.98rem] font-semibold text-ink">{item.q}</span>
                  <Icon.ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
              </h3>
              <div
                className="grid overflow-hidden transition-all duration-300 ease-out-quart"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="min-h-0">
                  <p className="px-5 pb-5 text-[0.94rem] leading-relaxed text-ink-soft">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
