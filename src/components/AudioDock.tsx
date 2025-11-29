import { useEffect, useRef, useState } from 'react'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import smoothIntro from '../assets/audio/smooth-intro-72591.mp3'
import dooronDooron from '../assets/audio/dooronDooron.mp3'

type Track = {
  title: string
  artist: string
  artwork: string
  src: string
}

const tracks: Track[] = [
  {
    title: 'Neon Cove',
    artist: 'Loftwave',
    artwork:
      'https://images.unsplash.com/photo-1514525253 161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    src: smoothIntro,
  },
  {
    title: 'Dooron Dooron',
    artist: 'Pulkit',
    artwork:
      'https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?auto=format&fit=crop&w=400&q=80',
    src: dooronDooron,
  },
]

type AudioCommand = {
  id: number
  action: 'play' | 'pause'
}

type AudioDockProps = {
  isVisible: boolean
  command?: AudioCommand | null
  onPlayingChange?: (isPlaying: boolean) => void
}

const AudioDock = ({ isVisible, command, onPlayingChange }: AudioDockProps) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(isPlaying)

  useEffect(() => {
    audioRef.current = new Audio(tracks[currentTrackIndex].src)
    audioRef.current.volume = 0.35
    audioRef.current.addEventListener('ended', handleNext)
    return () => {
      audioRef.current?.pause()
      audioRef.current?.removeEventListener('ended', handleNext)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex])

  useEffect(() => {
    isPlayingRef.current = isPlaying
    onPlayingChange?.(isPlaying)
  }, [isPlaying, onPlayingChange])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current
        .play()
        .catch(() => {
          setIsPlaying(false)
        })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrackIndex])

  useEffect(() => {
    if (!command) return
    if (command.action === 'play') {
      setIsPlaying(true)
    } else if (command.action === 'pause') {
      setIsPlaying(false)
    }
  }, [command])

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

  const track = tracks[currentTrackIndex]

  return (
    <div
      className={`fixed bottom-6 right-6 hidden transition-all duration-300 md:block ${
        isVisible ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'
      }`}
    >
      <div className="pointer-events-auto flex w-[320px] items-center gap-4 rounded-3xl border border-white/10 bg-[rgba(5,9,18,0.9)] p-4 backdrop-blur-xl shadow-[0_25px_60px_rgba(5,10,20,0.65)]">
        <div
          className="relative h-16 w-16 rounded-full border border-white/10 p-1"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.15), transparent)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white/70" />
          </div>
          <div
            className={`h-full w-full rounded-full bg-cover bg-center animate-[spin_12s_linear_infinite]`}
            style={{
              backgroundImage: `url(${track.artwork})`,
            }}
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{track.title}</p>
          <p className="text-xs text-white/70">{track.artist}</p>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="rounded-full border border-white/10 p-2 text-white/80 transition hover:text-white"
              aria-label="Previous track"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={togglePlayback}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--bg-dark)] shadow-lg transition hover:bg-white/90"
              aria-label={isPlaying ? 'Pause track' : 'Play track'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={handleNext}
              className="rounded-full border border-white/10 p-2 text-white/80 transition hover:text-white"
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

