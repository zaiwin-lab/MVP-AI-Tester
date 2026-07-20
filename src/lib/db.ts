import crypto from "node:crypto";
import type {
  AuditLogEntry,
  CaseRecord,
  UserRecord,
} from "./domain";
import { readRaw, writeRaw } from "./store";

/**
 * Collection-level persistence for V1.
 *
 * Access goes through this module only. The actual bytes live behind
 * `store.ts` (local files, or Netlify Blobs when deployed serverless), so
 * swapping storage — or later moving to Prisma + Postgres/Supabase per
 * `prisma/schema.prisma` — does not touch any call site.
 *
 * Writes are serialised through a per-collection promise chain. Suitable for a
 * single-node MVP / low-traffic gateway, not high-concurrency production.
 */

type Shape = {
  cases: CaseRecord[];
  users: UserRecord[];
  audit: AuditLogEntry[];
  settings: Record<string, unknown>;
  content: Record<string, unknown>;
  counters: Record<string, number>;
};

const FILES: Record<keyof Shape, string> = {
  cases: "cases.json",
  users: "users.json",
  audit: "audit.json",
  settings: "settings.json",
  content: "content.json",
  counters: "counters.json",
};

const DEFAULTS: Shape = {
  cases: [],
  users: [],
  audit: [],
  settings: {},
  content: {},
  counters: {},
};

const writeChains = new Map<string, Promise<unknown>>();

async function readCollection<K extends keyof Shape>(key: K): Promise<Shape[K]> {
  const raw = await readRaw(FILES[key]);
  if (raw === null) return structuredClone(DEFAULTS[key]);
  try {
    return JSON.parse(raw) as Shape[K];
  } catch {
    return structuredClone(DEFAULTS[key]);
  }
}

/** Serialised read-modify-write against a single collection. */
function mutate<K extends keyof Shape, R>(
  key: K,
  fn: (current: Shape[K]) => { next: Shape[K]; result: R } | Promise<{ next: Shape[K]; result: R }>,
): Promise<R> {
  const prev = writeChains.get(FILES[key]) ?? Promise.resolve();
  const run = prev.then(async () => {
    const current = await readCollection(key);
    const { next, result } = await fn(current);
    await writeRaw(FILES[key], JSON.stringify(next, null, 2));
    return result;
  });
  // Keep the chain alive even if this op throws, so later writes still run.
  writeChains.set(
    FILES[key],
    run.then(
      () => undefined,
      () => undefined,
    ),
  );
  return run;
}

export function newId(prefix = ""): string {
  return `${prefix}${crypto.randomBytes(9).toString("base64url")}`;
}

// ── Cases ───────────────────────────────────────────────────────────────────

export async function listCases(): Promise<CaseRecord[]> {
  const cases = await readCollection("cases");
  return [...cases].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCase(id: string): Promise<CaseRecord | null> {
  const cases = await readCollection("cases");
  return cases.find((c) => c.id === id) ?? null;
}

export async function getCaseByReference(reference: string): Promise<CaseRecord | null> {
  const cases = await readCollection("cases");
  return cases.find((c) => c.reference.toLowerCase() === reference.toLowerCase()) ?? null;
}

export async function insertCase(record: CaseRecord): Promise<CaseRecord> {
  return mutate("cases", (cases) => ({ next: [...cases, record], result: record }));
}

export async function updateCase(
  id: string,
  patch: (c: CaseRecord) => CaseRecord,
): Promise<CaseRecord | null> {
  return mutate("cases", (cases) => {
    const idx = cases.findIndex((c) => c.id === id);
    if (idx === -1) return { next: cases, result: null };
    const updated = { ...patch(cases[idx]), updatedAt: new Date().toISOString() };
    const next = [...cases];
    next[idx] = updated;
    return { next, result: updated };
  });
}

/** Atomically allocate the next per-year reference number, e.g. KAPT-2026-0007. */
export async function nextReference(): Promise<string> {
  const year = new Date().getFullYear();
  const key = `ref-${year}`;
  const seq = await mutate("counters", (counters) => {
    const value = (counters[key] ?? 0) + 1;
    return { next: { ...counters, [key]: value }, result: value };
  });
  return `KAPT-${year}-${String(seq).padStart(4, "0")}`;
}

// ── Users ───────────────────────────────────────────────────────────────────

export async function listUsers(): Promise<UserRecord[]> {
  return readCollection("users");
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const users = await readCollection("users");
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUser(id: string): Promise<UserRecord | null> {
  const users = await readCollection("users");
  return users.find((u) => u.id === id) ?? null;
}

export async function insertUser(user: UserRecord): Promise<UserRecord> {
  return mutate("users", (users) => ({ next: [...users, user], result: user }));
}

// ── Audit ───────────────────────────────────────────────────────────────────

export async function appendAudit(entry: Omit<AuditLogEntry, "id" | "at">): Promise<void> {
  const record: AuditLogEntry = { id: newId("aud_"), at: new Date().toISOString(), ...entry };
  await mutate("audit", (audit) => ({ next: [...audit, record].slice(-2000), result: undefined }));
}

export async function listAudit(limit = 200): Promise<AuditLogEntry[]> {
  const audit = await readCollection("audit");
  return [...audit].reverse().slice(0, limit);
}

// ── Settings & content (CMS) ────────────────────────────────────────────────

export async function getSettings(): Promise<Record<string, unknown>> {
  return readCollection("settings");
}

export async function saveSettings(patch: Record<string, unknown>): Promise<Record<string, unknown>> {
  return mutate("settings", (settings) => {
    const next = { ...settings, ...patch };
    return { next, result: next };
  });
}

export async function getContentOverrides(): Promise<Record<string, unknown>> {
  return readCollection("content");
}

export async function saveContentOverrides(
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return mutate("content", (content) => {
    const next = { ...content, ...patch };
    return { next, result: next };
  });
}
