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

- [src/App.tsx](src/App.tsx) — Main portfolio layout assembling the V3 Zine components and custom cursor.
- [src/components/ZineHero.tsx](src/components/ZineHero.tsx) — Hero section with spinning circular badge and embedded audio player.
- [src/components/ZineSections.tsx](src/components/ZineSections.tsx) — About, Toolbox/Stack, Résumé/Experience, and Contact sections.
- [src/components/ZineWorks.tsx](src/components/ZineWorks.tsx) — Selected projects grid.
- [src/components/ZineTerminal.tsx](src/components/ZineTerminal.tsx) — Interactive CLI terminal widget.
- [src/components/NimbuMirchi.tsx](src/components/NimbuMirchi.tsx) — Nimbu Mirchi dangling interactive talisman component.
- [src/data/index.ts](src/data/index.ts) — Portfolio data (projects, experience, education, social links, audio tracks).
- [src/types/index.ts](src/types/index.ts) — TypeScript interfaces and types for portfolio models.
- [src/index.css](src/index.css) — Design tokens and global styles.
- [src/App.css](src/App.css) — Styles for the Zine editorial portfolio design.

### Styling conventions

- Design tokens are defined in `index.css` (`--paper`, `--paper-2`, `--ink`, `--ink-2`, `--ink-3`, `--rule`, `--accent`, `--accent-2`, `--serif`, `--sans`, `--mono`).
- The `base` in `vite.config.ts` is set to `"/"` for GitHub Pages deployment from the root domain.
