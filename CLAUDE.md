# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start local dev server (Vite HMR)
npm run build      # Type-check with tsc then build to dist/
npm run lint       # Run ESLint on all TS/TSX files
npm run preview    # Preview the production build locally
npm run deploy     # Build and publish to GitHub Pages via gh-pages
```

No test suite is configured in this project.

## Architecture

Single-page React 19 portfolio site deployed to GitHub Pages at `https://hemupadhyay26.github.io/`.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite` plugin) + `lucide-react` icons.

### File structure

- [src/App.tsx](src/App.tsx) — The entire page. All sections (hero, work, experience, education, skills cloud) live here as inline JSX. Content data (nav links, projects, experience, education, floating skill tags) is defined as plain arrays/constants at the top of the file.
- [src/components/AudioDock.tsx](src/components/AudioDock.tsx) — Fixed floating music player (desktop only). Controlled by `App` via an `AudioCommand` object (`{ id, action: 'play' | 'pause' }`), which lets `App` trigger play/pause without the dock needing to be visible.
- [src/index.css](src/index.css) — Global CSS variables (design tokens: `--bg-dark`, `--surface`, `--accent`, etc.), body background gradient, and scrollbar styles. Imported first in `main.tsx`.
- [src/App.css](src/App.css) — `@keyframes floatTag` animation and `.floating-chip` / `.skill-cloud` helper classes used by the skills section.

### Styling conventions

- All colors use CSS custom properties defined in `index.css` (e.g. `text-[var(--accent)]`, `bg-[var(--surface)]`). Do not hardcode hex values in JSX—use these tokens.
- Tailwind utility classes are the primary styling mechanism. Custom CSS in `.css` files is kept to a minimum (animations, global resets).
- The `base` in `vite.config.ts` is set to `"/"` for GitHub Pages deployment from the root domain.

### Audio dock control pattern

`App` maintains `audioCommand: { id: number, action: 'play' | 'pause' } | null`. A new object with a fresh `Date.now()` id is created each time an action is needed, so `AudioDock` can react via a `useEffect` on `command` even when the action is the same as before.
