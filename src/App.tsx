import { useEffect, useRef, useState } from 'react'
import { ZineHero } from './components/ZineHero'
import { ZineWorks } from './components/ZineWorks'
import { ZineTerminal } from './components/ZineTerminal'
import { ZineMarquee, ZineAbout, ZineNow, ZineStack, ZineExp, ZineContact } from './components/ZineSections'
import './App.css'

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Smooth cursor
  useEffect(() => {
    let cx = 0, cy = 0, tx = 0, ty = 0, raf: number
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      cx += (tx - cx) * 0.22
      cy += (ty - cy) * 0.22
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  // Cursor enlarge on interactive elements
  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const el = cursorRef.current
      if (!el) return
      el.classList.toggle('big', !!(e.target as Element).closest('a, button, .card, .it, .row'))
    }
    document.addEventListener('mouseover', onOver)
    return () => document.removeEventListener('mouseover', onOver)
  }, [])

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
      <div className="cursor" ref={cursorRef} />

      <header className={`chrome${isScrolled ? ' scrolled' : ''}`}>
        <div className="brand">Hem <i>Upadhyay</i></div>
        <nav className="navlinks">
          <a href="#work">Work</a>
          <a href="#now">Now</a>
          <a href="#terminal">Terminal</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="stage">
        <div className="v3">
          <ZineHero />
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
