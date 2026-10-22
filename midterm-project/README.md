# Midterm — Movie Tracker

A React single-page app to keep track of movies: browse a catalogue of 120+ films, search, filter, sort, open a movie's page, mark it as *Want to watch / Watching / Watched*, and add your own movies.

**Live demo:** https://alen-omarbayev.github.io/react-autumn/midterm-project/

## Features

- Movie list with **search** (title or director), **filters** (genre, status), **sorting** (title, rating, year) and **pagination** (12 per page)
- **Detail page** for every movie with status buttons
- **Controlled form** with validation for adding a new movie
- **Loading, error, empty and success** states everywhere data is loaded
- Responsive dark theme

## Data source — simulated API

`src/api/moviesApi.js` acts like a real backend:

- every function returns a **Promise** and answers after a random **300–1000 ms delay**;
- data lives in **localStorage**; on first launch it is seeded from `src/data/movies.json` (122 movies);
- search, filtering, sorting and pagination happen "on the server" (inside `getMovies`);
- typing `error` in the search box makes the API throw, which shows the error state.

| Function | Acts like |
| --- | --- |
| `getMovies({ search, genre, status, sortBy, page })` | `GET /movies?...` |
| `getMovieById(id)` | `GET /movies/:id` |
| `createMovie(data)` | `POST /movies` |
| `updateMovieStatus(id, status)` | `PATCH /movies/:id` |

## Component tree and state

```
main.jsx (HashRouter)
└── App
    ├── Header
    └── Routes
        ├── MoviesPage          search, genre, status, sortBy, page,
        │   │                   movies, total, totalPages, isLoading, errorMessage, reloadKey
        │   ├── SearchBar
        │   ├── Filters
        │   ├── StatusMessage   (loading / error / empty)
        │   ├── MovieList
        │   │   └── MovieCard
        │   │       └── StatusBadge
        │   └── Pagination
        ├── MovieDetailPage     movie, isLoading, errorMessage, isSaving
        │   ├── StatusMessage
        │   └── StatusBadge
        └── AddMoviePage        isSaving, errorMessage
            └── MovieForm       one state per field + errors
```

- `App` has no state: each page owns the data it needs.
- `SearchBar`, `Filters`, `Pagination`, `MovieList` and `MovieCard` have no state of their own. They get values and callbacks through props.
- Effects that load data use an `ignore` flag in their cleanup, so an old (slow) response never overwrites a newer one.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)

```bash
npm run deploy   # builds and publishes dist/ to the gh-pages branch under /midterm-project
```

## Tech

React 19, React Router (HashRouter), Vite, plain CSS.
