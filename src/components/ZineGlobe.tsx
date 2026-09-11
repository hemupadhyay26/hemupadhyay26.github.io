import { useEffect, useRef } from 'react'
import createGlobe, { type COBEOptions } from 'cobe'

type LatLng = [number, number]

// Same centroid as the old flat map — Uttarakhand, India, not a precise address.
const MARKER: LatLng = [30.07, 79.02]

const GLOBE_CONFIG: COBEOptions = {
  width: 600,
  height: 600,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 2.6,
  theta: 0.28,
  dark: 1,
  diffuse: 1.15,
  mapSamples: 14000,
  mapBrightness: 5,
  baseColor: [0.42, 0.4, 0.37],
  markerColor: [0.72, 0.35, 0.22],
  glowColor: [0.16, 0.15, 0.14],
  markers: [{ location: MARKER, size: 0.07 }],
}

/** A slowly spinning, drag-to-rotate globe pinned on Uttarakhand, India — a React Bits-style globe (built on cobe) replacing the old flat map. */
export function ZineGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const dragRotation = useRef(0)
  const phi = useRef(GLOBE_CONFIG.phi ?? 0)
  const width = useRef(0)

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab'
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      dragRotation.current = delta / 200
    }
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) width.current = canvasRef.current.offsetWidth
    }
    window.addEventListener('resize', onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...GLOBE_CONFIG,
      width: width.current * 2,
      height: width.current * 2,
      onRender: (state) => {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (pointerInteracting.current === null && !reduceMotion) phi.current += 0.004
        state.phi = phi.current + dragRotation.current
        state.width = width.current * 2
        state.height = width.current * 2
      },
    })

    const fade = setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = '1'
    }, 40)

    return () => {
      clearTimeout(fade)
      window.removeEventListener('resize', onResize)
      globe.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="globe3-canvas"
      onPointerDown={(e) => {
        pointerInteracting.current = e.clientX - pointerInteractionMovement.current
        updatePointerInteraction(pointerInteracting.current)
      }}
      onPointerUp={() => updatePointerInteraction(null)}
      onPointerOut={() => updatePointerInteraction(null)}
      onMouseMove={(e) => updateMovement(e.clientX)}
      onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      aria-label="Rotating globe marking Uttarakhand, India"
      role="img"
    />
  )
}
