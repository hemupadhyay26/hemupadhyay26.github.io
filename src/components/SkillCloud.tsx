import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeIn } from '../lib/animations'
import type { FloatingTag } from '../types'

type Props = { tags: FloatingTag[] }

function chunk<T>(arr: T[], n: number): T[][] {
  const size = Math.ceil(arr.length / n)
  return Array.from({ length: n }, (_, i) => arr.slice(i * size, (i + 1) * size))
}

export function SkillCloud({ tags }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.1 })
  const rows = chunk(tags, 3)
  const speeds = [22, 28, 18] // each row has its own pace

  return (
    <section ref={ref} className="space-y-6">
      <motion.h3
        className="text-lg font-semibold text-[var(--text-light)]"
        variants={fadeIn}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        Skills & Tools
      </motion.h3>

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-[var(--border-light)] bg-[var(--surface)] py-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        {rows.map((row, rowIdx) => {
          const isReverse = rowIdx % 2 !== 0

          return (
            // group/row — hover on THIS row only pauses THIS row's animation
            <div key={rowIdx} className="overflow-hidden group/row cursor-default">
              <div
                className="flex gap-3 w-max group-hover/row:[animation-play-state:paused]"
                style={{
                  animationName: isReverse ? 'marqueeRight' : 'marqueeLeft',
                  animationDuration: `${speeds[rowIdx]}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  willChange: 'transform',
                }}
              >
                {[...row, ...row].map((tag, i) => (
                  <span
                    key={`${tag.label}-${i}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}
