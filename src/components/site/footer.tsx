import Link from "next/link";
import { Logo } from "./logo";
import { siteMeta } from "@/lib/content";
import { Icon } from "@/components/icons";

const columns = [
  {
    title: "Service",
    links: [
      { href: "/submit", label: "Describe my challenge" },
      { href: "/demo", label: "See a diagnosis" },
      { href: "/#services", label: "What we help with" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Governance",
    links: [
      { href: "/privacy", label: "Privacy notice" },
      { href: "/terms", label: "Terms of submission" },
      { href: "/consent", label: "Data consent" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="deep-band text-white/75">
      <div className="container-cap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            A diagnostic gateway from KAPT, the KOBIS AI Prodigy Team. Bring the challenge, we help
            define the solution.
          </p>
          <p className="mt-5 text-[0.82rem] font-medium text-accent">{siteMeta.motto}</p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/45">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/45">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Icon.Mail className="h-4 w-4 text-white/40" /> {siteMeta.email}
            </li>
            <li className="flex items-center gap-2">
              <Icon.Chat className="h-4 w-4 text-white/40" /> {siteMeta.phone}
            </li>
            <li className="flex items-center gap-2">
              <Icon.Globe className="h-4 w-4 text-white/40" /> {siteMeta.website}
            </li>
          </ul>
          <Link
            href="/submit"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-95"
          >
            Request a consultation <Icon.Arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-cap flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteMeta.parent}. {siteMeta.reference}.
          </p>
          <p className="text-white/40">
            Contact details and logos are editable placeholders. Do not treat any figure as a formal
            quotation.
          </p>
        </div>
      </div>
    </footer>
  );
}
