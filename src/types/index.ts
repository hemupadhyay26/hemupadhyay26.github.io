export type NavLink = {
  label: string
  href: string
  external?: boolean
}

/**
 * Shape controls how the card tiles in the bento grid.
 *
 *  horizontal  — wide rectangle  (more cols than rows)
 *  vertical    — tall rectangle  (more rows than cols)
 *  square      — equal sides
 *  main-square — ONE per grid, always large, used to highlight your top project
 *  circle      — perfectly circular card
 *  wide-banner — spans the full grid width (4 cols)
 *
 * Size controls grid span:
 *  small  (default) — minimum footprint for the chosen shape
 *  medium           — mid-size footprint
 *  large            — largest footprint  (blocked for main-square which is always its own large)
 *
 * Rule: only ONE card may use shape "main-square". It ignores the size field.
 */
export const ProjectShape = {
  Horizontal : 'horizontal',
  Vertical   : 'vertical',
  Square     : 'square',
  MainSquare : 'main-square',
  Circle     : 'circle',
  WideBanner : 'wide-banner',
} as const

export type ProjectShape = (typeof ProjectShape)[keyof typeof ProjectShape]

export const ProjectSize = {
  Small  : 'small',
  Medium : 'medium',
  Large  : 'large',
} as const

export type ProjectSize = (typeof ProjectSize)[keyof typeof ProjectSize]

export type Project = {
  title: string
  description: string
  cover: string
  image: string
  /** URL opened (in new tab) when the card is clicked. Optional. */
  url?: string
  /** @default 'square' */
  shape?: ProjectShape
  /** @default 'small'  (ignored for main-square — always large) */
  size?: ProjectSize
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

export type TerminalCommand = {
  /** The exact string the user types (lowercase, no spaces) */
  command: string
  /** One-line description shown in `help` output */
  description: string
  /** Response lines. Use an array for multi-line output. */
  output: string | string[]
}
