import { useEffect, useRef, useState } from 'react'
import { resumeFile, tracks } from '../data'
import heroPortrait from '../assets/hero-cinematic.webp'
import { AnimateIcon } from './animate-ui/icons/icon'
import { Play } from './animate-ui/icons/play'
import { Pause } from './animate-ui/icons/pause'
import { ArrowRight } from './animate-ui/icons/arrow-right'

const heroName = 'Hem Upadhyay'
const decodeSymbols = '#%*+?<>/\\{}[]~'

export function ZineHero({ ready }: { ready: boolean }) {
  const [decodedName, setDecodedName] = useState(heroName)
  const [trackIdx, setTrackIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const track = tracks[trackIdx]

  useEffect(() => {
    if (!ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame: number
    let started: number | undefined
    let lastUpdate = -Infinity
    const decode = (now: number) => {
      started ??= now
      const progress = Math.min((now - started) / 1400, 1)
      if (now - lastUpdate >= 55 || progress === 1) {
        lastUpdate = now
        const resolved = Math.floor(progress * heroName.length)
        setDecodedName(Array.from(heroName, (letter, index) =>
          letter === ' ' || index < resolved ? letter : decodeSymbols[Math.floor(Math.random() * decodeSymbols.length)]
        ).join(''))
      }
      if (progress < 1) frame = requestAnimationFrame(decode)
    }
    frame = requestAnimationFrame(decode)
    return () => cancelAnimationFrame(frame)
  }, [ready])

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
      <div className="bg" aria-hidden="true" style={{ backgroundImage: `url(${heroPortrait})` }} />
      <div className="hero-smoke" aria-hidden="true"><i /><i /></div>
      <div className="grain" />

      <div className="hero-content">
        <p className="hero-role reveal">DevOps / Cloud Engineer</p>
        <h1 id="hero-title" className="reveal d1" aria-label="Hem Upadhyay">
          <span className="hero-name-word" aria-hidden="true"><span className="hero-name-measure">Hem</span><span className="hero-name-decoded">{decodedName.slice(0, 3)}</span></span>{' '}
          <span className="hero-name-word" aria-hidden="true"><span className="hero-name-measure">Upadhyay<span className="hero-period">.</span></span><span className="hero-name-decoded">{decodedName.slice(4)}<span className="hero-period">.</span></span></span>
        </h1>
        <aside className="hero-intro reveal d2" aria-label="A little about me">
          <p>Curious and driven tech enthusiast who loves stepping out of comfort zones, exploring new trends, and solving problems with modern, practical solutions—while staying grounded in strong foundational knowledge.</p>
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
        <img className="hero-music-cover" src={heroPortrait} alt="" />
        <div className="hero-music-details">
          <span className="hero-music-status">{isPlaying ? 'Now playing' : 'On repeat'}</span>
          <span className="hero-music-title">{track.title}</span>
          <span className="hero-music-artist">{track.artist}</span>
        </div>
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
