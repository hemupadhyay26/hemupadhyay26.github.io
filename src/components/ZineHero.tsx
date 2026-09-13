import { useEffect, useRef, useState } from 'react'
import { heroPortrait, tracks } from '../data'
import { AnimateIcon } from './animate-ui/icons/icon'
import { Play } from './animate-ui/icons/play'
import { Pause } from './animate-ui/icons/pause'
import { ArrowRight } from './animate-ui/icons/arrow-right'
import { ArrowDown } from './animate-ui/icons/arrow-down'

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
  }, [track.src])

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
    <section className="hero3" id="hero">
      <div className="bg" style={{ backgroundImage: `url(${heroPortrait})` }} />
      <div className="grain" />

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
              AWS INFRASTRUCTURE · AUTOMATION · AGENTS · PIPELINE · MONITORING
            </textPath>
          </text>
          <circle className="dot-c" cx="100" cy="100" r="4" />
        </svg>
      </div>

      <div className={`np np-hero${!isPlaying ? ' paused' : ''}`}>
        <AnimateIcon asChild animateOnHover animateOnTap>
          <button
            className="np-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </AnimateIcon>

        <span className="eq"><i /><i /><i /><i /></span>

        <span className="np-label">
          {isPlaying ? `Now Playing · ${track.title}` : 'Play music'}
        </span>

        {isPlaying && (
          <AnimateIcon asChild animateOnHover animateOnTap>
            <button
              className="np-btn"
              onClick={next}
              aria-label="Next track"
            >
              <ArrowRight size={18} />
            </button>
          </AnimateIcon>
        )}
      </div>

      <div className="bottomline">
        <div className="meta">Driven by curiosity, built on fundamentals</div>
        <p>
          Curious and driven tech enthusiast who loves stepping out of comfort zones, exploring new trends, and solving
          problems with modern, practical solutions—while staying grounded in strong foundational knowledge.
        </p>
        <div className="meta" style={{ textAlign: 'right' }}>
          <AnimateIcon
            className="scroll-hint"
            animateOnView
            animateOnViewOnce={false}
            loop
            animation="default-loop"
            loopDelay={1600}
          >
            Scroll down <ArrowDown size={13} />
          </AnimateIcon>
        </div>
      </div>
    </section>
  )
}
