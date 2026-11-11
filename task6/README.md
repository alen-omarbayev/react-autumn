# Task 6 — Library Books (Server Data, Caching & Firebase Auth)

The Library Books app from task 5 + **Firebase Authentication** + **TanStack Query** caching.
All routes, filters, sorting, pagination and CRUD from task 5 still work.

- Deployed app: https://alen-omarbayev.github.io/react-autumn/task6/

## Run

```bash
npm install
cp .env.example .env.local   # then put your Firebase keys into .env.local
npm run dev                  # http://localhost:5173/react-autumn/task6/
npm run deploy               # builds and publishes to gh-pages under /task6
```

### Firebase setup

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Authentication → Sign-in method → enable **Email/Password** and **Google**.
3. Project settings → Your apps → add a **Web app** and copy the config into `.env.local`.
4. Authentication → Settings → Authorized domains → add `alen-omarbayev.github.io` (for the deployed version).

`.env.local` is in `.gitignore`. `.env.example` shows which variables are needed:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | public |
| `/about` | About | public |
| `/books` | Books list (search, filters, sort, pagination in the URL) | public |
| `/books/:id` | Book details, edit, delete | public |
| `/login` | Email/password login + Google sign-in | public |
| `/signup` | Email, password, confirm password + validation | public |
| `/dashboard` | Statistics | **protected** |
| `/profile` | User email, UID, logout | **protected** |
| `*` | 404 | public |

Not logged in users who open a protected page are redirected to `/login`, and after login they go back to that page.
The NavBar shows **Login / Sign up** for guests and **Profile / Logout** for logged in users.

## Authentication

- `src/firebase.js` — initializes Firebase with `import.meta.env.VITE_*` variables.
- `src/services/authService.js` — signup, login, Google sign-in, logout, error messages.
- `src/context/AuthContext.jsx` — `AuthProvider` + `useAuth()`. Uses `onAuthStateChanged` to track the user,
  has `loading` (while Firebase restores the session) and `error`.
- Sessions persist after refresh: `setPersistence(auth, browserLocalPersistence)`.
- `src/components/ProtectedRoute.jsx` — waits for `loading`, then shows the page or redirects to `/login`.

## Caching strategy (TanStack Query)

**Query keys** (`src/services/queryClient.js`):

| Key | Data |
|---|---|
| `['books', '?page=2&genre=Fantasy&limit=6']` | one page of the books list (every filter/page combination has its own cache entry) |
| `['books', '?limit=1000']` | all books for the Dashboard |
| `['book', '3']` | one book |
| `['genres']` | list of genres for the filter |

**Expiration / revalidation:**

- `staleTime: 60s` — for 1 minute data is "fresh": going back to a page shows it from the cache with no request.
- After 1 minute data becomes "stale": it is still shown instantly from the cache, but refetched in the background
  (on page open and when you come back to the browser tab — `refetchOnWindowFocus`).
- Genres: `staleTime: 5 min` (they rarely change).
- `gcTime: 5 min` — unused cache entries are deleted after 5 minutes.
- The **Reload** button calls `refetch()` and always goes to the server.

**When the cache is invalidated:**

| Action | What happens with the cache |
|---|---|
| Create book | `invalidateQueries(['books'])` + `invalidateQueries(['genres'])`, new book is put into `['book', id]` |
| Update book (edit / change status) | `['book', id]` is updated with the server response, `['books']` and `['genres']` are invalidated |
| Delete book | `['book', id]` is removed, `['books']` and `['genres']` are invalidated |

`invalidateQueries(['books'])` marks **all** lists as stale (all pages, all filters and the Dashboard), because
`['books']` is the beginning of all their keys.

**Outdated requests:** every filter/page combination has its own query key, so a slow answer for an old search
is saved only under its old key and can never replace the result of the newer search on the screen.
`placeholderData: keepPreviousData` keeps the previous page visible while the next one is loading.

Loading, error (with **Try again**) and empty states are handled on Books, Book details and Dashboard pages.

## Structure

```
src/
  firebase.js            Firebase init (env variables)
  App.jsx                only routes
  main.jsx               QueryClientProvider + AuthProvider
  context/AuthContext    AuthProvider, useAuth
  layouts/RootLayout     NavBar + <Outlet /> + <Suspense>
  components/            NavBar, ProtectedRoute, BookCard, BookForm, Pagination, ErrorMessage
  pages/                 Home, About, Books, BookDetails, Dashboard, Login, Signup, Profile, NotFound
  hooks/                 useBooks (list + genres), useBook, useBookMutations (create/update/delete)
  services/              service.js (fake API), authService.js, queryClient.js, settings.js, initialData.js
  styles/index.css
```

Components never use `localStorage`, Firebase or the API directly — only through hooks and services.

See `explanation.txt` for a step-by-step explanation (in Russian).
