"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import type { SiteContent } from "@/lib/content";

export const DRAFT_KEY = "cap.challenge.draft";

export function MagicBox({ content }: { content: SiteContent["magicBox"] }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [showPrompts, setShowPrompts] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Rotate example placeholders while the field is empty and unfocused.
  useEffect(() => {
    if (value) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % content.placeholderExamples.length);
    }, 3200);
    return () => clearInterval(id);
  }, [value, content.placeholderExamples.length]);

  function continueToForm() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DRAFT_KEY, value.trim());
    }
    router.push("/submit");
  }

  return (
    <section id="magic" className="scroll-mt-24">
      <div className="container-cap">
        <div className="relative mx-auto max-w-3xl rounded-2xl border border-border bg-white p-6 shadow-card-lg sm:p-9">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
              <Icon.Chat className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-h3 font-bold text-ink">{content.heading}</h2>
              <p className="mt-1 text-[0.95rem] text-ink-soft">{content.sub}</p>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="challenge" className="sr-only">
              Describe your challenge
            </label>
            <textarea
              id="challenge"
              ref={taRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={6}
              placeholder={content.placeholderExamples[placeholderIdx]}
              className="w-full resize-y rounded-xl border border-border bg-surface/60 p-4 text-[1.02rem] leading-relaxed text-ink shadow-inner transition-colors placeholder:text-muted/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/12"
            />
            <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
              <span>A few honest sentences is enough to begin.</span>
              <span>{value.trim().length > 0 ? `${value.trim().length} characters` : "No wrong way to start"}</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowPrompts((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
              aria-expanded={showPrompts}
            >
              <Icon.ChevronDown className={`h-4 w-4 transition-transform ${showPrompts ? "rotate-180" : ""}`} />
              {content.helperToggle}
            </button>

            {showPrompts && (
              <div className="mt-3 animate-scale-in rounded-xl border border-border bg-surface/70 p-4">
                <p className="text-[0.82rem] font-medium text-ink">Optional prompts, only if they help you:</p>
                <ul className="mt-2.5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {content.helperPrompts.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-ink-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Icon.Lock className="h-3.5 w-3.5" />
              Do not include confidential or classified detail here.
            </p>
            <Button onClick={continueToForm} size="lg" className="w-full sm:w-auto">
              {content.cta}
              <Icon.Arrow className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
