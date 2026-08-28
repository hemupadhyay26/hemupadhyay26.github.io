/**
 * Minimal `cn` used by the vendored animate-ui components.
 * The zine design leans on hand-written CSS classes rather than Tailwind
 * utilities, so a plain className join is enough here — no clsx / tailwind-merge.
 */
export function cn(...inputs: unknown[]): string {
  return inputs
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .join(' ')
}
