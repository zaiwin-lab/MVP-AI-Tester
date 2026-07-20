import "server-only";
import { defaultContent, type SiteContent } from "./content";
import { getContentOverrides } from "./db";

/**
 * Server-only content loader. Merges admin overrides (from the file-backed
 * `content` collection) on top of the defaults. Kept out of `content.ts` so
 * that client components can import `siteMeta`/`defaultContent` without pulling
 * the node data layer into the browser bundle.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const overrides = (await getContentOverrides()) as Partial<SiteContent>;
    if (!overrides || Object.keys(overrides).length === 0) return defaultContent;
    const merged: Record<string, unknown> = { ...defaultContent };
    for (const [key, value] of Object.entries(overrides)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        merged[key] = { ...((defaultContent as Record<string, unknown>)[key] as object), ...value };
      } else if (value !== undefined) {
        merged[key] = value;
      }
    }
    return merged as SiteContent;
  } catch {
    return defaultContent;
  }
}
