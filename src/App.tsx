import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { AudioCommand } from './types'
import { myWork, experienceCards, education, floatingTags, emailAddress } from './data'
import { fadeUp, fadeLeft, fadeIn, staggerContainer } from './lib/animations'
import AudioDock from './components/AudioDock'
import { SiteHeader } from './components/SiteHeader'
import { HeroSection } from './components/HeroSection'
import { ProjectCard } from './components/ProjectCard'
import { ExperienceCard } from './components/ExperienceCard'
import { EducationCard } from './components/EducationCard'
import { SkillCloud } from './components/SkillCloud'
import { SocialSidebar } from './components/SocialSidebar'
import { SiteFooter } from './components/SiteFooter'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAudioDockVisible, setIsAudioDockVisible] = useState(false)
  const [audioCommand, setAudioCommand] = useState<AudioCommand | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [copiedSource, setCopiedSource] = useState<'hero' | 'footer' | null>(null)

  const footerRef = useRef<HTMLElement>(null)
  const footerInView = useInView(footerRef, { margin: '0px' })

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
          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            {myWork.map((project) => (
              <motion.div key={project.title} variants={fadeUp}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Experience section */}
        <section id="experience" className="space-y-8">
          <motion.h3
            className="text-lg font-semibold text-[var(--text-light)]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            Experience
          </motion.h3>
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            {experienceCards.map((exp) => (
              <motion.div key={`${exp.company}-${exp.period}`} variants={fadeLeft}>
                <ExperienceCard {...exp} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Education section */}
        <section className="space-y-8">
          <motion.h3
            className="text-lg font-semibold text-[var(--text-light)]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            Education
          </motion.h3>
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            {education.map((item) => (
              <motion.div key={item.title} variants={fadeLeft}>
                <EducationCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <SkillCloud tags={floatingTags} />
      </main>

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
