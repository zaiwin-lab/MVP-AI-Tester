import Link from "next/link";
import type { Metadata } from "next";
import { getAnalytics } from "@/lib/analytics";
import { StatusBadge, PriorityBadge } from "@/components/admin/badges";
import { Icon, type IconName } from "@/components/icons";

export const metadata: Metadata = { title: "Overview" };

function Stat({ label, value, icon, accent }: { label: string; value: string | number; icon: IconName; accent?: boolean }) {
  const IconEl = Icon[icon];
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-[0.8rem] font-medium text-muted">{label}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${accent ? "bg-accent-soft text-accent-ink" : "bg-primary-soft text-primary"}`}>
          <IconEl className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No data yet.</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {rows.slice(0, 6).map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="truncate text-ink-soft">{r.label}</span>
                <span className="font-semibold text-ink">{r.count}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function OverviewPage() {
  const a = await getAnalytics();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-h2 font-bold text-ink">Overview</h1>
        <p className="mt-1 text-ink-soft">The state of the diagnostic pipeline at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Stat label="Total submissions" value={a.total} icon="Doc" />
        <Stat label="New" value={a.newCases} icon="Plus" />
        <Stat label="Under review" value={a.underReview} icon="Clock" />
        <Stat label="Responses sent" value={a.responsesSent} icon="Mail" />
        <Stat label="Avg response" value={a.avgResponseHours !== null ? `${a.avgResponseHours}h` : "—"} icon="Gauge" />
        <Stat label="High potential" value={a.highPotential} icon="Spark" accent />
        <Stat label="Consultations" value={a.consultationRequests} icon="Chat" />
        <Stat label="Opportunities" value={a.projectOpportunities} icon="Cap" accent />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Breakdown title="By organisation type" rows={a.byOrgType} />
        <Breakdown title="By challenge category" rows={a.byCategory} />
      </div>

      <div className="rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold text-ink">Recent submissions</h2>
          <Link href="/admin/cases" className="text-sm font-medium text-primary hover:underline">
            View all cases
          </Link>
        </div>
        {a.recent.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-ink-soft">No submissions yet.</p>
            <p className="mt-1 text-sm text-muted">New challenges from the public form will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {a.recent.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/cases/${c.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface/60">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{c.challengeTitle}</p>
                    <p className="truncate text-sm text-muted">{c.organisationName} · {c.organisationType}</p>
                  </div>
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                  <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline">{c.reference}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
