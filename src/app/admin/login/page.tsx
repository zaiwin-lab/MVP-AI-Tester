import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser, ensureSeedUser } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Team login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Seed the first admin from env on first ever visit, then bounce if already in.
  await ensureSeedUser();
  const user = await currentUser();
  if (user) redirect("/admin");

  return (
    <div className="grid min-h-dvh place-items-center bg-surface px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-border bg-white p-7 shadow-card">
          <h1 className="text-h3 font-bold text-ink">CAP team sign in</h1>
          <p className="mt-1 text-sm text-ink-soft">Access the case-management workspace.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-muted">
          Authorised users only. Access is logged. Set real credentials via environment
          configuration before deployment.
        </p>
      </div>
    </div>
  );
}
