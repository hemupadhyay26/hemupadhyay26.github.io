import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './ImageReveal.css'

interface ImageRevealProps {
  baseSrc: string
  overlaySrc: string
  alt: string
  overlayAlt: string
  radius?: number
  softness?: number
  smoothing?: number
  outline?: boolean
  className?: string
  style?: CSSProperties
}

/** Layered artwork. The parent is the pointer surface, so links remain usable. */
export function ImageReveal({
  baseSrc, overlaySrc, alt, overlayAlt,
  radius = 240, softness = 160, smoothing = 0.075, outline = false,
  className = '', style,
}: ImageRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const surface = root?.parentElement
    if (!root || !surface || !available) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const masking = CSS.supports('mask-image', 'radial-gradient(black, transparent)')
      || CSS.supports('-webkit-mask-image', 'radial-gradient(black, transparent)')
    let frame = 0
    let last = 0
    let initialized = false
    let x = 0, y = 0, r = 0
    let tx = 0, ty = 0, tr = 0
    const size = () => Math.min(radius, surface.clientWidth * 0.34)
    const draw = () => {
      root.style.setProperty('--reveal-x', x + 'px')
      root.style.setProperty('--reveal-y', y + 'px')
      root.style.setProperty('--reveal-radius', r + 'px')
      root.style.setProperty('--reveal-inner', Math.max(0, r - softness) + 'px')
      root.style.setProperty('--reveal-visible', r > 0.5 ? '1' : '0')
    }
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60
      last = now
      const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-dt / Math.max(.01, smoothing))
      x += (tx - x) * blend
      y += (ty - y) * blend
      r += (tr - r) * blend
      draw()
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(tr - r) > .1) {
        frame = requestAnimationFrame(tick)
      } else { frame = 0; last = 0 }
    }
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick) }
    const move = (event: PointerEvent) => {
      if (reducedMotion.matches || !masking) return
      if ((event.target as Element).closest('a, button, input')) { tr = 0; wake(); return }
      const rect = surface.getBoundingClientRect()
      tx = event.clientX - rect.left
      ty = event.clientY - rect.top
      if (!initialized) { x = tx; y = ty; initialized = true }
      tr = size()
      wake()
    }
    const leave = () => { tr = 0; wake() }
    const release = (event: PointerEvent) => { if (event.pointerType !== 'mouse') leave() }
    const reset = () => {
      initialized = false
      tx = surface.clientWidth / 2
      ty = Math.min(surface.clientHeight * .35, 300)
      x = tx; y = ty; r = 0
      tr = 0
      wake()
    }
    reset()
    const observer = new ResizeObserver(reset)
    observer.observe(surface)
    surface.addEventListener('pointerenter', move)
    surface.addEventListener('pointermove', move)
    surface.addEventListener('pointerdown', move)
    surface.addEventListener('pointerleave', leave)
    surface.addEventListener('pointercancel', leave)
    surface.addEventListener('pointerup', release)
    reducedMotion.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      surface.removeEventListener('pointerenter', move)
      surface.removeEventListener('pointermove', move)
      surface.removeEventListener('pointerdown', move)
      surface.removeEventListener('pointerleave', leave)
      surface.removeEventListener('pointercancel', leave)
      surface.removeEventListener('pointerup', release)
      reducedMotion.removeEventListener('change', reset)
    }
  }, [available, radius, softness, smoothing])

  return (
    <>
      <div ref={rootRef} className={`image-reveal ${className}`} style={style}>
        <div className="image-reveal-layer image-reveal-base" role="img" aria-label={alt} style={{ backgroundImage: `url("${baseSrc}")` }} />
        <div className="image-reveal-layer image-reveal-overlay" role="img" aria-label={overlayAlt} style={{ backgroundImage: `url("${overlaySrc}")` }} />
        <img className="image-reveal-preload" src={overlaySrc} alt="" onLoad={() => setAvailable(true)} />
        {outline && <div className="image-reveal-ring" aria-hidden="true" />}
      </div>
    </>
  )
}
