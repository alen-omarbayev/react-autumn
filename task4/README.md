# Task 4 — Library Books (Async React)

A React app for a small library. It works with a fake async API (`src/api/fakeApi.js`) that uses Promises, random delays (0.5–3 s), random errors (10%) and stores data in `localStorage`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173/react-autumn/task4/
npm run deploy   # builds and publishes to gh-pages under /task4
```

## Features

- The book list loads with `useEffect`, and the **Reload** button loads it again.
- Click a book to load its details (8 fields: title, description, author, genre, year, pages, rating, status).
- Create, Edit and Delete books.
- **Mark as borrowed / available** changes the status through `updateItem`.
- Every part has loading, error (with Try again), empty and success states.

## Changes in the fake API

- `createItem` saves all fields from the form, not only `name` and `description`.
- `getItemsList` returns only short fields (id, name, author, status), so the full details come from `getItem`.
- Components never touch `localStorage`; only the API does.

## useEffect, dependencies and cleanup

- List effect: dependency `[reloadCount]`. Reload does `reloadCount + 1`, so the effect runs again.
- Details effect: dependencies `[selectedId, detailsReloadCount]`. It runs again when another book is selected.
- Both effects have a local `let ignore = false`, and the cleanup sets `ignore = true`. When the dependency changes, React runs the cleanup of the old effect first, so the old request's answer is ignored.

## Race conditions

Click book A, then quickly click book B. A's request may finish after B's. A's effect was already cleaned up (`ignore = true`), so its answer is ignored and only B's details are shown. `BookDetails` also checks `details.id !== selectedId`, so old details are never shown, not even for one render.

## Stale closures

In `handleToggleStatus`, the `id` and the new status are saved in local variables at the moment of the click. While the request runs, the user can select another book, but:

- the list is updated with `setBooks(prev => prev.map(...))` by `updated.id`, so the right book changes;
- the details are updated with `setDetails(prev => prev && prev.id === updated.id ? updated : prev)`, so another open book is not overwritten;
- `busyId` disables Change status / Edit / Delete while a request runs, so actions cannot conflict.

The same idea is used in Edit and Delete (`setSelectedId(prev => prev === id ? null : prev)`).

## Demo with delays

To make the delays easier to see, set `minDelay: 2000, maxDelay: 6000` in `src/api/settings.js`. You can also set `errorChance: 0.5` to see the error states more often.
