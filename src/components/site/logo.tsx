import Image from "next/image";
import Link from "next/link";
import { siteMeta } from "@/lib/content";

/**
 * Official KAPT Digital Clinic lockup: the four-colour KAPT mark (the "A" is
 * the KAPT triangle) followed by the "Digital Clinic" wordmark. The mark ships
 * as a transparent PNG so it reads on both the white header and the deep
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
        width={140}
        height={37}
        priority
        className="h-[18px] w-auto transition-transform group-hover:scale-[1.03]"
      />
      <span className={`text-[1.2rem] font-extrabold leading-none tracking-[-0.01em] ${wordmark}`}>
        Digital Clinic
      </span>
    </Link>
  );
}
