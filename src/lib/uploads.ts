import path from "node:path";
import crypto from "node:crypto";
import type { AttachmentMeta } from "./domain";
import { ALLOWED_UPLOAD_EXTENSIONS, ALLOWED_UPLOAD_TYPES } from "./validation";
import { readBytes, writeBytes } from "./store";

/**
 * Secure-by-default storage for supporting uploads.
 *
 * Files are stored (local disk or Netlify Blobs, via store.ts) with generated,
 * non-guessable names and served back only through an authenticated admin
 * route — never from a public directory. Validation covers extension, MIME
 * type, and size. `scanPlaceholder` marks the integration point for malware
 * scanning before a file is trusted.
 */

export function maxUploadBytes(): number {
  return (Number(process.env.MAX_UPLOAD_MB) || 15) * 1024 * 1024;
}

export function maxUploadFiles(): number {
  return Number(process.env.MAX_UPLOAD_FILES) || 6;
}

export interface UploadOutcome {
  ok: boolean;
  error?: string;
  meta?: AttachmentMeta;
}

function extAllowed(name: string): boolean {
  const ext = path.extname(name).toLowerCase();
  return ALLOWED_UPLOAD_EXTENSIONS.includes(ext);
}

/** Placeholder for malware scanning. Wire an AV/CDR service here in production. */
async function scanPlaceholder(_buffer: Buffer): Promise<{ clean: boolean; reason?: string }> {
  return { clean: true };
}

export async function saveUpload(file: File): Promise<UploadOutcome> {
  if (file.size === 0) return { ok: false, error: `${file.name} is empty.` };
  if (file.size > maxUploadBytes()) {
    return { ok: false, error: `${file.name} exceeds the ${process.env.MAX_UPLOAD_MB || 15}MB limit.` };
  }
  if (!extAllowed(file.name) || !ALLOWED_UPLOAD_TYPES[file.type]) {
    return { ok: false, error: `${file.name} is not an accepted file type.` };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const scan = await scanPlaceholder(buffer);
  if (!scan.clean) return { ok: false, error: `${file.name} failed a safety check.` };

  const ext = path.extname(file.name).toLowerCase();
  const storedName = `${crypto.randomBytes(16).toString("hex")}${ext}`;
  await writeBytes(storedName, buffer);

  return {
    ok: true,
    meta: {
      id: crypto.randomBytes(8).toString("hex"),
      originalName: file.name.slice(0, 180),
      storedName,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    },
  };
}

/** Read a stored file for authenticated download. Guards against name tampering. */
export async function readUpload(storedName: string): Promise<Buffer | null> {
  if (!/^[a-f0-9]{32}\.[a-z0-9]+$/i.test(storedName)) return null;
  return readBytes(storedName);
}
