import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/sidebar";
import { Logo } from "@/components/site/logo";
import { Icon } from "@/components/icons";
import { logoutAction } from "../actions";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="deep-band hidden flex-col p-4 lg:flex">
        <div className="px-2 py-3">
          <Logo tone="light" />
        </div>
        <div className="mt-4 flex-1">
          <AdminNav />
        </div>
        <div className="rounded-lg bg-white/5 p-3">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-xs capitalize text-white/50">{user.role}</p>
          <form action={logoutAction} className="mt-2">
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white">
              <Icon.Arrow className="h-3.5 w-3.5 rotate-180" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-muted hover:text-ink">
              View public site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{user.email}</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-10">{children}</main>

        {/* Bottom nav (mobile) */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 px-2 py-1 backdrop-blur lg:hidden">
          <div className="flex items-center justify-around">
            <AdminNav orientation="bar" />
            <form action={logoutAction}>
              <button className="flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[0.68rem] font-medium text-muted">
                <Icon.Arrow className="h-5 w-5 rotate-180" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
