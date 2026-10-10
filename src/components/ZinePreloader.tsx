import { useEffect, useState } from 'react'
import logo from '../assets/logo.webp'
import heroPortrait from '../assets/hero-cinematic.webp'

function loadImage(src: string) {
  const image = new Image()
  image.src = src
  return image.decode()
}

/** Wait for the initial visible assets, then lift the loading overlay. */
export function ZinePreloader({ onReady }: { onReady: (ready: boolean) => void }) {
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const root = document.documentElement
    root.classList.add('no-scroll', 'preloading')

    // Portfolio data is bundled with React. Wait for the fonts and visible
    // images, including the CSS hero background; audio loads on demand.
    const images = Array.from(document.images)
      .filter(image => image.loading !== 'lazy' && image.currentSrc !== '')
      .map(image => image.decode())
    Promise.allSettled([
      document.fonts.ready,
      loadImage(heroPortrait),
      loadImage(logo),
      ...images,
    ]).then(() => {
      if (cancelled) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setGone(true)
        root.classList.remove('no-scroll', 'preloading')
        onReady(true)
      } else {
        setLeaving(true)
      }
    })

    return () => {
      cancelled = true
      root.classList.remove('no-scroll', 'preloading')
    }
  }, [onReady])

  const finish = () => {
    setGone(true)
    document.documentElement.classList.remove('no-scroll', 'preloading')
    onReady(true)
  }

  if (gone) return null

  return (
    <div
      className={`preloader${leaving ? ' leaving' : ''}`}
      role="status"
      aria-label="Loading portfolio"
      onTransitionEnd={event => {
        if (leaving && event.target === event.currentTarget && event.propertyName === 'opacity') finish()
      }}
    >
      <div className="preloader-logo"><img src={logo} alt="" /></div>
    </div>
  )
}
