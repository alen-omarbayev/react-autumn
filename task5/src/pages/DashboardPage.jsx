import { useState } from 'react'
import { Link } from 'react-router'
import useBooks from '../hooks/useBooks.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

function DashboardPage() {
  // Берём из API все книги (limit большой) и считаем статистику сами
  const { result, loading, error, reload } = useBooks('?limit=1000')

  // Интерактивный фильтр: какой жанр смотрим ('' = все)
  const [genre, setGenre] = useState('')

  if (loading) {
    return <p className="message">Loading dashboard...</p>
  }
  if (error) {
    return <ErrorMessage text={error} onRetry={reload} />
  }

  const allBooks = result.data
  if (allBooks.length === 0) {
    return (
      <p className="message">
        No books yet. <Link to="/books">Add the first one</Link>
      </p>
    )
  }

  // список жанров для select и разбивки
  const genres = [...new Set(allBooks.map((book) => book.genre))].sort()

  // книги после фильтра - от них считается статистика
  const books = genre ? allBooks.filter((book) => book.genre === genre) : allBooks

  // ---- СТАТИСТИКА ----
  const total = books.length
  const available = books.filter((book) => book.status === 'available').length
  const borrowed = total - available
  const totalPages = books.reduce((sum, book) => sum + book.pages, 0)
  const avgRating = total > 0 ? books.reduce((sum, book) => sum + book.rating, 0) / total : 0
  const years = books.map((book) => book.year)
  const oldest = Math.min(...years)
  const newest = Math.max(...years)

  // ---- РАЗБИВКА 1: по жанрам (всегда по всем книгам) ----
  const byGenre = genres.map((g) => ({
    name: g,
    count: allBooks.filter((book) => book.genre === g).length,
  }))

  // ---- РАЗБИВКА 2: по статусу (зависит от фильтра) ----
  const byStatus = [
    { name: 'available', count: available },
    { name: 'borrowed', count: borrowed },
  ]

  // ---- РАЗБИВКА 3: по рейтингу (зависит от фильтра) ----
  const byRating = [
    { name: '4.5 and higher', count: books.filter((book) => book.rating >= 4.5).length },
    { name: '4.0 – 4.4', count: books.filter((book) => book.rating >= 4 && book.rating < 4.5).length },
    { name: 'below 4.0', count: books.filter((book) => book.rating < 4).length },
  ]

  // ---- ТОП-3 по рейтингу ----
  const topBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 3)

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
