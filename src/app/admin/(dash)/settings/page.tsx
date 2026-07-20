import type { Metadata } from "next";
import { listUsers } from "@/lib/db";
import { siteMeta } from "@/lib/content";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "Settings" };

function Status({ ok, on, off }: { ok: boolean; on: string; off: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${ok ? "bg-success-soft text-success" : "bg-surface-2 text-muted"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-success" : "bg-muted"}`} />
      {ok ? on : off}
    </span>
  );
}

export default async function SettingsPage() {
  const users = await listUsers();
  const smtpOn = Boolean(process.env.SMTP_HOST);
  const aiOn = Boolean(process.env.ANTHROPIC_API_KEY);
  const turnstileOn = Boolean(process.env.TURNSTILE_SECRET_KEY);

  const config = [
    { label: "Email delivery", node: <Status ok={smtpOn} on="SMTP configured" off="Log mode (console)" /> },
    { label: "AI diagnosis assist", node: <Status ok={aiOn} on="Claude API connected" off="Template fallback" /> },
    { label: "Bot protection (Turnstile)", node: <Status ok={turnstileOn} on="Turnstile enabled" off="Honeypot + timing + rate limit" /> },
    { label: "Max upload size", node: <span className="text-sm font-medium text-ink">{process.env.MAX_UPLOAD_MB || 15} MB</span> },
    { label: "Max files per submission", node: <span className="text-sm font-medium text-ink">{process.env.MAX_UPLOAD_FILES || 6}</span> },
    { label: "Response window", node: <span className="text-sm font-medium text-ink">{siteMeta.responseWindow}</span> },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-ink">Settings</h1>
        <p className="mt-1 text-ink-soft">Runtime configuration and team access.</p>
      </div>

      <section className="rounded-xl border border-border bg-white">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Icon.Shield className="h-4 w-4 text-primary" /> Configuration</h2>
        </div>
        <dl className="divide-y divide-border">
          {config.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3">
              <dt className="text-sm text-ink-soft">{row.label}</dt>
              <dd>{row.node}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-border px-5 py-3 text-xs text-muted">
          These are driven by environment variables (see .env.example). No secrets are shown here or
          exposed to the browser.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-white">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Icon.Users className="h-4 w-4 text-primary" /> Team users ({users.length})</h2>
        </div>
        <ul className="divide-y divide-border">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{u.name}</p>
                <p className="text-xs text-muted">{u.email}</p>
              </div>
              <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold capitalize text-primary-ink">{u.role}</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-border px-5 py-3 text-xs text-muted">
          The first admin is seeded from ADMIN_EMAIL / ADMIN_PASSWORD on first run. Role-based access
          and additional team users can be managed here as the workspace grows.
        </p>
      </section>
    </div>
  );
}
