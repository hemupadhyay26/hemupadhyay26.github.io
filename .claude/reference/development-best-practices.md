# Development Best Practices

Standards for working in the `hemupadhyay26.github.io` portfolio codebase, with real examples from the code.

---

## 1. Assets: One Folder, Consistent Naming

All assets live under `src/assets/`. Use subfolders only when there are multiple related files of the same type (e.g. `audio/`). Use **camelCase** for all file names — no kebab-case, no mixed conventions, no typos.

### Current problems in this repo

```
src/assets/
├── infuseAI.png                  ❌ uppercase mid-word
├── interviewAI.png               ❌ uppercase mid-word
├── sshCredManger.png             ❌ typo — "Manger" should be "Manager"
├── slack-notification-template.png  ❌ kebab-case
├── hero.jpg                      ❌ unused duplicate (hero.webp is imported)
├── react.svg                     ❌ leftover from Vite scaffold, unused
└── audio/
    ├── audioImg1.jpg             ❌ vague, not descriptive
    ├── audioImg2.jpg             ❌ vague
    └── audioImg3.jpg             ❌ vague
```

### How it should look

```
src/assets/
├── heroPortrait.webp
├── resume.pdf
├── projectInfuseAi.png
├── projectInterviewAi.png
├── projectSshCredManager.png
├── projectSlackNotification.png
└── audio/
    ├── track1.mp3
    ├── track2.mp3
    ├── track3.mp3
    ├── track1Cover.jpg
    ├── track2Cover.jpg
    └── track3Cover.jpg
```

### Rule

| Do | Don't |
|----|-------|
| `sshCredManager.png` | `sshCredManger.png` (typo) |
| `projectInfuseAi.png` | `infuseAI.png` (uppercase mid-word) |
| `projectSlackNotification.png` | `slack-notification-template.png` (kebab) |
| `heroPortrait.webp` | `hero.jpg` + `hero.webp` (duplicates) |

Delete unused assets. `react.svg` and `hero.jpg` are dead files in the current repo.

---

## 2. Reusable Code Belongs in Components

If a piece of JSX is used more than once, or if a section is complex enough to reason about independently, it should be its own component in `src/components/`.

### Current problem — nav link rendered twice

The nav `<a>` element is rendered identically in both the desktop nav (App.tsx:193) and the mobile drawer (App.tsx:237), with only the `className` differing:

```tsx
// Desktop nav — App.tsx:193
{navLinks.map((link) => (
  <a key={link.label} href={link.href} target={link.external ? '_blank' : undefined} ...>
    {link.label}
  </a>
))}

// Mobile drawer — App.tsx:237 (same logic, different className)
{navLinks.map((link) => (
  <a key={link.label} href={link.href} target={link.external ? '_blank' : undefined} ...>
    {link.label}
  </a>
))}
```

This should be a `NavLink` component that accepts a `className` prop.

### Current problem — email copy button in two places

The copy-email button with tooltip appears in the hero section (App.tsx:290) and in the footer (App.tsx:479). Both use the same `copiedSource` check, the same icon swap, and the same `handleEmailCopy` call. This should be a `CopyEmailButton` component.

### Current problem — section content rendered inline

Each section (work cards, experience cards, education items) is rendered as inline JSX inside the single 519-line `App.tsx`. These should be individual components:

```
src/components/
├── AudioDock.tsx          ✅ already a component
├── NavLink.tsx            → extract from App.tsx:193 & 237
├── CopyEmailButton.tsx    → extract from App.tsx:290 & 479
├── ProjectCard.tsx        → extract from App.tsx:342-368
├── ExperienceCard.tsx     → extract from App.tsx:375-401
└── SkillCloud.tsx         → extract from App.tsx:448-471
```

---

## 3. DRY — Don't Repeat Yourself

### Duplicated type definition

`AudioCommand` is defined in both `App.tsx` and `AudioDock.tsx`:

```tsx
// App.tsx:153
type AudioCommand = {
  id: number
  action: 'play' | 'pause'
}

// AudioDock.tsx:42  ← exact duplicate
type AudioCommand = {
  id: number
  action: 'play' | 'pause'
}
```

Define shared types once in `src/types/index.ts` and import from there in both files.

### Repeated Tailwind class combinations

This combination appears across many elements in App.tsx:

```tsx
// repeated in header, footer, project cards, experience cards...
"border-[var(--border-light)] bg-[var(--surface)]"
"hover:border-[var(--accent)] hover:text-[var(--accent)]"
"inline-flex items-center gap-2 rounded-full border px-4 py-2 transition"
```

Extract repeated pill-button styles into a shared class string or a `PillButton` component rather than copying the full class list every time.

---

## 4. Every Data Structure Needs a Type

All data arrays at the top of `App.tsx` are untyped. TypeScript cannot catch mistakes (wrong field name, missing field) without explicit types.

### Current — no types on data arrays

```tsx
// App.tsx:36 — no type, TypeScript infers loosely
const myWork = [
  { title: 'Infuse AI', description: '...', cover: 'infuse ai', image: infuseAi },
]

// App.tsx:63 — no type
const experienceCards = [
  { location: '...', company: '...', role: '...', period: '...', bullets: [] },
]

// App.tsx:115 — no type
const floatingTags = [
  { label: 'DevOps', top: '8%', left: '10%', delay: '0s', duration: '8.4s' },
]
```

### Correct — define types for every data structure

```tsx
// src/types/index.ts

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
```

Then use them on the constants:

```tsx
import type { Project, Experience, FloatingTag } from '../types'

const myWork: Project[] = [ ... ]
const experienceCards: Experience[] = [ ... ]
const floatingTags: FloatingTag[] = [ ... ]
```

Component props should also use these types directly:

```tsx
// src/components/ProjectCard.tsx
import type { Project } from '../types'

export function ProjectCard({ title, description, cover, image }: Project) { ... }
```

---

## 5. Max 200 Lines Per File — Break It Up

If a file exceeds ~200 lines it's doing too much. Extract until each file has a single clear responsibility.

### Current problem

`App.tsx` is **519 lines**. It contains:
- All TypeScript types
- All data arrays (nav, projects, experience, education, skills — ~130 lines of data alone)
- All component state and handlers
- The full page JSX for every section

### Target structure

```
src/
├── types/
│   └── index.ts          ← all shared types (AudioCommand, Project, Experience, etc.)
├── data/
│   └── index.ts          ← all content arrays (navLinks, myWork, experienceCards, floatingTags, etc.)
├── components/
│   ├── AudioDock.tsx      ← already exists ✅
│   ├── NavLink.tsx
│   ├── CopyEmailButton.tsx
│   ├── ProjectCard.tsx
│   ├── ExperienceCard.tsx
│   └── SkillCloud.tsx
├── App.tsx                ← reduced to layout + state only (~80–100 lines)
├── App.css
├── index.css
└── main.tsx
```

### What stays in App.tsx after the split

Only the shell: state declarations, event handlers, and the top-level layout stitching the section components together. No inline data, no type definitions, no multi-line JSX blocks.

```tsx
// App.tsx after refactor — ~80 lines
import { useState } from 'react'
import { navLinks } from './data'
import type { AudioCommand } from './types'
import { HeroSection, WorkSection, ExperienceSection, SkillCloud, AudioDock } from './components'

function App() {
  const [audioCommand, setAudioCommand] = useState<AudioCommand | null>(null)
  // ... other state

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-light)]">
      <Header navLinks={navLinks} ... />
      <main ...>
        <HeroSection />
        <WorkSection />
        <ExperienceSection />
        <SkillCloud />
      </main>
      <Footer />
      <AudioDock ... />
    </div>
  )
}
```

### Quick size check during development

```bash
wc -l src/**/*.tsx src/**/*.ts   # check line counts across all source files
```

Flag any file approaching 200 lines and plan the split before it gets larger.

---

## 6. Always Use Colors from the Theme in index.css

The full color palette is defined as CSS custom properties in [`src/index.css`](/../src/index.css). Never hardcode a hex, rgb, or rgba value in JSX or in any other CSS file. If a color you need does not have a token yet, add it to `:root` in `src/index.css` first — then reference the token.

### Wrong

```tsx
// ❌ hardcoded hex in className
<div className="bg-[#070c1d] text-[#f2f5ff]">

// ❌ hardcoded rgba in inline style
<span style={{ color: '#4cc2ff', background: 'rgba(76,194,255,0.12)' }}>

// ❌ new one-off color invented in JSX without a token
<p className="text-[rgb(59,201,109)]">Available</p>
```

### Correct

```tsx
// ✅ reference the token via Tailwind's arbitrary-value syntax
<div className="bg-[var(--surface)] text-[var(--text-light)] border-[var(--border-light)]">

// ✅ inline style also uses the variable
<span style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>

// ✅ new color needed → add the token to src/index.css first, then use it
<span className="bg-[var(--status-green-soft)] text-[var(--status-green)]">Available</span>
```

Keeping every color in `src/index.css` means any theme change requires editing exactly one file.
