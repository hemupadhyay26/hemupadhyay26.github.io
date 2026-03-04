import { useState } from 'react'
import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import { staggerContainer, fadeUp } from '../lib/animations'
import type { Project } from '../types'
import { ProjectShape, ProjectSize } from '../types'

type Props = { projects: Project[] }

// ─────────────────────────────────────────────────────────
// Grid span lookup  (shape × size → { col, row })
// ─────────────────────────────────────────────────────────
const SPANS: Record<ProjectShape, Record<ProjectSize, { col: number; row: number }>> = {
  horizontal:    { small: { col: 2, row: 1 }, medium: { col: 3, row: 1 }, large: { col: 4, row: 1 } },
  vertical:      { small: { col: 1, row: 2 }, medium: { col: 1, row: 2 }, large: { col: 1, row: 3 } },
  square:        { small: { col: 1, row: 1 }, medium: { col: 2, row: 2 }, large: { col: 2, row: 2 } },
  'main-square': { small: { col: 2, row: 2 }, medium: { col: 2, row: 2 }, large: { col: 2, row: 2 } },
  circle:        { small: { col: 1, row: 1 }, medium: { col: 2, row: 2 }, large: { col: 2, row: 2 } },
  'wide-banner': { small: { col: 4, row: 1 }, medium: { col: 4, row: 1 }, large: { col: 4, row: 2 } },
}

function getSpan(shape: ProjectShape, size: ProjectSize) {
  return SPANS[shape]?.[size] ?? { col: 1, row: 1 }
}

// How much text to surface based on grid area
function contentLevel(col: number, row: number): 'min' | 'mid' | 'full' {
  const area = col * row
  if (area >= 4) return 'full'
  if (area >= 2) return 'mid'
  return 'min'
}

// ─────────────────────────────────────────────────────────
// Single bento card
// All hover effects are pure CSS (GPU-composited transforms +
// CSS-driven repaints) — no JS RAF for non-composited props.
// ─────────────────────────────────────────────────────────
function BentoCard({
  title,
  description,
  cover,
  image,
  url,
  shape = ProjectShape.Square,
  size = ProjectSize.Small,
}: Project) {
  const [loaded, setLoaded] = useState(false)

  const { col, row } = getSpan(shape, size)
  const level    = contentLevel(col, row)
  const isMain   = shape === ProjectShape.MainSquare
  const isCircle = shape === ProjectShape.Circle

  return (
    <motion.div
      variants={fadeUp}
      style={{ gridColumn: `span ${col}`, gridRow: `span ${row}` }}
    >
      {/*
        group/card — all child hover states key off this group.
        transition-[border-color,box-shadow] keeps repaint scoped;
        no layout-triggering properties are transitioned.
      */}
      {/*
        article: border + shadow layer only — no overflow-hidden here.
        Removing overflow-hidden from the article means its GPU layer
        never has to re-clip a scaled child. The clip lives one level down.
      */}
      <article
        className={`
          group/card
          relative h-full w-full overflow-hidden border bg-[var(--surface)]
          transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isCircle ? 'rounded-full' : 'rounded-2xl'}
          ${isMain
            ? 'border-[rgba(76,194,255,0.30)] shadow-[0_0_30px_rgba(76,194,255,0.08)] hover:border-[rgba(76,194,255,0.55)] hover:shadow-[0_0_48px_rgba(76,194,255,0.11)]'
            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(76,194,255,0.40)] hover:shadow-[0_0_48px_rgba(76,194,255,0.11)]'
          }
        `}
        style={{ transform: 'translateZ(0)' }}
      >
        {/*
          Isolated image clip layer.
          overflow-hidden + border-radius live here, promoted to their own
          GPU layer via translateZ(0). The scale animation runs entirely
          within this layer — no cross-layer clip rasterization per frame.
        */}
        <div
          className={`absolute inset-0 overflow-hidden ${isCircle ? 'rounded-full' : 'rounded-2xl'}`}
          style={{ transform: 'translateZ(0)' }}
        >
          {!loaded && (
            <Skeleton
              height="100%"
              width="100%"
              baseColor="var(--skeleton-base)"
              highlightColor="var(--skeleton-highlight)"
              style={{ display: 'block', lineHeight: 'unset', position: 'absolute', inset: 0 }}
            />
          )}

          {/*
            transform and opacity use separate timing:
            - transform: 700ms smooth ease-out (hover zoom)
            - opacity:   250ms quick fade-in (image load)
          */}
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={image}
            alt={title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>

        {/* Gradient overlay */}
        {isCircle ? (
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_35%,rgba(3,7,17,0.85)_100%)]" />
        ) : (
          <>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[var(--bg-dark)]/95 via-[var(--bg-dark)]/25 to-transparent" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[var(--bg-dark)]/35 via-transparent to-transparent" />
          </>
        )}

        {/* Featured badge */}
        {isMain && (
          <div className="absolute right-4 top-4 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Featured
          </div>
        )}

        {/* Text content */}
        {isCircle ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center">
            {level !== 'min' && (
              <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[var(--accent)]">
                {cover}
              </p>
            )}
            <h4 className="text-sm font-semibold leading-tight text-[var(--text-light)]">{title}</h4>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            {level !== 'min' && (
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.4em] text-[var(--accent)]">
                {cover}
              </p>
            )}
            <h4
              className={`
                font-semibold leading-snug text-[var(--text-light)]
                transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover/card:text-white
                ${isMain ? 'text-xl md:text-2xl' : level === 'mid' ? 'text-base' : 'text-sm'}
              `}
            >
              {title}
            </h4>
            {level === 'full' && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Stretched link — covers the whole card, opens url on click */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${title} on GitHub`}
            className={`absolute inset-0 z-10 ${url ? 'cursor-pointer' : ''}`}
          />
        )}

        {/* Bottom accent sweep — scaleX is GPU-composited, origin-left → left-to-right grow */}
        {!isCircle && (
          <div
            className="
              absolute bottom-0 left-0 right-0 h-[2px]
              bg-gradient-to-r from-[var(--accent)] to-[var(--highlight-1)]
              origin-left scale-x-0
              transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover/card:scale-x-100
            "
            style={{ willChange: 'transform' }}
          />
        )}
      </article>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
// Grid
// ─────────────────────────────────────────────────────────
export function WorkBento({ projects }: Props) {
  return (
    <motion.div
      className="bento-grid"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
    >
      {projects.map((p) => (
        <BentoCard key={p.title} {...p} />
      ))}
    </motion.div>
  )
}
