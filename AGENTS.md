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
| Framework | Astro 5.x |
| Styling | Tailwind CSS 4.x |
| Language | TypeScript |
| Scripting | Bun |
| Package manager | pnpm |
| Deploy | Vercel |
| External data | GitHub API (dynamic project listing) |

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

- Interactive 3D identity card (CSS transforms + device orientation).
- Dynamic water ripple background.
- i18n: English, Spanish, French, Portuguese via custom translation system.
- Projects fetched dynamically from GitHub API (real-time stars, language, metadata).
- Dark/light mode via CSS variables + localStorage.
- Astro partial hydration for performance.

---

## Conventions

- i18n: all user-facing text must exist in all 4 languages (`en`, `es`, `fr`, `pt`) in `src/i18n/`.
- Components go in `src/components/sections/` for page sections.
- Use Tailwind utility classes — no inline styles.
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
- GitHub API calls are unauthenticated — rate limits apply. Do not add unnecessary fetches.
- Do not add tracking scripts, analytics, or third-party services without explicit request.
- No automatic commits. Present changes for review first.
