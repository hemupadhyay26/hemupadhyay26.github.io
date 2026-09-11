import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.webp'

/**
 * Blurred glass overlay shown while the page settles in.
 * A zoom-pulsing logo mark sits centered over a blurred
 * view of the site rendering behind it. Once ready, it fades
 * out and the blur lifts, merging into the real page.
 */
export function ZinePreloader() {
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (gone) return

    if (reduceMotion.current) {
      const t = setTimeout(() => {
        setLeaving(true)
        setTimeout(() => setGone(true), 50)
      }, 0)
      return () => clearTimeout(t)
    }

    // Freeze the page's own continuous animations (spin badge, marquee,
    // custom cursor) while the blurred overlay is up — otherwise the
    // browser has to recompute the backdrop blur every frame against a
    // constantly-changing background, which is what causes the jank.
    document.documentElement.classList.add('no-scroll', 'preloading')

    let cancelled = false
    // Hold on screen long enough to be clearly seen, not a flicker,
    // before merging into the site.
    const minDelay = new Promise<void>(res => setTimeout(res, 5000))
    const fontsReady = document.fonts?.ready ?? Promise.resolve()

    Promise.all([minDelay, fontsReady]).then(() => {
      if (!cancelled) setLeaving(true)
    })

    return () => { cancelled = true }
  }, [gone])

  useEffect(() => {
    if (!leaving || reduceMotion.current) return
    const t = setTimeout(() => setGone(true), 700)
    return () => clearTimeout(t)
  }, [leaving])

  useEffect(() => {
    if (gone) document.documentElement.classList.remove('no-scroll', 'preloading')
  }, [gone])

  if (gone) return null

  return (
    <div className={`preloader${leaving ? ' leaving' : ''}`} aria-hidden={leaving}>
      <div className="preloader-logo">
        <img src={logo} alt="" />
      </div>
    </div>
  )
}
