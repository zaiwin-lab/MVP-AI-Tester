import Link from "next/link";
import { siteMeta } from "@/lib/content";

/**
 * The official KAPT wordmark, used on its own — no seal, no typeset lockup.
 * The asset is transparent full-colour art, so it sits correctly on both the
 * light header and the deep footer band without a tone variant.
 */
export function Logo({ className = "h-7 sm:h-8" }: { className?: string }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center transition-transform hover:scale-[1.03]"
      aria-label={`${siteMeta.brand} home`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/kapt-logo.png" alt={siteMeta.brand} className={`${className} w-auto`} />
    </Link>
  );
}
