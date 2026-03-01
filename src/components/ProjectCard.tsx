import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import type { Project } from '../types'

export function ProjectCard({ title, description, cover, image }: Project) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <article className="space-y-3 rounded-2xl border border-[var(--border-light)] bg-[var(--surface)] p-4">
      <div className="relative h-40 w-full overflow-hidden rounded-xl">
        {!imgLoaded && (
          <Skeleton
            height="100%"
            width="100%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            style={{ display: 'block', lineHeight: 'unset' }}
          />
        )}
        <img
          className={`h-full w-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'absolute inset-0 opacity-0'}`}
          src={image}
          alt={title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">{cover}</p>
      <h4 className="text-lg font-semibold text-[var(--text-light)]">{title}</h4>
      <p className="text-sm text-[var(--text-muted)]">{description}</p>
    </article>
  )
}
