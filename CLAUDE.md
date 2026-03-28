# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # TypeScript check + Vite production build → dist/
npm run lint       # ESLint (flat config) on all .ts/.tsx files
npm run preview    # Preview production build locally
```

No test framework is configured. There are no unit or e2e tests.

## Tech Stack

- **React 19** + **TypeScript 5.9** + **Vite 5**
- **React Router v7** (BrowserRouter, client-side only)
- **CSS Modules** with `camelCaseOnly` convention (configured in `vite.config.ts`)
- **Design tokens** in `src/styles/tokens.css` (CSS custom properties)
- No backend — all data is mock/hardcoded, auth is demo-only
- ESM (`"type": "module"` in package.json)

## Architecture

Single-page demo/MVP for "Gully World," a sports platform.

### App.tsx (~105 lines)
Slim root component containing only:
- Route definitions with `React.lazy` code splitting (12 lazy-loaded pages, HomePage eager)
- `<Suspense>` wrapper for lazy routes
- User auth state (`useState` with lazy localStorage initializer)
- Notification state + `addNotification`, `loginUser`, `logoutUser` functions
- Layout shell: `Header` → `SubpageSearchBar` → `<main>` Routes → `SupportChatWidget` → `Footer`

### Component Structure

```
src/
  components/
    layout/   Header.tsx, Footer.tsx, ScrollToTop.tsx
    ui/       BrandWordmark.tsx, AppStoreBadges.tsx, SocialIcon.tsx,
              InfoCard.tsx, StatusBadge.tsx, EmptyState.tsx
    chat/     SupportChatWidget.tsx
    search/   SubpageSearchBar.tsx
  hooks/      useLocalStorage.ts, useCity.ts (+ index.ts barrel)
  types/      index.ts (Notification, User)
  data/       navigation.ts, events.ts, challenges.ts, players.ts
  pages/      HomePage.tsx + 13 page components
  styles/     tokens.css, global.css, animations.css, accessibility.css
```

### CSS Architecture
- Each component has a co-located `.module.css` file (e.g., `Header.module.css`)
- Shared page hero styles in `src/pages/SubpageHero.module.css` (used by list pages via `composes`)
- Global styles: `src/styles/global.css` (page-shell, sr-only, shared width constraints)
- Animations: `src/styles/animations.css` (13 @keyframes)
- Accessibility: `src/styles/accessibility.css` (focus-visible, reduced-motion, skip-link)
- Design tokens: `src/styles/tokens.css` (colors, spacing, typography, radii, shadows, z-index)
- Import chain in `index.css`: tokens → accessibility → global → animations
- `src/App.css` still exists with legacy styles but components import their own modules

### Shared UI Components
- **InfoCard** — Used by 7 list pages (Tournament, Challenges, Players, Teams, Events, Auction, TurfPartner). Accepts `title`, `badge`, `meta`, `description`, `action`, `children` props.
- **StatusBadge** — Sport tag / status badge with `variant` prop ('sport' | 'status' | 'live')
- **EmptyState** — Empty filtered results message
- **SubpageSearchBar** — Config-driven filter bar. Reads `pageSearchConfig` to show sport/sort/date filters per route. Filter state derived from URL params via `useMemo`.

### Custom Hooks
- **useLocalStorage<T>(key, initial)** — Generic localStorage-synced state
- **useCity(default)** — City state from `gullyworld-city` localStorage key. Used by HomePage and FeedPage.

### Data Flow
- Mock data in `src/data/` (events, challenges, players, navigation config)
- User/notification state in App.tsx, passed as props to Header and FeedPage
- City state via `useCity` hook (Header manages its own city state for the location picker)
- localStorage keys: `gullyworld-user`, `gullyworld-notifications`, `gullyworld-city`

**Routing** (14 routes, all in App.tsx):
`/` `/tournament` `/challenges` `/players` `/teams` `/events` `/auction` `/marketplace` `/feed` `/store` `/pricing` `/turf-partner` `/contact` `/login`

## CSS Module Convention

Vite is configured with `css.modules.localsConvention: 'camelCaseOnly'`:
- CSS class `.foo-bar` → `styles.fooBar` in TSX
- Import: `import styles from './Component.module.css'`
- Conditional classes: `` className={`${styles.foo}${active ? ` ${styles.active}` : ''}`} ``

## Adding a New Page

1. Create `src/pages/NewPage.tsx` with a default export component
2. Create `src/pages/NewPage.module.css` for scoped styles
3. In `src/App.tsx`, add a lazy import: `const NewPage = lazy(() => import('./pages/NewPage'))`
4. Add a `<Route>` inside the `<Suspense>` wrapper
5. Optionally add nav links in `src/data/navigation.ts` (`menuGroups` or `quickAccessActions`)
6. For a list page with hero banner, import `heroStyles from './SubpageHero.module.css'` and use an existing hero variant or add one

## TypeScript Config

Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`. Target ES2023. JSX transform is `react-jsx` (no `import React` needed).

## External API

The only external API call is to Nominatim (OpenStreetMap) for reverse geocoding in the Header location picker.
