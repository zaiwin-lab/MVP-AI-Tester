"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { clsx } from "@/lib/clsx";

const NAV = [
  { href: "/#services", label: "What we help with" },
  { href: "/#how", label: "How it works" },
  { href: "/#expectations", label: "Our approach" },
  { href: "/demo", label: "See a diagnosis" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b border-border bg-white/85 backdrop-blur-md" : "border-b border-transparent bg-white/0",
      )}
    >
      <div className="container-cap flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/submit" size="sm">
            Describe my challenge
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border text-ink lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <Icon.Plus className="h-5 w-5 rotate-45" /> : <Icon.Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="container-cap flex flex-col py-3" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-[0.95rem] font-medium text-ink-soft hover:bg-surface-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 px-1 pb-2">
              <ButtonLink href="/submit" size="md" className="w-full" onClick={() => setOpen(false)}>
                Describe my challenge
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
