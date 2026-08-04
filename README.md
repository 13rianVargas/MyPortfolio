# Portfolio | 13rian Vargas

Personal portfolio. Static Astro site deployed on Vercel, with a single
on-demand endpoint for the contact form.

🔗 **Live:** [13rian-vargas.vercel.app](https://13rian-vargas.vercel.app/)

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro 5 (static output, one on-demand route) |
| Styling | Plain CSS with custom properties — no framework |
| Language | TypeScript |
| Type | Space Grotesk Variable, self-hosted via Fontsource |
| Package manager | pnpm |
| Deploy | Vercel (`@astrojs/vercel`) |
| Contact form | FormSubmit, called server-side from `/api/contact` |

## Features

- **Interactive 3D identity card** — CSS 3D transforms with a flip, flattened
  on touch devices where the tilt reads as a rendering glitch.
- **Interactive ripple background** — pointer-driven CSS ripples, disabled
  under `prefers-reduced-motion`.
- **i18n in 4 languages** (en/es/fr/pt) via a client-side dictionary.
  `<html lang>`, `<title>` and the meta description update on switch.
  *Translation is client-side, so search engines index one version; real
  localized routes would be the next step.*
- **Theme** — light/dark, with an explicit choice persisted in `localStorage`
  and the OS setting as fallback. Resolved before first paint, so no flash.
- **Server-side contact form** — `/api/contact` keeps the destination address
  in an env var, validates input, applies a per-IP throttle and screens a
  honeypot before calling FormSubmit. Nothing sensitive reaches the browser.
- **Accessibility** — every text/background pair meets WCAG AA, verified by
  measurement in both themes; visible focus rings, skip link, semantic
  landmarks.
- **Images** — served through `astro:assets` as responsive WebP.

## Project Structure

```text
src/
├── assets/            # profile photo + project covers (build-optimized)
├── components/
│   ├── sections/      # 1-Header … 9-Footer, in render order
│   └── tools/         # logo, language select, theme toggle
├── i18n/              # dictionaries (ui.ts) + runtime translator
├── layouts/           # Layout.astro — head, SEO, theme bootstrap
├── pages/
│   ├── api/contact.ts # the only on-demand route
│   └── index.astro
└── styles/global.css  # design tokens, single source of truth
```

## Local Setup

```bash
pnpm install
pnpm exec astro dev
```

Create a `.env` (gitignored) with:

```bash
CONTACT_EMAIL=your@email.com
```

The same variable must exist in Vercel → Settings → Environment Variables.
It is declared as a secret in `astro.config.mjs`, so Astro reads it at runtime
and never inlines it into a bundle. **Do not prefix it with `PUBLIC_`** — that
prefix is an instruction to ship the value to the browser.

## Conventions

- All user-facing text lives in `src/i18n/ui.ts` and must exist in all four
  languages. Key parity is easy to break; check it when editing.
- Design tokens belong in `src/styles/global.css`. Component `<style>` blocks
  are scoped, but `:root` selectors inside them leak globally — don't put them
  there.
- Project data is local (`4-Projects.astro`), not fetched from the GitHub API,
  so the build never depends on a token or on a repo not having been renamed.
- Conventional Commits, English, lowercase.

---

Built by [13rian Vargas](https://github.com/13rianVargas)
