# PRD — hemupadhyay26.github.io Portfolio

---

## 1. Executive Summary

This is a personal portfolio website for Hem Upadhyay, a DevOps Engineer and AI enthusiast with 2+ years of professional experience. The site serves as a central hub for professional identity — showcasing projects, work history, education, skills, and providing direct contact paths for recruiters, collaborators, and potential clients.

The site is built as a fully static React + TypeScript + Vite application deployed to GitHub Pages. It requires no backend, no database, and no environment variables. All content is managed directly in the source code.

**Status: MVP shipped** — the base portfolio is live at `https://hemupadhyay26.github.io/`. The next phase is evolving it from a standard portfolio into a creative, interactive experience that makes skills tangible, not just listed.

**End goal:** A portfolio that doesn't just tell people what Hem knows — it *shows* them through the experience of using the site itself.

---

## 2. Mission

> Make it effortless for the right people to find, understand, and contact Hem — and make the portfolio itself a demonstration of the craft.

**Core principles:**

1. **Content first** — Every section earns its place by communicating professional value
2. **Fast and static** — No server, no API, no loading states for content that doesn't change
3. **Easy to maintain** — Adding a new project, job, or skill should take under 5 minutes
4. **Consistent standards** — Types, components, asset naming, and color usage follow documented conventions
5. **Dark, premium aesthetic** — The visual design reflects the quality of work being showcased
6. **Show, don't just tell** — Features should demonstrate skills through interaction, not just list them as text

---

## 3. End Goal Vision

The portfolio should feel like a product built by a DevOps/AI engineer — not a template filled in. Every creative choice should connect back to the work Hem actually does. A recruiter who lands on the page should immediately sense the technical taste before reading a single word.

### Interactive Terminal Section

A CLI-style widget embedded in the page where visitors type real commands to explore the portfolio. This directly demonstrates Linux/DevOps familiarity in the UI itself.

```bash
$ whoami
> Hem Upadhyay — DevOps Engineer | AI Engineer

$ ls projects/
> infuse-ai   interview-ai   ssh-cred-manager   slack-notifications

$ cat experience/rubico-it.txt
> Role: DevOps Engineer | Mar 2024 – Oct 2025
> Automated CI/CD pipelines across dev/stage/prod...

$ skills --list
> AWS  Docker  Terraform  Kubernetes  Python  LangGraph ...
```

Supported commands: `whoami`, `ls`, `cat`, `skills`, `contact`, `help`, `clear`. Unknown commands return a friendly error message.

### CI/CD Pipeline Visualization for Experience

Instead of plain bordered cards, the experience section renders as an animated pipeline diagram — each job is a stage (`Build → Test → Deploy`) with the company as the stage name and tools as the pipeline steps. This turns a typical resume section into something that immediately communicates how Hem thinks about systems.

```
[ Graphic Era ] ──▶ [ Rubico IT ] ──▶ [ Strobes ]
  Education            CI/CD              Cloud Infra
  2020–2024           Mar'24–Oct'25      Nov'25–Now
```

### Scroll-Triggered Section Animations

Each section animates into view as the user scrolls — sections slide up and fade in using `IntersectionObserver`. Not flashy, just smooth. Reinforces the sense that the site is crafted, not generated.

### Project Cards with Flip Interaction

Project cards flip on hover (or tap on mobile):
- **Front:** Screenshot, title, short description (current state)
- **Back:** Tech stack pills, GitHub link, live demo link (if available)

This adds depth without cluttering the default view.

### Stats Bar — Numbers That Mean Something

A horizontal metrics strip between the hero and projects sections, styled like a monitoring dashboard readout:

| Metric | Value |
|--------|-------|
| Years of experience | 2+ |
| Pipelines automated | 10+ |
| AWS services used | 12+ |
| AI agents built | 3+ |
| Uptime focus | 99.9% |

Numbers animate up from 0 on scroll (count-up effect). Immediately communicates scale without reading a paragraph.

### Skills Section — Clickable Filter

The floating skills cloud gains interactivity: clicking a skill tag filters the projects section to show only projects where that skill was used. This connects skills to real work rather than just listing words.

### Page Load Animation / Splash

A brief terminal-style boot sequence on first load:

```
> initializing portfolio...
> loading experience...
> connecting to the world...
> ready.
```

Fades in within 1.5 seconds, then reveals the page. Sets the tone immediately.

### Smooth Scroll & Section Transitions

All anchor navigation (Home, My Work) smoothly scrolls with easing. Section headings have a subtle accent underline animation when they enter the viewport.

---

## 3b. Target Users

### Primary — Recruiters & Hiring Managers
- Scanning dozens of profiles; need to grasp skills and experience in under 30 seconds
- Want direct access to resume and LinkedIn
- **Need:** Clear role/title, skills at a glance, one-click resume download

### Secondary — Potential Clients / Collaborators
- Looking for DevOps or AI engineering help on specific problems
- Want to see proof of relevant work
- **Need:** Project descriptions, contact method

### Tertiary — Technical Peers
- Curious about the stack, implementation, or the person behind the work
- **Need:** Clean code, interesting UI details (the audio dock, skills animation)

---

## 4. MVP Scope

### Core Functionality
- ✅ Hero section — portrait, name, role, location, "available for work" badge
- ✅ Email copy-to-clipboard with tooltip feedback
- ✅ Resume download (PDF)
- ✅ LinkedIn link
- ✅ Projects section — screenshot, title, short description
- ✅ Experience section — company, role, location, period, bullet points
- ✅ Education section
- ✅ Skills & Tools cloud — animated floating tags
- ✅ Footer with email + LinkedIn
- ✅ Responsive layout — mobile hamburger nav, desktop inline nav
- ✅ Floating audio dock — music player, desktop only
- ✅ Dark theme with grid background

### Out of Scope (future phases)
- ❌ Blog / writing section
- ❌ Project detail pages or modal overlays
- ❌ Contact form (email, Calendly, etc.)
- ❌ Light/dark mode toggle
- ❌ Certifications section (scaffolded but commented out)
- ❌ GitHub activity feed or live stats
- ❌ Project links (GitHub repo, live demo URLs)
- ❌ Analytics integration
- ❌ CMS for content management
- ❌ i18n / localization

---

## 5. User Stories

**As a recruiter**, I want to see Hem's current role and availability immediately on page load, so I can decide in seconds whether to keep reading.

**As a recruiter**, I want to download the resume in one click without navigating away, so I can save it to my pipeline quickly.

**As a potential collaborator**, I want to copy Hem's email with a single click (without opening an email client), so I can paste it wherever I'm already working.

**As a visitor**, I want to see real screenshots of projects with a short description, so I can judge the quality and relevance of the work without leaving the page.

**As a visitor on mobile**, I want the navigation and content to be fully readable and usable on a phone, so I don't have to pinch-zoom or lose access to any links.

**As a technical visitor**, I want to see the skills and tools listed in an interesting, non-generic way, so the portfolio itself signals technical taste.

**As a visitor**, I want to optionally play background music while browsing, so the experience feels more personal and crafted.

---

## 6. Core Architecture & Patterns

### Architecture

Single-page React application. No routing, no API layer. All content is static data defined in source code. Deployed as a static bundle to GitHub Pages.

### Directory structure (target state)

```
src/
├── types/
│   └── index.ts          — all shared TypeScript interfaces
├── data/
│   └── index.ts          — all content arrays (projects, experience, skills, etc.)
├── components/
│   ├── AudioDock.tsx
│   ├── NavLink.tsx
│   ├── CopyEmailButton.tsx
│   ├── ProjectCard.tsx
│   ├── ExperienceCard.tsx
│   └── SkillCloud.tsx
├── App.tsx               — layout + state only (~80-100 lines)
├── App.css               — skill cloud animation
├── index.css             — theme tokens + global styles
└── main.tsx              — entry point
```

### Key design patterns

- **Content as data** — All page content (projects, jobs, skills) lives in typed arrays in `src/data/index.ts`. Update content by editing data, not JSX.
- **CSS custom properties for theming** — All colors are tokens in `src/index.css :root`. Never hardcode hex/rgb values in JSX.
- **Command pattern for audio** — `App` sends `{ id: number, action: 'play' | 'pause' }` to `AudioDock`. Fresh `Date.now()` id per command ensures `useEffect` fires even on repeated same action.
- **200-line file limit** — Any file exceeding ~200 lines must be split. Check with `wc -l src/**/*.tsx src/**/*.ts`.

---

## 7. Features

### Hero Section
- Portrait image (`hero.webp`)
- Name, role subtitle, location
- "Available for work" status badge (green)
- Email copy button with "Copied!" tooltip (2-second timeout)
- LinkedIn link
- Resume download link (PDF, `download` attribute)
- About me paragraph

### Projects Section
- Grid of project cards (3 columns on desktop)
- Each card: screenshot image, cover label (uppercase), title, description
- "View all" link to GitHub profile

### Experience Section
- Left-bordered cards, one per job
- Each card: location, company name, role, period, bullet list of highlights

### Education Section
- Left-bordered minimal card
- Degree title, period, institution

### Skills & Tools Cloud
- 29 floating animated chips positioned by % coordinates
- Each chip: accent dot, label text
- `@keyframes floatTag` — subtle float + rotate loop per chip, each with unique delay and duration
- Hover state: accent color border + text

### Navigation
- Desktop: inline centered nav links
- Mobile: hamburger icon → dropdown drawer
- Links: Home (anchor), My Work (anchor), LinkedIn (external), Resume (external PDF)
- "Play song" / "Pause song" button toggles AudioDock visibility

### Audio Dock
- Fixed bottom-right, desktop only
- Spinning vinyl artwork, track title, artist
- Previous / Play-Pause / Next controls
- 3 bundled no-copyright tracks
- Controlled externally via `command` prop from App

### Footer
- Copyright name
- Email copy button (pill style)
- LinkedIn link (pill style)

---

## 8. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19.x |
| Language | TypeScript | ~5.9 |
| Build tool | Vite | 7.x |
| Styling | Tailwind CSS v4 | 4.x |
| Tailwind integration | `@tailwindcss/vite` | 4.x |
| Icons | `lucide-react` | 0.555+ |
| Deployment | `gh-pages` | 6.x |
| Linting | ESLint (flat config) | 9.x |
| TypeScript ESLint | `typescript-eslint` | 8.x |
| React linting | `eslint-plugin-react-hooks` | 7.x |
| Node version | Pinned via `.nvmrc` | — |

**No backend. No database. No environment variables.**

---

## 9. Security & Configuration

**Authentication:** None required — fully public static site.

**Configuration:** No `.env` file needed. All config is in `vite.config.ts` (base path, plugins).

**Deployment security:**
- `gh-pages` branch is managed entirely by `npm run deploy` — never push to it manually
- `dist/` is gitignored from `main`; only source is committed

**Asset security:**
- Resume PDF is a public static asset — treat it as intentionally public
- No personal data beyond what is explicitly displayed on the page

---

## 10. Success Criteria

### MVP success definition
The portfolio accurately represents Hem's experience, loads fast, looks polished on mobile and desktop, and makes it trivially easy to download the resume or copy the email.

### Functional requirements
- ✅ All sections render correctly on desktop and mobile
- ✅ Resume downloads on click (no navigation)
- ✅ Email copy works with visible feedback
- ✅ LinkedIn opens in a new tab
- ✅ Audio dock plays, pauses, skips tracks
- ✅ Skills cloud animates without layout jank
- ✅ `npm run lint` passes with zero errors
- ✅ `npm run build` completes without TypeScript errors
- ✅ `npm run preview` renders correctly before deploy

### Quality indicators
- No TypeScript errors (`tsc -b` clean)
- No ESLint errors
- No unused assets in `src/assets/`
- No hardcoded hex/rgb values outside `src/index.css`
- No file over 200 lines
- All data arrays have explicit TypeScript types

---

## 11. Implementation Phases

### Phase 0 — MVP ✅ SHIPPED
The base portfolio is live. All core sections render correctly, resume downloads, email copy works, audio dock plays, responsive layout works.

---

### Phase 1 — Refactor to code standards *(next up)*
**Goal:** Bring the codebase up to documented best practices before adding new features.

- [ ] Define all TypeScript types in `src/types/index.ts`
- [ ] Move all content data to `src/data/index.ts`
- [ ] Extract `ProjectCard` component
- [ ] Extract `ExperienceCard` component
- [ ] Extract `CopyEmailButton` component
- [ ] Extract `NavLink` component
- [ ] Extract `SkillCloud` component
- [ ] Reduce `App.tsx` to under 200 lines
- [ ] Fix asset naming (camelCase, no typos, remove unused files)
- [ ] Remove duplicate `AudioCommand` type definition

**Validation:** `npm run lint && npm run build` — zero errors. `wc -l src/**/*.tsx` — no file over 200 lines.

---

### Phase 2 — Content accuracy
**Goal:** Keep the live site content current and complete.

- [ ] Update experience bullets for current role (Strobes)
- [ ] Add GitHub / live demo links to each project card
- [ ] Replace placeholder audio track titles with real names
- [ ] Verify resume PDF is current
- [ ] Add SEO `<meta>` description and Open Graph tags

---

### Phase 3 — Creative interactions *(end goal)*
**Goal:** Transform the portfolio from a static page into a showcase of craft. Each feature in this phase is a deliberate demonstration of technical personality.

#### 3a. Page load boot sequence
A terminal-style splash (`initializing portfolio... ready.`) that fades in under 1.5 seconds before revealing the page. Sets tone immediately. Pure CSS + React, no dependencies.

#### 3b. Scroll-triggered section animations
Each section fades + slides up into view using `IntersectionObserver`. No animation library needed — native browser API + CSS transitions. Sections stay visible once they've animated in.

#### 3c. Stats bar (count-up on scroll)
A horizontal metrics strip between the hero and projects — years of experience, pipelines automated, AWS services, AI agents built. Numbers count up from 0 when scrolled into view. Pure React + `IntersectionObserver`.

#### 3d. Project cards — flip on hover
Cards flip to reveal tech stack pills + GitHub link + live demo link on the back face. CSS `transform: rotateY()` with `perspective`. No additional libraries.

#### 3e. Interactive terminal section
A fully interactive CLI widget in the page. Visitors type commands to explore Hem's profile.

Supported commands:
```
whoami        → name, role, location
ls projects/  → list all projects
cat <project> → show description + stack + links
skills        → full skills list
contact       → email + LinkedIn
clear         → clear terminal output
help          → list all commands
```

Built as a single `Terminal.tsx` component with a `commands` map in `src/data/index.ts`. Demonstrates Linux/DevOps fluency through the UI itself.

#### 3f. Skills cloud — clickable filter
Clicking a tag in the skills cloud filters the projects section to show only projects that used that skill. Skills with no linked projects still display but don't filter. Resets on second click or via an "All" button.

#### 3g. CI/CD pipeline experience visualization
The experience section renders as a horizontal pipeline diagram (on desktop) with each job as a stage, key tools as steps within each stage, and a flowing connection line between stages. Mobile falls back to the current card layout.

---

### Phase 4 — Discovery & reach
**Goal:** Extend the portfolio's value beyond the single page.

- [ ] Certifications section (already scaffolded in code, commented out)
- [ ] Blog / writing section (markdown files → static pages)
- [ ] Contact form (Formspree or `mailto:` link)
- [ ] Privacy-respecting analytics (Plausible)
- [ ] GitHub contribution graph or live stats via GitHub API

---

## 12. Future Considerations

- **AI chat widget:** "Ask me anything about Hem" powered by a Claude API call — would need a lightweight edge function (Cloudflare Workers or Vercel Edge) since GitHub Pages is static only. High impact, needs backend decision first.
- **Light mode:** Toggle between dark and a warm light theme. All colors already in CSS variables so the switch would only require a `data-theme` attribute on `<html>` and a second `:root[data-theme="light"]` block in `index.css`.
- **Live GitHub stats:** Contribution graph, top languages, star counts via GitHub's public API — can be fetched client-side at runtime, no backend needed.
- **Project detail pages:** Could be implemented as hash-based routes (`/#/projects/infuse-ai`) without a router library, or as static HTML files, to avoid adding React Router for a portfolio site.
- **Certifications:** Already scaffolded in `App.tsx` (commented out) — just needs real data and an uncomment.

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| `App.tsx` continues to grow and becomes unmanageable | Enforce 200-line limit via Phase 1 refactor; document the rule in best-practices |
| Asset names diverge from convention as new content is added | Naming rules documented in `.claude/reference/deployment-best-practices.md`; enforce on every PR |
| Color tokens get bypassed with hardcoded values | ESLint rule or code review checklist; documented in best practices |
| Resume PDF becomes stale | Keep the file path constant (`src/assets/resume.pdf` after rename); just drop a new file in |
| `gh-pages` branch gets into a broken state | `npm run deploy` force-pushes clean `dist/` each time — run it to fix any state issues |

---

## 14. Appendix

### Related documents

- [CLAUDE.md](../../CLAUDE.md) — Claude Code guidance for this repo
- [.claude/reference/deployment-best-practices.md](./reference/deployment-best-practices.md) — Development standards with code examples
- [.claude/commands/init-project.md](./commands/init-project.md) — How to start the project locally

### Key file paths

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Entire page layout and content (pre-refactor) |
| `src/components/AudioDock.tsx` | Floating music player |
| `src/index.css` | Color theme tokens — single source of truth for all colors |
| `src/App.css` | Skill cloud animation keyframes |
| `vite.config.ts` | Build config — `base: "/"` required for GitHub Pages root domain |
| `package.json` | All scripts including `npm run deploy` |
| `.nvmrc` | Pinned Node version — always run `nvm use` first |
