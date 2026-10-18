import { useEffect, useRef, useState } from 'react'
import { resumeFile, tracks } from '../data'
import heroPortrait from '../assets/hero-cinematic.webp'
import cloudPortrait from '../assets/hero-cloud-reveal.webp'
import { ImageReveal } from './ImageReveal'
import { AnimateIcon } from './animate-ui/icons/icon'
import { Play } from './animate-ui/icons/play'
import { Pause } from './animate-ui/icons/pause'
import { ArrowRight } from './animate-ui/icons/arrow-right'

export function ZineHero({ ready }: { ready: boolean }) {
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
    <section className="hero3" id="hero" aria-labelledby="hero-title" data-ready={ready}>
      <ImageReveal baseSrc={heroPortrait} overlaySrc={cloudPortrait} alt="Hem Upadhyay, lit in red against a dark studio background" overlayAlt="The same portrait in a cyan-lit cloud infrastructure environment with server racks and connected deployment paths" />
      <div className="grain" />

      <div className="hero-content">
        <p className="hero-role reveal">DevOps / Cloud Engineer</p>
        <h1 id="hero-title" className="reveal d1" aria-label="Hem Upadhyay">
          <span>Hem</span>{' '}<span className="hero-surname">Upadhyay<span className="hero-period">.</span></span>
        </h1>
        <aside className="hero-intro reveal d2" aria-label="A little about me">
          <p>Curious by nature. Grounded in the fundamentals. I turn complex problems into practical, reliable systems.</p>
        </aside>
        <p className="hero-description reveal d2">
          AWS infrastructure, automated pipelines,<br className="hero-copy-break" /> and systems built to hold up.
        </p>
        <div className="hero-actions reveal d3">
          <a className="hero-work-link" href="#work">Explore work <ArrowRight size={26} aria-hidden="true" /></a>
          <a className="hero-resume-link" href={resumeFile} target="_blank" rel="noopener noreferrer">Resume</a>
        </div>
      </div>

      <div className={`np np-hero${!isPlaying ? ' paused' : ''}`}>
        <div className="hero-waveform" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ animationDelay: `-${i * .13}s`, animationDuration: `${.65 + (i % 5) * .12}s` }} />)}</div>
        <div className="hero-music-details">
          <span className="hero-music-status">{isPlaying ? 'Now playing' : 'On repeat'}</span>
          <span className="hero-music-title">{track.title}</span>
          <span className="hero-music-artist">{track.artist}</span>
        </div>
        <AnimateIcon asChild animateOnHover animateOnTap>
          <button
            className="np-btn"
            onClick={togglePlay}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </AnimateIcon>

        <span className="eq"><i /><i /><i /><i /></span>

        <span className="hero-music-next">
          <AnimateIcon asChild animateOnHover animateOnTap>
            <button
              className="np-btn"
              onClick={next}
              aria-label="Next track"
            >
              <ArrowRight size={18} />
            </button>
          </AnimateIcon>
        </span>
      </div>

    </section>
  )
}
