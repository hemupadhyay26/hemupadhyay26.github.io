import type { ComponentType } from 'react'

export type Project = {
  title: string
  description: string
  cover: string
  image: string
  /** URL opened (in new tab) when the card is clicked. Optional. */
  url?: string
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
  description: string
  loc: string
}

export type Track = {
  title: string
  artist: string
  artwork: string
  src: string
}

export type SocialLink = {
  id: string
  label: string
  href: string
  Icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
  copyEmail?: boolean
}
