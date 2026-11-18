# Task 7 — Library Books PWA

The Library Books app from task 6, converted into an **installable Progressive Web App** that works offline and on phones.
Everything from previous homeworks still works: routes, filters, pagination, CRUD, TanStack Query cache, Firebase Auth.

- Deployed app: https://alen-omarbayev.github.io/react-autumn/task7/

## Run

```bash
npm install
cp .env.example .env.local   # Firebase keys (see task 6)
npm run dev                  # development, Service Worker is OFF here
npm run build && npm run preview   # production build WITH Service Worker -> http://localhost:4173/react-autumn/task7/
npm run deploy               # build + publish to gh-pages under /task7
```

## What was added

| Requirement | Where |
|---|---|
| Manifest (name, short_name, start_url, scope, display standalone, colors) | `public/manifest.json` |
| Icons 192×192 and 512×512 | `public/icons/` |
| Manifest linked | `index.html` |
| Service Worker (install / activate / fetch / message) | `sw/service-worker.js` → built into `dist/sw.js` |
| Pre-cache of built JS/CSS, icons, offline page | file list generated in `vite.config.js` |
| Registration + update banner | `src/services/serviceWorker.js`, `src/hooks/useServiceWorker.js`, `src/components/UpdateBanner.jsx` |
| Public API (list + details) | Discover page: `/discover`, `/discover/:workId` (Open Library) |
| "Cached data" notice | `src/components/CachedNotice.jsx` |
| Offline page | static `public/offline.html` + React route `/offline` (`src/pages/OfflinePage.jsx`) |
| Online/offline indicator | `src/components/OnlineIndicator.jsx` (navbar), `OfflineBar.jsx` |
| Mobile layout from 320px, hamburger menu | `src/components/NavBar.jsx`, `src/styles/index.css` |

## Service Worker

Written by hand (no Workbox) so every step is visible.

**Caches**

| Cache | What | Strategy | Limit |
|---|---|---|---|
| `shell-<version>` | index.html, JS, CSS, icons, manifest, offline.html | pre-cached on install | replaced by every new version |
| `images-v1` | book covers, icons | **cache-first** | max 60 entries |
| `api-v1` | Open Library `search.json` and `works/<id>.json` | **network-first** | max 50 entries, 1 day |

**Lifecycle**

1. `install` — downloads all build files into `shell-<version>`. Does **not** call `skipWaiting()`, so the new version waits.
2. The app sees the waiting worker and shows **"A new version of the app is available → Update now"**.
3. Click → app sends `SKIP_WAITING` → the new worker activates.
4. `activate` — deletes every cache that is not used by this version (old `shell-...`), calls `clients.claim()`.
5. `controllerchange` in the app → page reloads once with new files. No need to clear browser storage.

The version is the build time, created by the small plugin in `vite.config.js`, so every `npm run build` produces a new version.

**Fetch rules**

- not GET → network only
- Firebase / Google hosts (auth, tokens, user data) → never cached
- page navigation → network, offline → cached `index.html`, unknown page → `offline.html`
- `openlibrary.org` → network-first; offline answer gets `_fromCache` + `_cachedAt`, the UI shows "You are viewing cached data"
- images / covers → cache-first
- own JS/CSS → shell cache, then network

## Offline behaviour

- Library pages (Books, details, Dashboard, create/edit/delete) work offline — data lives in localStorage (fake API).
- Discover searches and book pages opened before are shown from cache with a "cached data" notice.
- Not saved Discover pages show the offline page with **Retry connection** (real request, not only `navigator.onLine`).
- The navbar shows Online / Offline; a red bar appears while offline.

## How to test

1. `npm run build && npm run preview`, open the app, search something on Discover, open a book.
2. DevTools → Application → Service Workers / Cache Storage: see `shell-…`, `images-v1`, `api-v1`.
3. DevTools → Network → **Offline**, reload: the app still opens, Discover shows cached data with the notice.
4. Search something new while offline → offline page with Retry.
5. Change code, `npm run build`, reload → "Update now" banner.
6. DevTools → Application → Manifest: installable; Chrome shows the install icon in the address bar.
7. DevTools device toolbar: iPhone SE (320/375px), rotate to landscape.

See `explanation.txt` for a step-by-step explanation in Russian.
