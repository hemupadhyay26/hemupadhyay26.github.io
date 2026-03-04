import { MapPin } from 'lucide-react'
import type { Experience } from '../types'

export function ExperienceCard({ company, role, location, period, bullets }: Experience) {
  return (
    <article className="space-y-3">
      <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-1 text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
            <MapPin className="h-3 w-3" />
            {location}
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-light)]">{company}</p>
          <p className="text-sm text-[var(--text-muted)]">{role}</p>
        </div>
        <p className="shrink-0 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {period}
        </p>
      </div>

      {bullets.length > 0 && (
        <ul className="space-y-2 border-l border-[var(--border-light)] pl-4 text-sm text-[var(--text-muted)]">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </article>
  )
}
