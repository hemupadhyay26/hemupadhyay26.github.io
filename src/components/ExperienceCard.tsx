import { MapPin } from 'lucide-react'
import type { Experience } from '../types'

export function ExperienceCard({ company, role, location, period, bullets }: Experience) {
  return (
    <article className="rounded-2xl border-l-2 border-[var(--border-light)] bg-transparent p-6">
      <div className="flex flex-col gap-2 pb-4 text-sm text-[var(--text-muted)] md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-1 text-xs uppercase tracking-[0.3em]">
            <MapPin className="h-4 w-4" />
            {location}
          </p>
          <p className="mt-2 text-xl font-semibold text-[var(--text-light)]">{company}</p>
          <p className="text-sm">{role}</p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">{period}</p>
      </div>
      {bullets.length > 0 && (
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-[var(--text-muted)]">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </article>
  )
}
