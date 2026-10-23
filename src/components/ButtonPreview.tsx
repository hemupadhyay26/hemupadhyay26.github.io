import { useEffect, useId, useRef } from 'react'
import './ButtonPreview.css'
import { resumeFile } from '../data'
import { SymbioteMorph } from './SymbioteMorph'

/** Temporary design study kept separate from the portfolio sections. */
export function ButtonPreview({ idleGapMs = 10000, highlight = false, compact = false }: { idleGapMs?: number; highlight?: boolean; compact?: boolean }) {
  const liquidId = useId().replace(/:/g, '')
  const sectionRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const extraThreadsRef = useRef<SVGGElement>(null)
  const webRef = useRef<SVGGElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const eyesRef = useRef<SVGSVGElement>(null)



  useEffect(() => {
    const section = sectionRef.current
    const button = buttonRef.current
    const extraThreads = extraThreadsRef.current
    const web = webRef.current
    if (!section || !button || !extraThreads || !web) return
    const pointerSurface = compact ? section.closest<HTMLElement>('header, .hero3') ?? section : section
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let previous = 0
    let targetX = 0, targetY = 0, x = 0, y = 0
    let amount = 0, targetAmount = 0
    let strandCount = 5
    let cx = 0, cy = 0, halfWidth = 0, halfHeight = 0

    let surfaceLeft = 0, surfaceTop = 0
    const paths = extraThreads.querySelectorAll<SVGPathElement>(".symbiote-tendril")
    const bridges = web.querySelectorAll("path")
    const measure = () => {
      const bounds = section.getBoundingClientRect()
      surfaceLeft = bounds.left; surfaceTop = bounds.top
      const rect = button.getBoundingClientRect()
      cx = rect.left - bounds.left + rect.width / 2
      cy = rect.top - bounds.top + rect.height / 2
      halfWidth = rect.width / 2
      halfHeight = rect.height / 2
    }
    const tick = (time: number) => {
      const dt = previous ? Math.min((time - previous) / 1000, .04) : 1 / 60
      previous = time
      const blend = 1 - Math.exp(-dt / .045)
      x += (targetX - x) * blend
      y += (targetY - y) * blend
      amount += (targetAmount - amount) * (1 - Math.exp(-dt / .09))
      const direction = Math.atan2(y - cy, x - cx)
      // A rounded ribbon, with its wide root buried well inside the fluid.
      // Intermediate points form travelling S-curves rather than straight spokes.
      const smoothOutline = (points: { x: number; y: number }[]) => {
        let d = `M ${points[0].x} ${points[0].y}`
        for (let i = 1; i < points.length; i++) {
          const next = points[(i + 1) % points.length]
          const point = points[i]
          d += ` Q ${point.x} ${point.y} ${(point.x + next.x) / 2} ${(point.y + next.y) / 2}`
        }
        return d + ' Z'
      }
      const branches: { points: { x: number; y: number }[]; angle: number }[] = []
      paths.forEach((path, index) => {
        const sheen = path.nextElementSibling as SVGPathElement
        if (index >= strandCount) {
          path.style.opacity = '0'
          sheen.style.opacity = '0'
          return
        }
        const side = index % 2 ? -1 : 1
        const angle = direction + side * (.3 + Math.floor(index / 2) * .45)
        const rootX = cx + Math.cos(angle) * halfWidth * .62
        const rootY = cy + Math.sin(angle) * halfHeight * .48
        const endX = rootX + (x - rootX) * amount
        const endY = rootY + (y - rootY) * amount
        const dx = endX - rootX, dy = endY - rootY
        const distance = Math.max(1, Math.hypot(dx, dy))
        const nx = -dy / distance, ny = dx / distance
        const phase = time / (1000 + index * 93) + index * 2.1
        const amplitude = Math.min(10 + index * 2, distance * .1) * amount
        const centers: { x: number; y: number }[] = []
        const left: { x: number; y: number }[] = []
        const right: { x: number; y: number }[] = []
        const steps = 36
        for (let step = 0; step <= steps; step++) {
          const t = step / steps
          const envelope = Math.sin(Math.PI * t)
          const wave = Math.sin(t * Math.PI * 2.1 - phase) * envelope * amplitude
          const wrap = side * envelope * (15 + index * 6) * amount
          // A hooked tip curls around the pointer instead of ending as a wire.
          const hook = Math.sin(Math.max(0, (t - .65) / .35) * Math.PI * 1.6)
            * Math.max(0, (t - .65) / .35) * 9 * side * amount
          centers.push({
            x: rootX + dx * t + nx * (wave + wrap + hook),
            y: rootY + dy * t + ny * (wave + wrap + hook),
          })
        }
        for (let step = 0; step <= steps; step++) {
          const t = step / steps
          const point = centers[step]
          const before = centers[Math.max(0, step - 1)]
          const after = centers[Math.min(steps, step + 1)]
          const tangentLength = Math.max(.01, Math.hypot(after.x - before.x, after.y - before.y))
          const normalX = -(after.y - before.y) / tangentLength
          const normalY = (after.x - before.x) / tangentLength
          const muscle = 1 + Math.sin(t * 18 - phase) * .1 * Math.sin(Math.PI * t)
          const width = ((17 - index * 1.8) * Math.pow(1 - t, 1.4) + .25) * muscle * amount * (compact ? .65 : 1)
          left.push({ x: point.x + normalX * width, y: point.y + normalY * width })
          right.push({ x: point.x - normalX * width, y: point.y - normalY * width })
        }
        branches.push({ points: centers, angle })
        path.setAttribute('d', smoothOutline([...left, ...right.reverse()]))
        const ridge = centers.slice(6, 32).map((point, i) =>
          `${i === 0 ? 'M' : 'L'} ${point.x - nx * 2} ${point.y - ny * 2}`).join(' ')
        sheen.setAttribute('d', ridge)
        sheen.style.opacity = String(amount * .42)
        path.style.opacity = amount > .01 ? '1' : '0'
      })
      branches.sort((a, b) => a.angle - b.angle)
      bridges.forEach((bridge, index) => {
        const pair = Math.floor(index / 3)
        if (pair >= branches.length - 1 || amount < .01) {
          bridge.style.opacity = '0'
          return
        }
        const level = [9, 17, 25][index % 3]
        const a = branches[pair].points[level]
        const b = branches[pair + 1].points[level + (pair % 2)]
        const length = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y))
        const nx = -(b.y - a.y) / length, ny = (b.x - a.x) / length
        const sag = Math.min(length * .2, 12) * amount
        const mx = (a.x + b.x) / 2 + nx * sag
        const my = (a.y + b.y) / 2 + ny * sag
        const shoulder = (compact ? 2.5 : 4) * amount
        // Wide rooted junctions draw into a fine, bowed membrane in the middle.
        bridge.setAttribute('d',
          `M ${a.x + nx * shoulder} ${a.y + ny * shoulder} Q ${mx} ${my} ${b.x + nx * shoulder} ${b.y + ny * shoulder} L ${b.x - nx * shoulder} ${b.y - ny * shoulder} Q ${mx - nx * 1.2} ${my - ny * 1.2} ${a.x - nx * shoulder} ${a.y - ny * shoulder} Z`)
        bridge.style.opacity = '1'
      })
      if (targetAmount > 0 || amount > .005) {
        frame = requestAnimationFrame(tick)
      } else {
        frame = 0
        previous = 0
      }
    }
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick) }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || motion.matches) return
      targetX = event.clientX - surfaceLeft
      targetY = event.clientY - surfaceTop
      const gapX = Math.max(0, Math.abs(targetX - cx) - halfWidth)
      const gapY = Math.max(0, Math.abs(targetY - cy) - halfHeight)
      const gap = Math.hypot(gapX, gapY)
      const nextAmount = gap > 0 && gap < 150 ? Math.min(1, (150 - gap) / 30) : 0
      if (nextAmount > 0 && targetAmount === 0) {
        // Pick 1–5 strands, always a different count from the previous grab.
        strandCount = 1 + ((strandCount + Math.floor(Math.random() * 4)) % 5)
      }
      targetAmount = nextAmount
      section.dataset.attracted = String(targetAmount > 0)
      if (!frame) { x = targetX; y = targetY }
      wake()
    }
    const leave = () => {
      targetAmount = 0
      section.dataset.attracted = 'false'
      wake()
    }
    measure()
    const geometry = new ResizeObserver(measure)
    geometry.observe(section)
    geometry.observe(button)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    pointerSurface.addEventListener('pointerenter', measure)
    pointerSurface.addEventListener('pointermove', move)
    pointerSurface.addEventListener('pointerleave', leave)
    motion.addEventListener('change', leave)
    return () => {
      cancelAnimationFrame(frame)
      geometry.disconnect()
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      pointerSurface.removeEventListener('pointerenter', measure)
      pointerSurface.removeEventListener('pointermove', move)
      pointerSurface.removeEventListener('pointerleave', leave)
      motion.removeEventListener('change', leave)
    }
  }, [compact, highlight])
  return (
    <section ref={sectionRef} className={`button-preview${highlight ? " button-preview--highlight" : ""}${compact ? " button-preview--nav" : ""}`} aria-label={highlight ? "Highlighted button preview" : "Matte button preview"}>
      {!compact && <div className="button-preview-label">{highlight ? "02 / Subtle highlights" : "01 / Matte · No highlights"}</div>}
      <svg className="symbiote-threads" aria-hidden="true">
        <defs>
          <linearGradient id={`${liquidId}-skin`} x1="0" y1="0" x2=".7" y2="1">
            <stop offset="0" stopColor="#20252d" />
            <stop offset=".28" stopColor="#080a0e" />
            <stop offset=".72" stopColor="#08090b" />
            <stop offset="1" stopColor="#15191f" />
          </linearGradient>
        </defs>
        <g ref={webRef} className="symbiote-web">{Array.from({ length: 12 }, (_, index) => <path key={index} />)}</g>
        <g ref={extraThreadsRef} className="symbiote-extra-threads">
          {Array.from({ length: 5 }, (_, index) => (
            <g key={index}>
              <path className="symbiote-tendril" style={{ fill: highlight ? `url(#${liquidId}-skin)` : "#07080a" }} />
              <path className="symbiote-tendril-sheen" />
            </g>
          ))}
        </g>
      </svg>
      <div className="button-preview-center">
        <div className="symbiote">
          <svg className="symbiote-filter" aria-hidden="true">
            <defs>
              <filter id={liquidId} x="-70%" y="-200%" width="240%" height="500%" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
              </filter>
            </defs>
          </svg>
          <div className="symbiote-liquid" aria-hidden="true" style={{ filter: `url(#${liquidId})` }}>
            <span className="symbiote-body" />
            {Array.from({ length: 8 }, (_, i) => <i key={i} className={`symbiote-drop symbiote-drop-${i}`} />)}
          </div>
          <a ref={buttonRef} className="button-preview-control" href={resumeFile} target="_blank" rel="noopener noreferrer" aria-label="Open resume (PDF)">
            <span ref={wordRef} className="symbiote-word" aria-hidden="true">Resume</span>
            <SymbioteMorph wordRef={wordRef} eyesRef={eyesRef} idleGapMs={idleGapMs} />
            <svg ref={eyesRef} className="symbiote-eyes" viewBox="0 0 160 88" aria-hidden="true">
              <defs>
                <linearGradient id={`${liquidId}-eye-white`} x1="0" y1="0" x2=".4" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset=".55" stopColor="#edf1f2" />
                  <stop offset="1" stopColor="#bfc8d0" />
                </linearGradient>
                <path id={`${liquidId}-eye-shape`} d="M 12 2 L 16 8 L 18 17 L 23 22 L 23 29 L 29 33 L 30 39 L 36 40 L 36 46 L 42 45 L 45 52 L 49 51 L 51 57 L 57 56 L 59 62 L 64 60 L 66 66 L 73 64 L 76 71 Q 70 80 58 80 L 53 78 L 46 80 L 41 77 L 35 77 L 32 73 L 27 73 Q 16 65 12 53 L 10 48 L 10 41 L 8 35 L 9 28 L 8 23 L 10 16 L 10 9 Z" />
                <clipPath id={`${liquidId}-eye-clip`}>
                  <use href={`#${liquidId}-eye-shape`} />
                </clipPath>
                <g id={`${liquidId}-eye-detail`}>
                  <use href={`#${liquidId}-eye-shape`} fill={`url(#${liquidId}-eye-white)`} />
                  <g clipPath={`url(#${liquidId}-eye-clip)`} fill="none" strokeLinecap="round">
                    <path d="M 13 13 Q 12 42 27 60 L 38 68 M 21 30 L 25 48 L 35 56 M 33 46 L 39 62 L 49 68 M 49 59 L 54 72 L 64 74" stroke="#8799a8" strokeOpacity=".28" strokeWidth="1.3" />
                    <path d="M 15 20 Q 16 49 31 62 M 31 49 L 36 59 M 43 59 L 47 67 M 57 68 L 61 73" stroke="#fff" strokeOpacity=".75" strokeWidth="1.5" />
                  </g>
                </g>
              </defs>
              <use href={`#${liquidId}-eye-detail`} />
              <use href={`#${liquidId}-eye-detail`} transform="translate(160 0) scale(-1 1)" />
            </svg>
          </a>
        </div>
      </div>
      {!compact && <p className="button-preview-note">Come closer. It follows you.</p>}
    </section>
  )
}
