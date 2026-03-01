import { motion } from 'framer-motion'
import { fadeIn, fadeUp } from '../lib/animations'
import type { FloatingTag } from '../types'

type SkillCloudProps = {
  tags: FloatingTag[]
}

export function SkillCloud({ tags }: SkillCloudProps) {
  return (
    <section className="space-y-6">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
      >
        <h3 className="text-lg font-semibold text-[var(--text-light)]">Skills & Tools</h3>
      </motion.div>
      <motion.div
        className="skill-cloud relative h-[360px] overflow-hidden rounded-3xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
      >
        {tags.map((tag) => (
          <span
            key={tag.label}
            className="floating-chip absolute inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--text-light)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{
              top: tag.top,
              left: tag.left,
              animationDelay: tag.delay,
              animationDuration: tag.duration,
              cursor: 'pointer',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            {tag.label}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
