import { useEffect, useRef, useState } from 'react'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import type { AudioDockProps } from '../types'
import { tracks } from '../data'

const AudioDock = ({ isVisible, command, onPlayingChange }: AudioDockProps) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(isPlaying)

  const handleNext = () => {
    const wasPlaying = isPlayingRef.current
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
    if (wasPlaying) {
      setIsPlaying(true)
    }
  }

  const handlePrev = () => {
    const wasPlaying = isPlayingRef.current
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
    if (wasPlaying) {
      setIsPlaying(true)
    }
  }

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev)
  }

  useEffect(() => {
    audioRef.current = new Audio(tracks[currentTrackIndex].src)
    audioRef.current.volume = 0.35
    audioRef.current.addEventListener('ended', handleNext)
    return () => {
      audioRef.current?.pause()
      audioRef.current?.removeEventListener('ended', handleNext)
    }
  }, [currentTrackIndex])

  useEffect(() => {
    isPlayingRef.current = isPlaying
    onPlayingChange?.(isPlaying)
  }, [isPlaying, onPlayingChange])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrackIndex])

  useEffect(() => {
    if (!command) return
    queueMicrotask(() => {
      if (command.action === 'play') setIsPlaying(true)
      if (command.action === 'pause') setIsPlaying(false)
    })
  }, [command])

  const track = tracks[currentTrackIndex]

  return (
    <div
      className="fixed bottom-6 right-6 hidden md:block"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0,0,0)' : 'translate3d(0,1rem,0)',
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1)',
        willChange: 'opacity, transform',
      }}
    >
      <div className="pointer-events-auto flex w-[320px] items-center gap-4 rounded-3xl border border-[var(--border-light)] bg-[var(--audio-bg)] p-4 backdrop-blur-xl shadow-[0_25px_60px_rgba(5,10,20,0.65)]">
        <div
          className="relative h-16 w-16 rounded-full border border-[var(--border-light)] p-1"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.15), transparent)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[var(--audio-disc-dot)]" />
          </div>
          <div
            className="h-full w-full rounded-full bg-cover bg-center animate-[spin_12s_linear_infinite]"
            style={{ backgroundImage: `url(${track.artwork})` }}
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--text-light)]">{track.title}</p>
          <p className="text-xs text-[var(--text-muted)]">{track.artist}</p>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="rounded-full border border-[var(--border-light)] p-2 text-[var(--text-muted)] transition hover:text-[var(--text-light)]"
              aria-label="Previous track"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={togglePlayback}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--audio-btn-bg)] text-[var(--bg-dark)] shadow-lg transition hover:opacity-90"
              aria-label={isPlaying ? 'Pause track' : 'Play track'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={handleNext}
              className="rounded-full border border-[var(--border-light)] p-2 text-[var(--text-muted)] transition hover:text-[var(--text-light)]"
              aria-label="Next track"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioDock
