# Task 8 — Library Books with Redux Toolkit

The Library Books app from task 7, refactored to **Redux Toolkit** for global state and async operations.
Everything from previous homeworks still works: routing, search / filters / sorting / pagination in the URL,
CRUD, Firebase Authentication with protected routes, Open Library (Discover), PWA install, Service Worker caching and offline mode.

- Deployed app: https://alen-omarbayev.github.io/react-autumn/task8/

## Run

```bash
npm install
cp .env.example .env.local        # Firebase keys
npm run dev                       # development (Service Worker off)
npm run build && npm run preview  # production build with Service Worker
npm run deploy                    # publish to gh-pages under /task8
```

## Redux: store, slices, thunks, selectors

### Store
`src/store/store.js` — `configureStore` with three reducers; `src/main.jsx` wraps the app in `<Provider store={store}>`.

### Slices (feature-based, `src/features/`)

| Slice | File | State |
|---|---|---|
| `books` | `features/books/booksSlice.js` | `list` (current page of the Books list + its query), `all` (all books for Dashboard), `genres` |
| `bookDetails` | `features/books/bookDetailsSlice.js` | the opened book, `notFound`, `saving` (create/update/delete in progress) |
| `discover` | `features/discover/discoverSlice.js` | Open Library `search` (list) and `work` (details), `fromCache` / `cachedAt` |

Every async part has `status` (`idle | loading | succeeded | failed`) and `error`.

### Thunks (`createAsyncThunk`)

| Thunk | Type | What it does |
|---|---|---|
| `fetchBooks({ query })` | **list** | one page of books with search/filters/sort/pagination |
| `fetchAllBooks()` | list | all books for Dashboard |
| `fetchGenres()` | list | genres for the filter |
| `fetchBookById({ id })` | **details** | one book |
| `createBook(data)` | **mutation** | add a book |
| `updateBook({ id, changes })` | **mutation / business operation** | edit a book, borrow / return (status change) |
| `deleteBook(id)` | **mutation** | delete a book |
| `searchDiscover({ query, page })` | list | Open Library search |
| `fetchWork({ id })` | details | Open Library book |

All of them are handled in `extraReducers` with `pending / fulfilled / rejected`.

- **Stale requests:** `pending` saves `action.meta.requestId`; `fulfilled` / `rejected` ignore the answer if a newer request was started.
- **No unnecessary requests:** `condition` skips a thunk if the same data is already loading, or loaded, fresh (< 60 s) and not stale. `Reload` / `Try again` pass `force: true`.
- **Refresh after mutations:** `booksSlice` listens to `createBook / updateBook / deleteBook.fulfilled`, updates the loaded lists immediately and marks `list`, `all` and `genres` as `stale`; the hooks re-fetch when `stale` becomes `true`.
- **Retries:** error messages have a *Try again* button that dispatches the thunk with `force: true`.

### Selectors (`features/books/booksSelectors.js`)

| Selector | Memoized | Used in |
|---|---|---|
| `selectBooksList`, `selectAllBooks`, `selectGenres`, `selectBookDetails`, `selectBookSaving` | no (simple) | hooks |
| `selectDashboardGenres` | **createSelector** | Dashboard genre filter |
| `selectBooksByGenre` | **createSelector** | Dashboard "Books by genre" |
| `selectFilteredBooks(state, genre)` | **createSelector** | base for the two below |
| `selectDashboardStats(state, genre)` | **createSelector** | totals, average rating, years, by status, by rating |
| `selectTopRated(state, genre)` | **createSelector** | top-3 |
| `selectDiscoverSearch`, `selectDiscoverWork` | no | Discover hooks |

### Custom hooks (`src/hooks/`)
Components never call `dispatch` for data directly — they use small hooks that combine `useDispatch` + `useSelector`:
`useBooks(query)`, `useAllBooks()`, `useGenres()`, `useBook(id)`, `useBookActions()`, `useDiscoverSearch(q, page)`, `useWork(id)`,
plus `useDebounce(value, 400)` for the Books search field.

### What is NOT in Redux (on purpose)
- **Authentication** — stays in `AuthContext` (Firebase keeps the session itself).
- **Temporary UI state** — form visibility, edit mode, action error text, menu open, Dashboard genre filter — local `useState`.
- **URL state** — search, filters, sort, page live in the URL (`useSearchParams`) — Redux only stores the loaded data.

## Architecture

```
src/
  store/store.js                 configureStore
  features/books/                booksSlice, bookDetailsSlice, booksSelectors
  features/discover/             discoverSlice
  services/                      API (fake API, Open Library), Firebase auth, Service Worker registration
  hooks/                         useBooks, useBook, useDiscover, useDebounce, useOnlineStatus, useServiceWorker
  context/AuthContext.jsx        authentication
  components/, pages/, layouts/  UI only
sw/service-worker.js             Service Worker (caches prefixed with task8-)
```

TanStack Query from task 6 was removed — Redux is now the single place for server data (no duplicated state).

## PWA
Same Service Worker as task 7. Cache names now start with `task8-` and `activate` deletes only old `task8-` caches,
because Cache Storage is shared by all tasks on `alen-omarbayev.github.io`.

See `explanation.txt` for a step-by-step explanation in Russian.
