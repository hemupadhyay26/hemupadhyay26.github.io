import { motion } from 'framer-motion'
import { socialLinks } from '../data'
import { SocialIcon } from './SocialIcon'

type SocialSidebarProps = {
  footerInView: boolean
}

export function SocialSidebar({ footerInView }: SocialSidebarProps) {
  return (
    <motion.div
      className="fixed bottom-1/3 left-5 z-40 hidden flex-col items-center gap-3 md:flex"
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: footerInView ? 0 : 1,
        x: footerInView ? -20 : 0,
        pointerEvents: footerInView ? 'none' : 'auto',
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {socialLinks.map((link) => (
        <SocialIcon key={link.id} link={link} />
      ))}
      <div className="mt-2 h-16 w-px bg-[var(--border-light)]" />
    </motion.div>
  )
}
