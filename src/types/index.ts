export type NavLink = {
  label: string
  href: string
  external?: boolean
}

export type Project = {
  title: string
  description: string
  cover: string
  image: string
}

export type Experience = {
  company: string
  role: string
  location: string
  period: string
  bullets: string[]
}

export type Education = {
  title: string
  period: string
  institution: string
}

export type FloatingTag = {
  label: string
  top: string
  left: string
  delay: string
  duration: string
}

export type AudioCommand = {
  id: number
  action: 'play' | 'pause'
}

export type Track = {
  title: string
  artist: string
  artwork: string
  src: string
}

export type AudioDockProps = {
  isVisible: boolean
  command?: AudioCommand | null
  onPlayingChange?: (isPlaying: boolean) => void
}

import type { ComponentType } from 'react'

export type SocialLink = {
  id: string
  label: string
  href: string
  Icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
  copyEmail?: boolean
}
