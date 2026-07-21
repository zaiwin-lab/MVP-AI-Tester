"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { clsx } from "@/lib/clsx";

const NAV: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
  { href: "/admin", label: "Overview", icon: "Gauge", exact: true },
  { href: "/admin/cases", label: "Cases", icon: "Kanban" },
  { href: "/admin/content", label: "Content", icon: "Doc" },
  { href: "/admin/settings", label: "Settings", icon: "Shield" },
];

export function AdminNav({ orientation = "sidebar" }: { orientation?: "sidebar" | "bar" }) {
  const pathname = usePathname();
  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  if (orientation === "bar") {
    return (
      <nav className="flex items-center gap-1 lg:hidden" aria-label="Admin sections">
        {NAV.map((item) => {
          const IconEl = Icon[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[0.68rem] font-medium",
                isActive(item) ? "text-primary" : "text-muted",
              )}
            >
              <IconEl className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-1" aria-label="Admin sections">
      {NAV.map((item) => {
        const IconEl = Icon[item.icon];
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-primary text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <IconEl className="h-[1.15rem] w-[1.15rem]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
