import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type {
  AuditLogEntry,
  CaseRecord,
  UserRecord,
} from "./domain";

/**
 * Minimal file-backed persistence for V1.
 *
 * Everything is stored as JSON under `.data/` (git-ignored). Access goes
 * through this module only, so swapping to Prisma + Postgres/Supabase later is
 * a matter of reimplementing these functions against the schema in
 * `prisma/schema.prisma` — call sites do not change.
 *
 * Writes are serialised through a per-file promise chain and use a
 * write-temp-then-rename to avoid torn reads. This is appropriate for a
 * single-node MVP / demo deployment, not high-concurrency production.
 */

const DATA_DIR = process.env.CAP_DATA_DIR
  ? path.resolve(process.env.CAP_DATA_DIR)
  : path.join(process.cwd(), ".data");

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

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readCollection<K extends keyof Shape>(key: K): Promise<Shape[K]> {
  await ensureDir();
  const file = path.join(DATA_DIR, FILES[key]);
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Shape[K];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return structuredClone(DEFAULTS[key]);
    }
    throw err;
  }
}

/** Serialised read-modify-write against a single collection file. */
function mutate<K extends keyof Shape, R>(
  key: K,
  fn: (current: Shape[K]) => { next: Shape[K]; result: R } | Promise<{ next: Shape[K]; result: R }>,
): Promise<R> {
  const prev = writeChains.get(FILES[key]) ?? Promise.resolve();
  const run = prev.then(async () => {
    await ensureDir();
    const current = await readCollection(key);
    const { next, result } = await fn(current);
    const file = path.join(DATA_DIR, FILES[key]);
    const tmp = `${file}.${crypto.randomBytes(6).toString("hex")}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
    await fs.rename(tmp, file);
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

/** Atomically allocate the next per-year reference number, e.g. CAP-2026-0007. */
export async function nextReference(): Promise<string> {
  const year = new Date().getFullYear();
  const key = `ref-${year}`;
  const seq = await mutate("counters", (counters) => {
    const value = (counters[key] ?? 0) + 1;
    return { next: { ...counters, [key]: value }, result: value };
  });
  return `CAP-${year}-${String(seq).padStart(4, "0")}`;
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
