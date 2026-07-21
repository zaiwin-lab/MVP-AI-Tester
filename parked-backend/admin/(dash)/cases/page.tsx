import Link from "next/link";
import type { Metadata } from "next";
import { listCases } from "@/lib/db";
import { STATUS_GROUPS, type CaseRecord } from "@/lib/domain";
import { StatusBadge, PriorityBadge } from "@/components/admin/badges";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "Cases" };

function matches(c: CaseRecord, q: string) {
  if (!q) return true;
  const hay = `${c.reference} ${c.fullName} ${c.organisationName} ${c.challengeTitle} ${c.workEmail}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; group?: string }>;
}) {
  const { q = "", group = "" } = await searchParams;
  const all = await listCases();

  const activeGroup = STATUS_GROUPS.find((g) => g.label === group);
  const filtered = all
    .filter((c) => matches(c, q))
    .filter((c) => (activeGroup ? activeGroup.statuses.includes(c.status) : true));

  const counts = STATUS_GROUPS.map((g) => ({
    label: g.label,
    count: all.filter((c) => g.statuses.includes(c.status)).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold text-ink">Cases</h1>
          <p className="mt-1 text-ink-soft">{all.length} submissions in the pipeline.</p>
        </div>
        <form className="relative w-full sm:w-72">
          <Icon.Chat className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search reference, name, organisation…"
            className="field-input pl-9"
            aria-label="Search cases"
          />
          {group && <input type="hidden" name="group" value={group} />}
        </form>
      </div>

      {/* Pipeline group filter */}
      <div className="flex flex-wrap gap-2">
        <FilterChip href={`/admin/cases${q ? `?q=${encodeURIComponent(q)}` : ""}`} active={!activeGroup} label="All" count={all.length} />
        {counts.map((c) => {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          params.set("group", c.label);
          return <FilterChip key={c.label} href={`/admin/cases?${params}`} active={group === c.label} label={c.label} count={c.count} />;
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="font-medium text-ink">No cases match this view.</p>
          <p className="mt-1 text-sm text-muted">Try clearing the search or choosing a different group.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-wide text-muted md:grid">
            <span>Challenge</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Received</span>
          </div>
          <ul className="divide-y divide-border">
            {filtered.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/cases/${c.id}`}
                  className="grid grid-cols-1 gap-2 px-5 py-3.5 hover:bg-surface/60 md:grid-cols-[1fr_auto_auto_auto] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{c.challengeTitle}</p>
                    <p className="truncate text-sm text-muted">
                      <span className="font-mono">{c.reference}</span> · {c.organisationName} · {c.organisationType}
                      {c.assignedToName ? ` · ${c.assignedToName}` : ""}
                    </p>
                  </div>
                  <div className="md:justify-self-start"><PriorityBadge priority={c.priority} /></div>
                  <div className="md:justify-self-start"><StatusBadge status={c.status} /></div>
                  <span className="text-xs text-muted md:justify-self-end">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FilterChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "border-primary bg-primary text-white" : "border-border bg-white text-ink-soft hover:border-primary hover:text-primary"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-surface-2 text-muted"}`}>{count}</span>
    </Link>
  );
}
