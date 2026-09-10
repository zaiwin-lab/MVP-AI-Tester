import Link from "next/link";
import { siteMeta } from "@/lib/content";

/**
 * The official KAPT wordmark with "Digital Clinic" set beneath it as a small
 * tracked sub-line. The mark itself is transparent full-colour art, so only
 * the sub-line needs a tone variant for the deep footer band.
 */
export function Logo({
  tone = "dark",
  className = "h-7 sm:h-8",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className="group inline-flex flex-col items-start gap-1 transition-transform hover:scale-[1.03]"
      aria-label={`${siteMeta.brand} home`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/kapt-logo.png" alt="KAPT" className={`${className} w-auto`} />
      <span
        className={`text-[0.62rem] font-semibold uppercase leading-none tracking-[0.2em] sm:text-[0.67rem] ${
          tone === "light" ? "text-white/70" : "text-ink-soft"
        }`}
      >
        Digital Clinic
      </span>
    </Link>
  );
}
