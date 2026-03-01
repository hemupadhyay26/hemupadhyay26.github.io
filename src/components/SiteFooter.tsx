import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '../lib/animations'
import { socialLinks } from '../data'
import { SocialIcon } from './SocialIcon'

export const SiteFooter = forwardRef<HTMLElement>((_, ref) => {
  return (
    <motion.footer
      ref={ref}
      className="border-t border-[var(--border-light)] bg-[var(--surface)]/80 backdrop-blur-sm"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
    >
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-[var(--text-light)]">Hem Upadhyay</p>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">DevOps Engineer · AI Engineer</p>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <SocialIcon key={link.id} link={link} />
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  )
})

SiteFooter.displayName = 'SiteFooter'
