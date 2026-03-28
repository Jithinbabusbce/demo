# Gully World Platform

Gully World is a React + TypeScript sports platform built with Vite.

It includes:
- tournaments, events, challenges, auctions, and player pages
- marketplace hiring/seller flow with advanced filtering
- turf partner flow (book turf and register turf)
- pricing page, store coming soon page, and support chat assistant

## Tech Stack

- React 18
- TypeScript
- Vite 5
- React Router v6

## Prerequisites

- Node.js 20+
- npm 10+

## Install

From the project root:

```bash
npm install
```

## Run (Development)

```bash
npm run dev
```

After running, open the local URL shown in terminal (usually `http://localhost:5173`).

## Build (Production)

```bash
npm run build
```

This performs TypeScript checks and creates optimized output in `dist/`.

## Preview Production Build

```bash
npm run preview
```

Use this to verify the production bundle locally.

## Useful Pages

- Home: `/`
- Marketplace: `/marketplace`
- Turf Partner: `/turf-partner`
- Pricing: `/pricing`
- Store (Coming Soon): `/store`
- Contact: `/contact`

## Access and Usage Notes

- Top filter bar works on feature pages (search, sort, sport, date, clear filter).
- Marketplace has dedicated filtering for role, level, service tier, budget, and sort.
- Turf page has two tabs:
  - Book Turf
  - Register Turf
- Support chat widget is at bottom-right.

## Troubleshooting

- If VS Code still shows stale TypeScript import warnings but build is passing:
  1. Run `npm run build` to verify actual compile status.
  2. In VS Code, run "TypeScript: Restart TS Server".
  3. Reload window if needed.

## Scripts

- `npm run dev` - start development server
- `npm run build` - compile and build production bundle
- `npm run preview` - preview production build locally
