import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Pluggable storage backend for the app's JSON collections and upload bytes.
 *
 * Two drivers, chosen at runtime:
 *  - "file"  — JSON under `.data/` and uploads under `.data/uploads/`. Used for
 *              local dev and any persistent Node host. Default.
 *  - "blobs" — Netlify Blobs. Used when STORAGE_DRIVER=netlify-blobs (set in the
 *              Netlify project). Serverless functions can't write local disk, so
 *              this is what makes submissions persist on Netlify.
 *
 * Everything else in the codebase talks to db.ts / uploads.ts, which talk to
 * this module — so the driver swap touches nothing else.
 */

type Driver = "file" | "blobs";

const DRIVER: Driver = process.env.STORAGE_DRIVER === "netlify-blobs" ? "blobs" : "file";

const DATA_DIR = process.env.CAP_DATA_DIR
  ? path.resolve(process.env.CAP_DATA_DIR)
  : path.join(process.cwd(), ".data");
const UPLOAD_DIR = process.env.CAP_UPLOAD_DIR
  ? path.resolve(process.env.CAP_UPLOAD_DIR)
  : path.join(DATA_DIR, "uploads");

const DATA_STORE = "kapt-data";
const UPLOAD_STORE = "kapt-uploads";

// ── Netlify Blobs (loaded lazily so the file driver has no dependency) ───────

type BlobStore = {
  get(key: string, opts?: { type?: "text" | "arrayBuffer" }): Promise<string | ArrayBuffer | null>;
  set(key: string, value: string | ArrayBuffer | Uint8Array): Promise<void>;
};

const blobCache = new Map<string, BlobStore>();
async function blobStore(name: string): Promise<BlobStore> {
  const cached = blobCache.get(name);
  if (cached) return cached;
  const { getStore } = await import("@netlify/blobs");
  // Strong consistency so our read-modify-write cycles don't lose updates.
  const store = getStore({ name, consistency: "strong" }) as unknown as BlobStore;
  blobCache.set(name, store);
  return store;
}

// ── JSON collection primitives ───────────────────────────────────────────────

export async function readRaw(name: string): Promise<string | null> {
  if (DRIVER === "blobs") {
    // Fail safe: if Blobs isn't available (e.g. during a build-time prerender),
    // fall back to null so callers use their defaults instead of erroring.
    try {
      const store = await blobStore(DATA_STORE);
      return (await store.get(name, { type: "text" })) as string | null;
    } catch (err) {
      console.warn(`[store] Blobs read failed for "${name}", using default:`, err);
      return null;
    }
  }
  try {
    return await fs.readFile(path.join(DATA_DIR, name), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function writeRaw(name: string, data: string): Promise<void> {
  if (DRIVER === "blobs") {
    const store = await blobStore(DATA_STORE);
    await store.set(name, data);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, name);
  const tmp = `${file}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(tmp, data, "utf8");
  await fs.rename(tmp, file);
}

// ── Upload byte primitives ───────────────────────────────────────────────────

export async function writeBytes(name: string, bytes: Buffer): Promise<void> {
  if (DRIVER === "blobs") {
    const store = await blobStore(UPLOAD_STORE);
    // Copy into a fresh (non-shared) ArrayBuffer to satisfy the Blobs set() type.
    await store.set(name, new Uint8Array(bytes).buffer);
    return;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
}

export async function readBytes(name: string): Promise<Buffer | null> {
  if (DRIVER === "blobs") {
    try {
      const store = await blobStore(UPLOAD_STORE);
      const buf = (await store.get(name, { type: "arrayBuffer" })) as ArrayBuffer | null;
      return buf ? Buffer.from(buf) : null;
    } catch (err) {
      console.warn(`[store] Blobs read failed for upload "${name}":`, err);
      return null;
    }
  }
  try {
    return await fs.readFile(path.join(UPLOAD_DIR, name));
  } catch {
    return null;
  }
}

export const storageDriver = DRIVER;
