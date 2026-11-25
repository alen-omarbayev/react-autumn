import { useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useAllBooks } from '../hooks/useBooks.js'
import {
  selectDashboardGenres,
  selectBooksByGenre,
  selectDashboardStats,
  selectTopRated,
} from '../features/books/booksSelectors.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

function DashboardPage() {
  // Все книги загружает хук (thunk fetchAllBooks). После create/update/delete они помечаются stale
  // и перезагружаются сами.
  const { books: allBooks, loading, error, reload } = useAllBooks()

  // Интерактивный фильтр: какой жанр смотрим ('' = все). Это временное UI-состояние -> useState
  const [genre, setGenre] = useState('')

  // Вся статистика считается в МЕМОИЗИРОВАННЫХ селекторах (createSelector).
  // Пересчёт только если поменялись книги или выбранный жанр.
  const genres = useSelector(selectDashboardGenres)
  const byGenre = useSelector(selectBooksByGenre)
  const stats = useSelector((state) => selectDashboardStats(state, genre))
  const topBooks = useSelector((state) => selectTopRated(state, genre))

  // хуки (useSelector) всегда вызываются ДО return - это правило React
  if (error) {
    return <ErrorMessage text={error} onRetry={reload} />
  }
  if (loading && allBooks.length === 0) {
    return <p className="message">Loading dashboard...</p>
  }
  if (allBooks.length === 0) {
    return (
      <p className="message">
        No books yet. <Link to="/books">Add the first one</Link>
      </p>
    )
  }

  const { total, available, borrowed, totalPages, avgRating, oldest, newest, byStatus, byRating } = stats

  // ширина полоски в процентах
  function percent(count, all) {
    return all > 0 ? Math.round((count / all) * 100) : 0
  }

  return (
    <section>
      <div className="page-header">
        <h1>Dashboard</h1>
        <div className="header-buttons">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <button onClick={reload}>Reload</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Books</span>
        </div>
        <div className="stat">
          <span className="stat-value">{available}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat">
          <span className="stat-value">{borrowed}</span>
          <span className="stat-label">Borrowed</span>
        </div>
        <div className="stat">
          <span className="stat-value">{avgRating.toFixed(2)}</span>
          <span className="stat-label">Average rating</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totalPages}</span>
          <span className="stat-label">Total pages</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {oldest} – {newest}
          </span>
          <span className="stat-label">Years</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2>Books by genre</h2>
          {byGenre.map((item) => (
            <div key={item.name} className={item.name === genre ? 'bar-row selected' : 'bar-row'}>
              <Link to={`/books?genre=${encodeURIComponent(item.name)}`}>{item.name}</Link>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${percent(item.count, allBooks.length)}%` }} />
              </div>
              <span>{item.count}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>By status {genre && `(${genre})`}</h2>
          {byStatus.map((item) => (
            <div key={item.name} className="bar-row">
              <Link to={`/books?status=${item.name}${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}>{item.name}</Link>
              <div className="bar">
                <div className={`bar-fill ${item.name}`} style={{ width: `${percent(item.count, total)}%` }} />
              </div>
              <span>{item.count}</span>
            </div>
          ))}

          <h2 className="second-title">By rating</h2>
          {byRating.map((item) => (
            <div key={item.name} className="bar-row">
              <span>{item.name}</span>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${percent(item.count, total)}%` }} />
              </div>
              <span>{item.count}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Top rated {genre && `(${genre})`}</h2>
          <ol className="top-list">
            {topBooks.map((book) => (
              <li key={book.id}>
                <Link to={`/books/${book.id}`}>{book.name}</Link> — ⭐ {book.rating}
              </li>
            ))}
          </ol>
          <Link to="/books?sort=rating-desc" className="button">
            See all by rating
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
