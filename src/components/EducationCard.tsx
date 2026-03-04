import type { Education } from '../types'

export function EducationCard({ title, period, institution }: Education) {
  return (
    <article className="space-y-1">
      <p className="text-base font-semibold text-[var(--text-light)]">{title}</p>
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">{period}</p>
      <p className="text-sm text-[var(--text-muted)]">{institution}</p>
    </article>
  )
}
