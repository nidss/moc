# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A front-end-only demo prototype of the MOC Expo 2026 event platform, built for client presentations. There is no backend. All people, shops, buyers and KPIs are fictional seed data. Anything a user enters during a demo is persisted to `localStorage`. The README (in Thai) lists every screen, its route, and the suggested demo script.

## Commands

```bash
npm install
npm run dev         # http://localhost:5173/moc/  (HashRouter: pages live at /moc/#/route)
npm run typecheck   # tsc --noEmit
npm run build       # typecheck + vite build into dist/
npm run preview
```

- There is no test suite and no linter. Verify a change with `npm run build`, then check it in a browser.
- Playwright and Chromium are preinstalled in the cloud container, so screenshots are the usual check.
- `vite.config.ts` sets `base` to `/moc/`. Override it with the `VITE_BASE` env var.
- Deploy: `.github/workflows/deploy.yml` builds and publishes to GitHub Pages (https://nidss.github.io/moc/) on every push to `main`.

## Architecture

- **Routing** (`src/App.tsx`): one route tree with three layouts.
  - `PublicLayout` covers the public site, registration, the SME Portal (`/portal/*`), survey and AI.
  - `StaffLayout` covers `/staff/*` check-in.
  - `AdminLayout` covers `/admin/*`.
  - All pages except the home page are `lazy()`.
  - Legacy `/matching/*` and `/booth` paths redirect into `/portal`.
  - `DemoNav` is the floating role/language/reset switcher, mounted on every page.
- **State** (`src/store/demoStore.ts`): a single Zustand store, persisted as `moc-expo-demo`.
  - It holds only the deltas created during a demo: registrations, check-ins, meetings, surveys, new exhibitors, `shopEdits`, booth leads and the portal login.
  - Static seed data lives in `src/data/*`.
  - `mergeExhibitors()` and the hooks in `src/store/selectors.ts` combine the seed data with the store deltas. Read derived data through these, not through raw `EXHIBITORS`/`SEED_*`, so that demo edits show up everywhere.
- **i18n** (`src/i18n/I18nProvider.tsx`): Thai is the default, English is the alternative.
  - Use `tr('ไทย', 'English')` for inline strings.
  - Use `L(text)` for `LText = {th, en}` data fields.
  - Both languages are required for any new user-facing text.
  - Thai text must not get `tracking-*` letter spacing. Apply tracking only when `lang === 'en'`.
- **Themes ("skins")** (`src/lib/skin.ts`): `classic`, `gold` and `midnight`.
  - The skin is set as the `data-skin` attribute on `<html>`. `applySkin()` runs in `main.tsx` before render.
  - Components read it with `useSkin()`.
  - Each skin overrides CSS variables at the end of `src/index.css`: colours, `--grad-*`, fonts, radius, and `.ui-card` / `.hero-photo` styling.
  - Colours must come from tokens (`bg-navy`, `text-brand`, `var(--gold)`, `.gold-gradient`, and so on), never from hard-coded classic colours. Otherwise the other themes break.
  - Gold and midnight have their own home page (`HomeGold.tsx`, `HomeMidnight.tsx`) and their own header/footer (`src/layouts/SkinChrome.tsx`).
  - `HomePage.tsx` and `PublicLayout.tsx` choose between them by skin.
  - Every other page shares one structure and only re-colours.
  - Dark mode follows `prefers-color-scheme`. Midnight is always dark, so use `isDarkSkin()` there.
- **Site version** (`src/lib/version.ts`, key `moc-demo-version`): `v1` or `v2`, independent of the skin.
  - `VersionSwitcher` sits next to the theme switcher in every public header.
  - V2 replaces the public header with `HeaderV2` (4 primary links and 3 dropdown groups defined in `src/layouts/navV2.ts`) and the home page with the compact `HomeV2`, on every skin.
  - Secondary home sections are reachable as `/guide/:topic` (`GuidePage.tsx`), which reuses the section components from `HomeExtras.tsx`.
- **Home page content**:
  - Content shared by all three home pages: `src/pages/public/homeShared.ts`, `src/data/homeContent.ts`, and the section components in `HomeExtras.tsx`.
  - Section wrappers: `Band` / `BandTitle`.
  - Scroll animations: `Reveal`, an IntersectionObserver that adds `.reveal` / `.reveal-group`. The motion keyframes live in `index.css` and are disabled under `prefers-reduced-motion`.
- **Brand assets** are in `src/assets/brand/`:
  - `moc-expo-2026.webp` / `-light.webp`: the logo. Use it through `<Logo tone>` in `components/Brand.tsx`.
  - `key-visual.webp`, `hero-bg.webp`, `hero-gold-map.webp`.
- **Exhibitor images** are in `public/images/exhibitors/<id>/`. The generation prompts are in `ASSET-PROMPTS.md` and `PRODUCT-IMAGE-PROMPTS.md`.
- **"AI" page** (`src/lib/aiConcept.ts`): rule-based answers built from local data. No LLM is called.

## Conventions

- Code comments are written in Thai (or English). Never use Japanese characters.
- `localStorage` keys use the `moc-demo-*` prefix (`-lang`, `-skin`, `-version`, `-promo-seen`, `-coupons`) or `moc-expo-demo` for the store. If you add one that should clear on reset, wire it into the DemoNav reset.
- Tailwind v4: tokens are declared in the `@theme inline` block in `src/index.css`. The important modifier is a suffix, for example `text-white!`.
