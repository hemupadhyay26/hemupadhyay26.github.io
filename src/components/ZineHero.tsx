import { useEffect, useRef, useState } from 'react'
import { heroPortrait, isAvailableForWork, tracks } from '../data'

export function ZineHero() {
  const [trackIdx, setTrackIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const track = tracks[trackIdx]

  useEffect(() => {
    const audio = new Audio(track.src)
    audio.volume = 0.35
    audioRef.current = audio
    const onEnded = () => setTrackIdx(i => (i + 1) % tracks.length)
    audio.addEventListener('ended', onEnded)
    return () => { audio.pause(); audio.removeEventListener('ended', onEnded) }
  }, [trackIdx])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, trackIdx])

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setTrackIdx(i => (i + 1) % tracks.length)
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(p => !p)
  }

  return (
    <section className="hero3">
      <div className="bg" style={{ backgroundImage: `url(${heroPortrait})` }} />
      <div className="grain" />

      <div className="topline">
        <div>Issue IV · 2026</div>
        <div className="issue">A portfolio zine</div>
        <div>
          <span className="dot pulse" />
          {isAvailableForWork ? 'Open to work' : 'Currently employed'}
        </div>
      </div>

      <div className="title-stack">
        <h1>
          <span className="r1 reveal">Hem</span>
          <span className="r2 reveal d1">Upadhyay,</span>
          <span className="r3 reveal d2">DevOps.</span>
        </h1>
        <svg className="spin" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <path id="circ" d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
          </defs>
          <text>
            <textPath href="#circ">
              AUTOMATION · INFRASTRUCTURE · AGENTS · UPTIME · TERRAFORM ·{' '}
            </textPath>
          </text>
          <circle className="dot-c" cx="100" cy="100" r="4" />
        </svg>
      </div>

      <div className={`np np-hero${!isPlaying ? ' paused' : ''}`}>
        <button className="np-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span className="eq"><i /><i /><i /><i /></span>
        <span className="np-label">
          {isPlaying ? `Now Playing · ${track.title}` : 'Play music'}
        </span>
        {isPlaying && (
          <button className="np-btn" onClick={next} aria-label="Next track">⏭</button>
        )}
      </div>

      <div className="bottomline">
        <div className="meta">An assorted collection</div>
        <p>
          Two years of infrastructure, pipelines, and the agentic bits on top —
          laid out as if someone actually wanted to read a portfolio cover to cover.
        </p>
        <div className="meta" style={{ textAlign: 'right' }}>↓ Scroll down</div>
      </div>
    </section>
  )
}
