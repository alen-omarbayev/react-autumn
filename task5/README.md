# Task 5 — Library Books (Routing & Architecture)

The Library Books app from task 4, split into pages with **React Router**.

## Run

```bash
npm install
npm run dev      # http://localhost:5173/react-autumn/task5/
npm run deploy   # builds and publishes to gh-pages under /task5
```

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/books` | Books list (search, filters, sort, pagination in the URL) |
| `/books/:id` | Book details |
| `/dashboard` | Dashboard with statistics |
| `/login` | Login placeholder |
| `*` | 404 Not Found |

The app uses `HashRouter`, so URLs look like `.../task5/#/books/3`. This way direct links and page refresh work on GitHub Pages.

## Structure

```
src/
  App.jsx              only routes
  main.jsx
  layouts/RootLayout   NavBar + <Outlet /> + <Suspense>
  components/          NavBar, BookCard, BookForm, Pagination, ErrorMessage
  pages/               Home, About, Books, BookDetails, Dashboard, Login, NotFound
  hooks/               useBooks, useBook
  services/            service.js (fake API), settings.js, initialData.js
  styles/index.css
  assets/books.svg
```

See `EXPLANATION.txt` for a step-by-step explanation (in Russian).
