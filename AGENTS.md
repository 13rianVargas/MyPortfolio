# MyPortfolio · Agent Context

> Operational context and rules for AI agents working in this repository.

---

## Project Overview

Personal portfolio website for Brian Vargas (@13rianVargas). Showcases projects, skills, and professional experience.

**Live:** https://13rian-vargas.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5.x (static, one on-demand route) |
| Styling | Plain CSS + custom properties (Tailwind removed — its v4 config was never loaded and it was used in ~6 classes) |
| Language | TypeScript |
| Package manager | pnpm |
| Deploy | Vercel (`@astrojs/vercel`) |
| Contact form | FormSubmit via server-side `/api/contact` |

---

## Project Structure

```text
MyPortfolio/
├── src/
│   ├── components/
│   │   └── sections/       # Modularized UI sections
│   ├── i18n/               # Translation utilities and dictionaries (en/es/fr/pt)
│   ├── layouts/            # Responsive base layouts
│   └── pages/
├── public/
│   └── icons/flags/        # SVG flag assets for i18n
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

---

## Dev Commands

```bash
# One-time tooling setup
corepack enable && corepack prepare pnpm@latest --activate
curl -fsSL https://bun.sh/install | bash

# Install dependencies
pnpm install

# Dev server
bun dev

# Production build
bun run build
```

---

## Key Features

- Interactive 3D identity card (CSS 3D transforms; flat on touch).
- Interactive ripple background, off under `prefers-reduced-motion`.
- i18n: English, Spanish, French, Portuguese — client-side dictionary.
- Projects come from local config in `4-Projects.astro`, not the GitHub API.
- Dark/light mode via CSS variables, persisted in `localStorage`.
- WCAG AA contrast verified by measurement in both themes.

---

## Conventions

- i18n: all user-facing text must exist in all 4 languages (`en`, `es`, `fr`, `pt`) in `src/i18n/ui.ts`. Verify key parity after editing.
- Components go in `src/components/sections/`, numbered in render order.
- Design tokens live in `src/styles/global.css`. Component `<style>` is scoped, but `:root` inside it leaks globally — never define tokens there.
- Amber is a surface colour. Use `--color-on-accent` for text on it and `--color-accent-text` for amber-as-text; raw `--color-accent` as text fails contrast.
- TypeScript for all non-markup files.
- Commits: Conventional Commits, English, lowercase.
  ```
  feat: add french translation for about section
  fix: resolve 3d card gyroscope on ios
  chore: update astro to 5.3
  ```

---

## AI Agent Instructions

- This is a personal project. No team or club conventions apply.
- Respect existing i18n structure — add all 4 languages when adding text.
- Project data is local. Do not reintroduce build-time GitHub API fetches: repos get renamed and the build then depends on a token.
- `CONTACT_EMAIL` is a server-side secret declared in `astro.config.mjs`. Never give an env var a `PUBLIC_` prefix unless the value is meant to be in the page source.
- Do not add tracking scripts, analytics, or third-party services without explicit request.
- No automatic commits. Present changes for review first.


---

## Temporary Files

- `tmp/` is gitignored. Store one-off scripts and throwaway files there.
- Delete after use. Never commit anything from `tmp/`.