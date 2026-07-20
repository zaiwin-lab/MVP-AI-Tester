import { clsx } from "@/lib/clsx";

export function Section({
  id,
  className,
  children,
  tone = "default",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "surface" | "deep";
}) {
  const tones = {
    default: "",
    surface: "bg-surface",
    deep: "deep-band text-white/80",
  } as const;
  return (
    <section id={id} className={clsx("scroll-mt-20 py-16 sm:py-20", tones[tone], className)}>
      <div className="container-cap">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  sub,
  align = "left",
  tone = "dark",
}: {
  title: string;
  sub?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <h2 className={clsx("text-h2 font-bold", tone === "light" ? "text-white" : "text-ink")}>{title}</h2>
      {sub && (
        <p className={clsx("mt-3 text-lead", tone === "light" ? "text-white/70" : "text-ink-soft")}>{sub}</p>
      )}
    </div>
  );
}
