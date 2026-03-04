import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Download, Linkedin } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import { heroPortrait, resumeFile, emailAddress, aboutText, isAvailableForWork } from '../data'
import { CopyEmailButton } from './CopyEmailButton'

type HeroSectionProps = {
  copiedSource: 'hero' | 'footer' | null
  onEmailCopy: (source: 'hero' | 'footer') => void
}

const panelVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function HeroSection({ copiedSource, onEmailCopy }: HeroSectionProps) {
  const [portraitLoaded, setPortraitLoaded] = useState(false)

  return (
    <section
      id="home"
      className="rounded-3xl border border-[var(--border-light)] bg-[var(--surface)] p-8 sm:p-10"
    >
      <motion.div
        className="flex flex-col gap-6 sm:flex-row"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } }}
      >
        {/* Profile card — animates first */}
        <motion.div
          className="flex flex-col items-center gap-4 rounded-2xl bg-[var(--surface-elevated)] p-6 text-center sm:w-64"
          variants={panelVariant}
        >
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-[var(--border-light)] shadow-[0_20px_45px_rgba(2,6,23,0.65)]">
            {!portraitLoaded && (
              <Skeleton
                height="100%"
                width="100%"
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
                style={{ display: 'block', lineHeight: 'unset' }}
              />
            )}
            <img
              src={heroPortrait}
              alt="Hem Upadhyay portrait"
              className={`h-full w-full object-cover transition-opacity duration-300 ${portraitLoaded ? 'opacity-100' : 'absolute inset-0 opacity-0'}`}
              loading="lazy"
              onLoad={() => setPortraitLoaded(true)}
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Hem Upadhyay</h1>
            <p className="text-sm text-[var(--text-muted)]">Devops Engineer | AI enthusiasts</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Uttarakhand, India</p>
          </div>
          {/* Availability badge — driven by isAvailableForWork in src/data/index.ts */}
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-[var(--text-light)] transition-colors duration-300 ${
              isAvailableForWork
                ? 'bg-[var(--status-green-soft)]'
                : 'bg-[var(--accent-soft)]'
            }`}
          >
            <Check
              className={`h-3 w-3 transition-colors duration-300 ${
                isAvailableForWork ? 'text-[var(--status-green)]' : 'text-[var(--accent)]'
              }`}
            />
            {isAvailableForWork ? 'Available for work' : 'Currently employed'}
          </span>
          <a
            href={resumeFile}
            download
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-light)] transition hover:text-[var(--accent)]"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </a>
        </motion.div>

        {/* Text panel — animates second (staggered) */}
        <motion.div className="flex-1 space-y-6" variants={panelVariant}>
          <div className="flex flex-wrap items-center gap-4 border-b border-[var(--border-light)] pb-4 text-sm">
            <CopyEmailButton
              source="hero"
              email={emailAddress}
              copiedSource={copiedSource}
              onCopy={onEmailCopy}
            />
            <span className="text-[var(--text-muted)]">|</span>
            <a
              href="https://www.linkedin.com/in/hem-upadhyay-4460b31b9/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[var(--text-muted)] transition hover:text-[var(--text-light)]"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-light)]">About me</h2>
            <p className="text-sm text-[var(--text-muted)] whitespace-pre-line">{aboutText}</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
