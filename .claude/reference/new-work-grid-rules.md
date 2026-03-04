# Work Grid Rules

How the bento grid in the **Work** section works, how to configure each project card, and what rules must be followed.

---

## Files involved

| File | Role |
|------|------|
| `src/data/index.ts` | Add / edit projects and set their `shape` + `size` |
| `src/types/index.ts` | `ProjectShape` and `ProjectSize` const objects + derived types |
| `src/components/WorkBento.tsx` | Renders the grid; reads `shape`/`size` to compute spans and styles |
| `src/App.css` — `.bento-grid` | 4-column CSS grid with `grid-auto-flow: dense` |

---

## Grid system

The grid is **4 columns wide**. Row height is `220px` on desktop, `180px` on mobile (2 cols).
`grid-auto-flow: dense` fills gaps automatically when cards have different spans.

Each card declares its own `gridColumn: span X` and `gridRow: span Y` via inline style.
No fixed `grid-template-areas` — layout is fully data-driven.

---

## Shapes

Set `shape` on a project entry in `src/data/index.ts` using the `ProjectShape` const:

```ts
import { ProjectShape, ProjectSize } from '../types'

{ shape: ProjectShape.Square, size: ProjectSize.Small }
```

| Constant | Value | Description |
|----------|-------|-------------|
| `ProjectShape.Horizontal` | `'horizontal'` | Wide card — more columns than rows |
| `ProjectShape.Vertical` | `'vertical'` | Tall card — more rows than columns |
| `ProjectShape.Square` | `'square'` | Equal-sided card |
| `ProjectShape.MainSquare` | `'main-square'` | **Featured highlight. Only ONE per grid. Always large (2×2). Ignores `size`.** |
| `ProjectShape.Circle` | `'circle'` | Circular card (uses radial gradient, centered text) |
| `ProjectShape.WideBanner` | `'wide-banner'` | Spans all 4 columns |

---

## Sizes

Set `size` using the `ProjectSize` const. **Default is `small`** if omitted.
`main-square` ignores `size` — it is always its own large regardless of what is set.

| Constant | Value | Effect |
|----------|-------|--------|
| `ProjectSize.Small` | `'small'` | Minimum footprint for the shape *(default)* |
| `ProjectSize.Medium` | `'medium'` | Mid footprint |
| `ProjectSize.Large` | `'large'` | Max footprint |

---

## Grid spans (shape × size)

| Shape | Small | Medium | Large |
|-------|-------|--------|-------|
| `horizontal` | 2 col × 1 row | 3 col × 1 row | 4 col × 1 row |
| `vertical` | 1 col × 2 row | 1 col × 2 row | 1 col × 3 row |
| `square` | 1 col × 1 row | 2 col × 2 row | 2 col × 2 row |
| `main-square` | — | — | **always 2 col × 2 row** |
| `circle` | 1 col × 1 row | 2 col × 2 row | 2 col × 2 row |
| `wide-banner` | 4 col × 1 row | 4 col × 1 row | 4 col × 2 row |

---

## Content depth (auto, based on area)

The card automatically shows more or less text depending on its grid area (`col × row`):

| Area | Label visible | Title size | Description |
|------|--------------|------------|-------------|
| 1×1 = 1 | hidden | small | hidden |
| 2×1 or 1×2 = 2–3 | shown | base | hidden |
| 2×2 or 4×1 = 4+ | shown | large | shown (line-clamp 2) |

---

## Rules

1. **Only one `main-square` per grid.** It acts as the featured/highlighted project. Using more than one breaks the visual hierarchy.
2. `main-square` always renders at **2×2** regardless of the `size` field. Do not try to override it.
3. **Default values** — if `shape` or `size` is omitted, the card renders as `square` / `small` (1×1).
4. `circle` shape uses a **radial gradient** overlay and **centered text** instead of the bottom-anchored text layout used by all other shapes.
5. `wide-banner` should be used sparingly — it takes the full row and pushes other cards to the next row.

---

## Hover animation rules

All hover animations are driven by **framer-motion** (`onHoverStart` / `onHoverEnd` + `animate`), not CSS `group-hover`. This ensures both the **enter** and **exit** transitions are smooth.

| Element | Animation |
|---------|-----------|
| Card border | Fades to `accent/40` on enter, fades back on exit |
| Card box-shadow | Glows `rgba(76,194,255,0.11)` on enter, fades on exit |
| Image | Scales to `1.07` on enter, springs back to `1` on exit |
| Title text | Fades to `#ffffff` on enter, returns to `var(--text-light)` |
| Bottom sweep line | `scaleX` 0→1 on enter, 1→0 on exit (origin: left) |

**Do not replace these with CSS `transition` + `group-hover`.** CSS hover exits are instant — framer-motion exits are animated.
All transitions use the project's shared easing curve: `[0.22, 1, 0.36, 1]`.

---

## Adding a new project

```ts
// src/data/index.ts
{
  title: 'My New Project',
  description: 'What it does.',
  cover: 'project label',
  image: projectMyNewProject,   // import the asset at the top of the file
  shape: ProjectShape.Horizontal,
  size: ProjectSize.Medium,
}
```

The grid re-tiles itself automatically via `grid-auto-flow: dense` — no layout changes needed in any other file.
