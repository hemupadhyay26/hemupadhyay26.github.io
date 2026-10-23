import { useEffect, useState } from 'react'
import { ZinePreloader } from './components/ZinePreloader'
import { ButtonPreview } from './components/ButtonPreview'
import { ZineHero } from './components/ZineHero'
import { ZineWorks } from './components/ZineWorks'
import { ZineTerminal } from './components/ZineTerminal'
import { HangingCharacterWidget } from 'swingly/react'
import { ZineMarquee, ZineAbout, ZineNow, ZineStack, ZineExp, ZineContact } from './components/ZineSections'
import { isAvailableForWork } from './data'
import './App.css'

export default function App() {
  const [siteReady, setSiteReady] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [charmAnchor, setCharmAnchor] = useState<HTMLDivElement | null>(null)

  // Chrome scroll state
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reveal-on-scroll observer
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.12 }
    )
    const observe = () => document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    observe()
    const timer = setTimeout(observe, 300)
    return () => { io.disconnect(); clearTimeout(timer) }
  }, [])

  return (
    <>
      <ZinePreloader onReady={setSiteReady} />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`chrome${isScrolled ? ' scrolled' : ''}`}>
        <div className="brand-group">
          <a className="brand" href="#hero">Hem <i>Upadhyay</i></a>
          <span className="status-chip">
            <span className="dot pulse" />
            <span className="chip-label">{isAvailableForWork ? 'Open to work' : 'Currently employed'}</span>
          </span>
        </div>

        <div className="nav-group">
          <nav className="navlinks" aria-label="Main navigation">
            <a href="#work">Work</a>
            <a href="#terminal">Terminal</a>
            <a href="#contact">Contact</a>
          </nav>
          <ButtonPreview compact />
        </div>

        {/* Zero-height strip along the navbar's bottom edge — the charm hangs from here */}
        <div className="charm-anchor" ref={setCharmAnchor} />
        <HangingCharacterWidget
          assets="/characters/nimbu-mirchi/manifest.json"
          corner="top-right"
          threadLength={6}
          mountTarget={charmAnchor}
        />
      </header>

      <main className="stage" id="main" tabIndex={-1}>
        <div className="v3">
          <ZineHero ready={siteReady} />
          <ZineMarquee />
          <ZineAbout />
          <ZineWorks />
          <ZineNow />
          <ZineStack />
          <ZineExp />
          <ZineTerminal />
          <ZineContact />
        </div>
      </main>
    </>
  )
}
