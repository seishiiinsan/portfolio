@AGENTS.md

# Portfolio — Project Rules

## Stack

- Next.js (App Router), TypeScript, Tailwind v4, ESLint
- `src/` dir, alias `@/*`

## Design System — Neo-Brutalist

**Core rules — apply everywhere, no exceptions:**

- Borders: `2px solid black` minimum; interactive elements `3-4px solid black`
- Shadows: hard offset only — `box-shadow: 4px 4px 0 black` (no blur, no opacity). On hover: shift element `translate(-2px, -2px)` + expand shadow to `6px 6px 0 black`
- Corners: `border-radius: 0` — no rounded corners anywhere
- Colors: black `#000`, white `#fff`, + max 2 bold accent colors (e.g. `#FFDD00`, `#FF3B3B`). No gradients, no semi-transparent backgrounds
- Typography: heavy weight (`font-weight: 700-900`), large scale jumps, uppercase where structural (nav, labels, section headers). No thin fonts
- Layout: visible grid, asymmetric where intentional, raw structure exposed — no hiding the grid
- Buttons/interactive: solid fill or outline, hard shadow, translate on hover/active. No ghost buttons with opacity
- Images: hard border frame (`3px solid black`), optional hard shadow offset

**Tailwind conventions:**
```
border border-black          → wrong (1px)
border-2 border-black        → base
border-4 border-black        → interactive / hero
shadow-[4px_4px_0_#000]      → standard hard shadow
shadow-[6px_6px_0_#000]      → hover state
hover:-translate-x-0.5 hover:-translate-y-0.5  → button hover shift
```

**Never use:** `rounded-*`, `shadow-sm/md/lg/xl`, gradients, `opacity-*` for color tinting, `backdrop-blur`

## Animation Stack

- **Lenis** — smooth scroll, global via `components/providers/SmoothScroll.tsx`
- **GSAP + ScrollTrigger** — scroll-driven anims; synced to Lenis via `gsap.ticker` in SmoothScroll
- **Motion** (ex-Framer) — micro-interactions, `Reveal` scroll-in, `ScrollProgress` bar
- **R3F v9 + drei v10 + three** — Hero particle globe (Fibonacci lattice, deterministic)

Hard rule: **every animation must respect `prefers-reduced-motion`** — Reveal → static div; globe → `frameloop="demand"` + no rotation; Lenis + GSAP → skipped; SmoothScroll/ProjectCard early-return on `useReducedMotion()`

Excluded (do not add): tsParticles, Vanta, TresJS, Radix Vue, Aceternity UI, Magic UI

## Theme

Force-dark: `.dark` on `<html>` + `--background: #000`. Sections zebra-striped + numbered.
In dark mode: borders `white`, shadows `4px 4px 0 white`.
