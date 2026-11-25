// СЕЛЕКТОРЫ - функции, которые достают нужные данные из store.
// Компоненты не лезут в state напрямую, а вызывают useSelector(selectXxx).
import { createSelector } from '@reduxjs/toolkit'

// ---------- ПРОСТЫЕ селекторы (просто берут кусок state) ----------

export const selectBooksList = (state) => state.books.list
export const selectAllBooksState = (state) => state.books.all
export const selectAllBooks = (state) => state.books.all.items
export const selectGenres = (state) => state.books.genres.items
export const selectGenresStale = (state) => state.books.genres.stale
export const selectBookDetails = (state) => state.bookDetails
export const selectBookSaving = (state) => state.bookDetails.saving

// ---------- МЕМОИЗИРОВАННЫЕ селекторы (createSelector) ----------
// createSelector запоминает результат. Если входные данные (список книг, жанр) не поменялись,
// он НЕ считает заново, а отдаёт прошлый результат. Это быстрее и не вызывает лишних перерисовок.

// жанр передаём вторым аргументом: useSelector((state) => selectDashboardStats(state, genre))
const selectGenreArg = (state, genre) => genre

// 1) Список жанров из всех книг, по алфавиту (для select на Dashboard)
export const selectDashboardGenres = createSelector([selectAllBooks], (books) =>
  [...new Set(books.map((book) => book.genre))].sort(),
)

// 2) Разбивка по жанрам: [{ name: 'Fantasy', count: 4 }, ...]
export const selectBooksByGenre = createSelector([selectAllBooks, selectDashboardGenres], (books, genres) =>
  genres.map((genre) => ({
    name: genre,
    count: books.filter((book) => book.genre === genre).length,
  })),
)

// 3) Книги после фильтра по жанру ('' = все)
export const selectFilteredBooks = createSelector([selectAllBooks, selectGenreArg], (books, genre) =>
  genre ? books.filter((book) => book.genre === genre) : books,
)

// 4) Вся статистика для Dashboard (считается от отфильтрованных книг)
export const selectDashboardStats = createSelector([selectFilteredBooks], (books) => {
  const total = books.length
  const available = books.filter((book) => book.status === 'available').length
  const borrowed = total - available
  const years = books.map((book) => book.year)

  return {
    total,
    available,
    borrowed,
    totalPages: books.reduce((sum, book) => sum + book.pages, 0),
    avgRating: total > 0 ? books.reduce((sum, book) => sum + book.rating, 0) / total : 0,
    oldest: total > 0 ? Math.min(...years) : '—',
    newest: total > 0 ? Math.max(...years) : '—',
    byStatus: [
      { name: 'available', count: available },
      { name: 'borrowed', count: borrowed },
    ],
    byRating: [
      { name: '4.5 and higher', count: books.filter((book) => book.rating >= 4.5).length },
      { name: '4.0 – 4.4', count: books.filter((book) => book.rating >= 4 && book.rating < 4.5).length },
      { name: 'below 4.0', count: books.filter((book) => book.rating < 4).length },
    ],
  }
})

// 5) Топ-3 по рейтингу (с учётом фильтра)
export const selectTopRated = createSelector([selectFilteredBooks], (books) =>
  [...books].sort((a, b) => b.rating - a.rating).slice(0, 3),
)
