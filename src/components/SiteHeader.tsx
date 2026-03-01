import { motion } from 'framer-motion'
import { Menu, PauseCircle, PlayCircle, X } from 'lucide-react'
import { navLinks } from '../data'
import { NavLink } from './NavLink'

type SiteHeaderProps = {
  isMenuOpen: boolean
  isAudioPlaying: boolean
  isAudioDockVisible: boolean
  onMenuToggle: () => void
  onAudioToggle: () => void
}

export function SiteHeader({
  isMenuOpen,
  isAudioPlaying,
  isAudioDockVisible,
  onMenuToggle,
  onAudioToggle,
}: SiteHeaderProps) {
  return (
    <>
      <motion.header
        className="border-b border-[var(--border-light)] bg-[var(--surface)]"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-5">
          <span className="text-lg font-semibold cursor-pointer">Hem Upadhyay</span>
          <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-[var(--text-muted)] md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.label} link={link} className="transition hover:text-[var(--text-light)]" />
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onAudioToggle}
              className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition md:inline-flex ${
                isAudioPlaying
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--border-light)] text-[var(--text-light)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
              aria-pressed={isAudioDockVisible}
              title="Play song"
            >
              {isAudioPlaying ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              {isAudioPlaying ? 'Pause song' : 'Play song'}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-light)] p-2 text-[var(--text-light)] transition hover:border-[var(--text-light)] md:hidden"
              onClick={onMenuToggle}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {isMenuOpen && (
        <div className="border-b border-[var(--border-light)] bg-[var(--surface)] px-6 py-4 lg:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                link={link}
                className="rounded-md px-2 py-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--text-light)]"
                onClick={onMenuToggle}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
