import { isAbsolute, relative } from "node:path";

/**
 * Cross-platform "is `child` the same dir as, or nested under, `parent`?".
 *
 * Replaces ad-hoc `child.startsWith(parent + "/")` checks, which assume a
 * POSIX separator and silently fail on Windows where `path.join` emits
 * backslashes (`C:\a\b` never starts with `C:\a/`). Uses `path.relative`
 * so separator and drive-letter handling are the platform's problem, not
 * ours:
 *   - equal paths            → relative is ""           → inside
 *   - nested child           → relative has no ".."     → inside
 *   - sibling / outside      → relative starts with ".." → not inside
 *   - different Windows drive → relative is absolute      → not inside
 */
export function isInsideDir(child: string, parent: string): boolean {
  if (child === parent) return true;
  const rel = relative(parent, child);
  return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
}
