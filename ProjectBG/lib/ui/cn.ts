/**
 * Minimal className joiner. Filters out falsey values so components can write
 * conditional classes inline without a runtime dependency.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
