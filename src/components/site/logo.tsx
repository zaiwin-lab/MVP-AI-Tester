import Image from "next/image";
import Link from "next/link";
import { siteMeta } from "@/lib/content";

/**
 * Official KAPT Digital Clinic lockup: the four-colour KAPT mark (the "A" is
 * the KAPT triangle) followed by the "Digital Clinic" wordmark. The mark ships
 * as a high-resolution transparent PNG (1032x247, traced to flat brand colours)
 * so it stays sharp on retina and reads on both the white header and the deep
 * footer band; the wordmark stays live text so it can invert with `tone`.
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const wordmark = tone === "light" ? "text-white" : "text-ink";
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2"
      aria-label={`${siteMeta.brand} home`}
    >
      <Image
        src="/kapt-mark.png"
        alt="KAPT"
        width={1032}
        height={247}
        priority
        className="h-[19px] w-auto sm:h-[21px] transition-transform group-hover:scale-[1.03]"
      />
      <span className={`whitespace-nowrap text-[1.3rem] font-extrabold leading-none tracking-[-0.01em] sm:text-[1.45rem] ${wordmark}`}>
        Digital Clinic
      </span>
    </Link>
  );
}
