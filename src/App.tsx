import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import type { AudioCommand } from './types'
import { myWork, experienceCards, education, floatingTags, emailAddress, terminalCommands } from './data'
import { fadeLeft, fadeIn, staggerContainer } from './lib/animations'
import AudioDock from './components/AudioDock'
import { SiteHeader } from './components/SiteHeader'
import { HeroSection } from './components/HeroSection'
import { ExperienceCard } from './components/ExperienceCard'
import { EducationCard } from './components/EducationCard'
import { SkillCloud } from './components/SkillCloud'
import { WorkBento } from './components/WorkBento'
import { TerminalPage } from './components/TerminalPage'
import { ArrowUpRight } from 'lucide-react'
import { SocialSidebar } from './components/SocialSidebar'
import { SiteFooter } from './components/SiteFooter'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAudioDockVisible, setIsAudioDockVisible] = useState(false)
  const [audioCommand, setAudioCommand] = useState<AudioCommand | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [copiedSource, setCopiedSource] = useState<'hero' | 'footer' | null>(null)
  const [view, setView] = useState<'home' | 'terminal'>(() =>
    window.location.hash === '#terminal' ? 'terminal' : 'home'
  )

  const footerRef = useRef<HTMLElement>(null)
  const footerInView = useInView(footerRef, { margin: '0px' })

  useEffect(() => {
    const handler = () =>
      setView(window.location.hash === '#terminal' ? 'terminal' : 'home')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const handleBackToHome = () => {
    // Use pushState to clear the hash without firing hashchange or triggering
    // the browser's native anchor-scroll (which races with scrollTo and wins).
    window.history.pushState(null, '', window.location.pathname)
    // flushSync forces React to commit the DOM update synchronously before
    // scrollTo fires — without it, scrollTo runs before home becomes visible
    // and the page lands at the bottom after layout reflow.
    flushSync(() => setView('home'))
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleEmailCopy = async (source: 'hero' | 'footer') => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopiedSource(source)
      setTimeout(() => setCopiedSource(null), 2000)
    } catch (error) {
      console.error('Copy failed', error)
    }
  }

  const toggleAudioDockVisibility = () =>
    setIsAudioDockVisible((prev) => {
      const nextVisible = !prev
      setAudioCommand({ id: Date.now(), action: nextVisible ? 'play' : 'pause' })
      return nextVisible
    })

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-light)]">
      <SiteHeader
        isMenuOpen={isMenuOpen}
        isAudioPlaying={isAudioPlaying}
        isAudioDockVisible={isAudioDockVisible}
        onMenuToggle={() => setIsMenuOpen((prev) => !prev)}
        onAudioToggle={toggleAudioDockVisibility}
      />

      {/*
       * Home is always mounted — never unmounted.
       * Hiding with display:none instead of AnimatePresence unmount prevents
       * whileInView animations from re-firing all at once when returning from
       * the terminal view (the "loading lag" bug).
       */}
      <div style={{ display: view === 'home' ? 'block' : 'none' }}>
        <main className="mx-auto max-w-5xl space-y-16 px-6 py-12">
          <HeroSection copiedSource={copiedSource} onEmailCopy={handleEmailCopy} />

          {/* Work section */}
          <section id="work" className="space-y-6">
            <motion.div
              className="flex items-center justify-between"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
            >
              <h3 className="text-lg font-semibold text-[var(--text-light)]">Some of my work</h3>
              <a
                href="https://github.com/hemupadhyay26"
                target="_blank"
                className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-light)]"
              >
                View all <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
            <WorkBento projects={myWork} />
          </section>

          {/* Experience section */}
          <section id="experience" className="space-y-6">
            <motion.h3
              className="text-lg font-semibold text-[var(--text-light)]"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
            >
              Experience
            </motion.h3>

            {/* Timeline track */}
            <div className="relative">
              {/* Vertical line — fades out toward the bottom */}
              <div className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-[var(--accent)] via-[var(--border-light)] to-transparent" />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                {experienceCards.map((exp) => {
                  const isPresent = exp.period.toUpperCase().includes('PRESENT')
                  return (
                    <motion.div
                      key={`${exp.company}-${exp.period}`}
                      variants={fadeLeft}
                      className="relative pl-8 pb-10 last:pb-0"
                    >
                      {/* Timeline dot — filled + glowing for current role */}
                      <div
                        className={`absolute left-0 top-1.5 z-10 h-[15px] w-[15px] rounded-full border-2 transition-shadow ${
                          isPresent
                            ? 'border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_0_4px_var(--accent-soft)]'
                            : 'border-[var(--border-light)] bg-[var(--surface)]'
                        }`}
                      />
                      <ExperienceCard {...exp} />
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </section>

          {/* Education section */}
          <section className="space-y-6">
            <motion.h3
              className="text-lg font-semibold text-[var(--text-light)]"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
            >
              Education
            </motion.h3>

            {/* Timeline track */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-[var(--highlight-1)] to-transparent" />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                {education.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={fadeLeft}
                    className="relative pl-8 pb-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 z-10 h-[15px] w-[15px] rounded-full border-2 border-[var(--highlight-1)] bg-[var(--surface)]" />
                    <EducationCard {...item} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <SkillCloud tags={floatingTags} />
        </main>
      </div>

      {/* Terminal — conditionally rendered so it fades in/out cleanly */}
      <AnimatePresence>
        {view === 'terminal' && (
          <motion.div key="terminal" variants={fadeIn} initial="hidden" animate="visible" exit="hidden">
            <TerminalPage commands={terminalCommands} onBack={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter ref={footerRef} />

      <SocialSidebar footerInView={footerInView} />

      <AudioDock
        isVisible={isAudioDockVisible}
        command={audioCommand}
        onPlayingChange={(playing) => setIsAudioPlaying(playing)}
      />
    </div>
  )
}

export default App
