import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { readUpload } from "@/lib/uploads";

export const runtime = "nodejs";

/**
 * Authenticated attachment download. Files are stored outside any public
 * directory and only served here, after an auth check and confirming the file
 * actually belongs to a case (so stored names can't be probed).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ storedName: string }> }) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorised", { status: 401 });

  const { storedName } = await params;

  // Confirm the file is referenced by a real case before serving it.
  const { listCases } = await import("@/lib/db");
  const cases = await listCases();
  const owner = cases.find((c) => c.attachments.some((a) => a.storedName === storedName));
  if (!owner) return new NextResponse("Not found", { status: 404 });
  const meta = owner.attachments.find((a) => a.storedName === storedName)!;

  const buffer = await readUpload(storedName);
  if (!buffer) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": meta.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${meta.originalName.replace(/"/g, "")}"`,
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, no-store",
    },
  });
}
