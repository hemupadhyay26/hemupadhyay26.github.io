# Initialize Project

Set up and start the portfolio site locally.

## 1. Use the correct Node version

```bash
nvm use
```

This reads `.nvmrc` and switches to the pinned Node version. Always do this first to avoid version mismatch issues.

## 2. Install dependencies

```bash
npm install
```

Installs React, Vite, Tailwind CSS v4, TypeScript, ESLint, and `gh-pages`.

## 3. Start the dev server

```bash
npm run dev
```

Starts Vite with HMR at `http://localhost:5173`. No backend, no proxy — this is a fully static site.

## 4. Validate the setup

Open `http://localhost:5173` in the browser and confirm:

- Hero section loads with portrait image
- Navigation links work (Home, My Work scroll anchors; LinkedIn and Resume open in new tab)
- "Play song" button in the header opens the audio dock (desktop only)
- Skills cloud tags are animating

## Useful commands

```bash
npm run lint       # ESLint on all .ts / .tsx files — fix all errors before committing
npm run build      # Type-check (tsc -b) then build to dist/
npm run preview    # Serve dist/ locally at http://localhost:4173 — verify before deploying
npm run deploy     # Build + push dist/ to gh-pages branch → live at https://hemupadhyay26.github.io/
```

## Key files to know

| File | What it does |
|------|-------------|
| [src/App.tsx](../../src/App.tsx) | Entire page — all content data arrays and section JSX live here |
| [src/components/AudioDock.tsx](../../src/components/AudioDock.tsx) | Floating music player component |
| [src/index.css](../../src/index.css) | Color theme tokens (CSS custom properties) + global styles |
| [src/App.css](../../src/App.css) | Skill cloud float animation |
| [vite.config.ts](../../vite.config.ts) | Vite + Tailwind plugin config |

## Notes

- No `.env` file needed — no environment variables, no API keys
- No test suite configured
- The `gh-pages` branch is managed entirely by `npm run deploy` — never edit it manually
