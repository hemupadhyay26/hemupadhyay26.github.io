import type { Education } from '../types'

export function EducationCard({ title, period, institution }: Education) {
  return (
    <article className="rounded-2xl border-l-2 border-[var(--border-light)] bg-transparent p-4 text-sm text-[var(--text-muted)]">
      <p className="text-base font-semibold text-[var(--text-light)]">{title}</p>
      <p className="text-xs uppercase tracking-[0.3em]">{period}</p>
      <p className="mt-1">{institution}</p>
    </article>
  )
}
