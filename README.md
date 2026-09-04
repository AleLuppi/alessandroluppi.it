# alessandroluppi.it

Personal site of Alessandro Luppi — a single scroll-driven landing page in
English and Italian, plus a small game hidden at the bottom of it.

It is deliberately a teaser rather than a CV: it says what I work on and
sends anyone who wants more to LinkedIn.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | [Nuxt 4](https://nuxt.com) | Vue with routing, head management and prerendering already solved |
| Rendering | Static generation | Every route is HTML at build time; no request-time work |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org) | English at `/`, Italian at `/it`, with hreflang handled for us |
| Styling | Plain CSS with custom properties | The animation is bespoke; utilities would add weight without leverage |
| Fonts | [@nuxt/fonts](https://fonts.nuxt.com) | Self-hosts Inter: no third-party request, no webfont layout shift |
| Hosting | [Vercel](https://vercel.com) | Static output served from the CDN |

There is no animation library. The scroll narrative is about 200 lines of
CSS driven by a handful of numbers — see below.

## Getting started

Requires Node 20.19+ and pnpm 10+.

```bash
pnpm install
pnpm dev
```

| Command | Does |
| --- | --- |
| `pnpm dev` | Development server on `localhost:3000` |
| `pnpm generate` | Prerender every route to `.output/public` |
| `pnpm preview` | Serve the generated output locally |
| `pnpm lint` | ESLint over the whole project (`lint:fix` to autofix) |
| `pnpm typecheck` | Type-check without emitting |

## Layout

```text
app/
  components/     TheStage and its devices, the game, site chrome
  composables/    useScrollStage, useReducedMotion
  pages/          index (landing), play (the game)
  utils/          motion helpers, game round data
  assets/css/     design tokens and global styles
i18n/locales/     en.json, it.json — all user-facing copy
shared/utils/     constants used by both the app and server routes
server/routes/    llms.txt
scripts/          SVG sources for the social card
```

## How the scroll narrative works

The landing page is one sticky viewport that five acts play out inside.
Understanding two decisions explains most of the code.

**Scroll position becomes CSS custom properties, not styles.** A tall track
holds a sticky pin. As the track scrolls past, `useScrollStage` maps how far
it has travelled onto named acts and writes each act's 0–1 progress to a
custom property — `--p-fold`, `--p-close`, and so on. That is the only
per-frame JavaScript. Every transform, opacity and clip that reacts lives in
CSS and runs on the compositor. Layout is read on mount and on resize only.

**The animation is an enhancement, never a requirement.** The default
styles are an ordinary stacked document: that is what ships in the
prerendered HTML, what a crawler reads, and what anyone who prefers reduced
motion sees. The pinned version is layered on top only after the client
confirms motion is welcome. If JavaScript never runs, the page is still
complete and in a sensible reading order.

The fold — where the viewport narrows into a laptop screen — is a
`clip-path`, not a resize. The screen layer covers the viewport and is
clipped inward to a measured rectangle, so nothing is scaled and no layout
is recomputed mid-transition, and the text inside stays as crisp as it
started.

To retime the narrative, edit the `acts` array in
`app/components/TheStage.vue`. Ranges are fractions of the total track and
may overlap; the tail after the last act is a deliberate hold so the closing
composition rests before the pin releases.

## Editing content

All user-facing text lives in `i18n/locales/en.json` and
`i18n/locales/it.json`. Both files must have the same shape — a key present
in one and missing from the other will fall back rather than fail loudly.

The game's structure is separate from its words: rounds, probabilities and
the character slot each round fills are in `app/utils/game.ts`, while the
prompts, candidate labels and reveals are in the locale files under `game`.
Adding a round means adding an entry in both places.

`/llms.txt` is generated from `en.json` at build time, so the machine-
readable summary cannot drift from what visitors are told. It has no copy of
its own to maintain.

## Adding a language

1. Add the locale to `i18n.locales` in `nuxt.config.ts`.
2. Copy `i18n/locales/en.json` to the new code and translate it.
3. Add the new routes to `nitro.prerender.routes`.

hreflang, the sitemap and the language switcher all derive from that config
and need no further changes.

## Regenerating the social card and icons

`public/og.png` and `public/apple-touch-icon.png` are committed, so no build
or deploy depends on rendering them. The SVG sources are
`scripts/og-image.svg` and `public/favicon.svg`. To regenerate after an
edit, rasterise them at 1200×630 and 180×180 with any tool that honours the
viewBox. The committed PNGs were produced with:

```js
// pnpm add -D @resvg/resvg-js, in a scratch directory
import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const svg = readFileSync('scripts/og-image.svg', 'utf8')
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica Neue' },
})
writeFileSync('public/og.png', resvg.render().asPng())
```

The rasteriser is deliberately not a project dependency: it would be
installed on every `pnpm install` to serve a task that runs once a year.

## Deploying

Vercel builds from `vercel.json`: `pnpm install --frozen-lockfile` then
`pnpm build`. Only `main` produces a production deployment.

Security headers and cache policy are declared as `routeRules` in
`nuxt.config.ts` rather than in `vercel.json`, so they travel with the app
if it ever moves host. The content security policy applies in production
only — in development `connect-src 'self'` would block Vite's HMR socket.

## Notes

This site was designed and written by an AI agent working from a brief, and
reviewed line by line. The page says so itself; it is part of what the site
is about.

## License

[MIT](LICENSE)
