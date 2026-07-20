/** Tiny classnames joiner — avoids a dependency for a one-line utility. */
export function clsx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
