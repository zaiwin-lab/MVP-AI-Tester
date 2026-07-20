import Link from "next/link";
import { siteMeta } from "@/lib/content";

/**
 * Wordmark + seal. The mark is a stylised diagnostic pulse inside a rounded
 * seal — institutional, not a robot. Replace the seal with the official
 * KOBIS / CAP logo asset when available (placeholder by design).
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const title = tone === "light" ? "text-white" : "text-ink";
  const sub = tone === "light" ? "text-white/60" : "text-muted";
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label={`${siteMeta.brand} home`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white shadow-sm ring-1 ring-primary-ink/20 transition-transform group-hover:scale-[1.03]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M3 13h3.5l1.8-5 3 10 2.2-6 1.5 3H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block text-[0.98rem] font-bold tracking-tight ${title}`}>CAP Digital Clinic</span>
        <span className={`block text-[0.68rem] font-medium uppercase tracking-[0.13em] ${sub}`}>by KOBIS Berhad</span>
      </span>
    </Link>
  );
}
