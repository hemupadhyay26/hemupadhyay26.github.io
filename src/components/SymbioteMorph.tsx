import { useEffect, useRef, type RefObject } from 'react'

type Point = { x: number; y: number }
interface Props {
  wordRef: RefObject<HTMLSpanElement | null>
  eyesRef: RefObject<SVGSVGElement | null>
  idleGapMs: number
}

/** Solid fragments move between rasterized letter and eye silhouettes; no crossfade. */
export function SymbioteMorph({ wordRef, eyesRef, idleGapMs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const word = wordRef.current, eyes = eyesRef.current, canvas = canvasRef.current
    if (!word || !eyes || !canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const width = 170, height = 90
    const ratio = Math.min(devicePixelRatio || 1, 2)
    canvas.width = width * ratio
    canvas.height = height * ratio
    context.scale(ratio, ratio)
    let frame = 0, disposed = false, elapsed = 0, last = 0
    let letters: Point[] = [], eyePoints: Point[] = []
    let lastMode = ''
    let fragments: {
      letter: Point; eye: Point; delay: number; seed: number
      frequency: number; driftX: number; driftY: number; rotation: number
    }[] = []
    const random = (index: number) => {
      const value = Math.sin(index * 127.1 + 311.7) * 43758.5453
      return value - Math.floor(value)
    }
    const sample = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      const mask = document.createElement('canvas')
      mask.width = width; mask.height = height
      const ctx = mask.getContext('2d')!
      ctx.fillStyle = '#fff'
      draw(ctx)
      const pixels = ctx.getImageData(0, 0, width, height).data
      const points: Point[] = []
      for (let y = 0; y < height; y += 1.5) {
        for (let x = 0; x < width; x += 1.5) {
          if (pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] > 100) {
            points.push({ x, y })
          }
        }
      }
      return points
    }
    const prepare = () => {
      const style = getComputedStyle(word)
      letters = sample(ctx => {
        ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText('Resume', width / 2, height / 2 + 1)
      })
      const outline = eyes.querySelector('defs path')?.getAttribute('d')
      eyePoints = sample(ctx => {
        if (!outline) return
        ctx.translate((width - 120) / 2, (height - 66) / 2)
        ctx.scale(.75, .75)
        const path = new Path2D(outline)
        ctx.fill(path)
        ctx.translate(160, 0); ctx.scale(-1, 1)
        ctx.fill(path)
      })
      letters.sort((a, b) => a.x - b.x || a.y - b.y)
      eyePoints.sort((a, b) => a.x - b.x || a.y - b.y)
      const count = Math.min(950, Math.max(letters.length, eyePoints.length))
      fragments = Array.from({ length: count }, (_, i) => ({
        letter: letters[Math.floor(i / count * letters.length)],
        eye: eyePoints[Math.floor(i / count * eyePoints.length)],
        delay: random(i + 300) * .12,
        seed: random(i + 100) * Math.PI * 2,
        frequency: 2 + random(i + 200) * 3,
        driftX: 3 + random(i + 1) * 5,
        driftY: 4 + random(i + 2) * 6,
        rotation: (random(i + 600) - .5) * 7,
      }))
    }
    const ease = (value: number) => value * value * (3 - 2 * value)
    const mix = (a: Point, b: Point, t: number): Point => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    })
    const normal = () => {
      word.style.visibility = 'hidden'
      eyes.style.opacity = '1'
      canvas.style.visibility = 'hidden'
    }
    const tick = (now: number) => {
      if (disposed || reduced.matches) { normal(); return }
      if (last && !document.hidden) elapsed += Math.min(now - last, 50)
      last = now
      const phase = elapsed % (8200 + Math.max(0, idleGapMs))
      const isWord = phase >= 2900 && phase < 5900
      const isEyes = phase < 1200 || phase >= 7800
      const mode = isWord ? 'word' : isEyes ? 'eyes' : 'fragments'
      if (mode !== lastMode) {
        word.style.visibility = isWord ? 'visible' : 'hidden'
        eyes.style.opacity = isEyes ? '1' : '0'
        canvas.style.visibility = mode === 'fragments' ? 'visible' : 'hidden'
        lastMode = mode
      }
      if (!isWord && !isEyes && letters.length && eyePoints.length) {
        const reverse = phase >= 5900
        const t = reverse ? (phase - 5900) / 1900 : (phase - 1200) / 1700
        context.clearRect(0, 0, width, height)
        context.beginPath()
        context.fillStyle = '#eeeae4'
        for (const fragment of fragments) {
          const start = reverse ? fragment.letter : fragment.eye
          const end = reverse ? fragment.eye : fragment.letter
          const delay = fragment.delay
          const progress = Math.min(1, Math.max(0, (t - delay) / (1 - delay)))
          const point = mix(start, end, ease(progress))
          const loose = Math.sin(progress * Math.PI)
          const seed = fragment.seed
          const frequency = fragment.frequency
          const zigzag = (phase: number) => Math.asin(Math.sin(phase)) * 2 / Math.PI
          // Small independent zigzags change direction without hitting a boundary.
          point.x += zigzag(progress * Math.PI * 2 * frequency + seed)
            * loose * fragment.driftX
          point.y += zigzag(progress * Math.PI * 2 * (frequency + .7) + seed * 1.8)
            * loose * fragment.driftY
          const angle = fragment.rotation * loose
          context.moveTo(point.x + 1.3, point.y)
          context.ellipse(point.x, point.y, .8 + loose * .45, .8, angle, 0, Math.PI * 2)
        }
        context.fill()
      }
      frame = requestAnimationFrame(tick)
    }
    const restart = () => {
      cancelAnimationFrame(frame)
      elapsed = 0; last = 0; lastMode = ""
      normal()
      if (!reduced.matches) frame = requestAnimationFrame(tick)
    }
    void document.fonts.ready.then(() => {
      if (disposed) return
      prepare()
      restart()
    })
    reduced.addEventListener('change', restart)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      reduced.removeEventListener('change', restart)
      normal()
    }
  }, [wordRef, eyesRef, idleGapMs])

  return <canvas ref={canvasRef} className="symbiote-forge" aria-hidden="true" />
}
