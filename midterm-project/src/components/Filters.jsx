import { GENRES, STATUSES } from '../api/moviesApi.js'

// Фильтры и сортировка. Своего state нет: всё приходит через props от MoviesPage.
function Filters({ genre, status, sortBy, onGenreChange, onStatusChange, onSortChange, onReset }) {
  return (
    <div className="filters">
      <select className="input" value={genre} onChange={(e) => onGenreChange(e.target.value)}>
        <option value="all">All genres</option>
        {GENRES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select className="input" value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="all">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select className="input" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="title">Title A–Z</option>
        <option value="rating">Rating (high first)</option>
        <option value="year-new">Year (newest)</option>
        <option value="year-old">Year (oldest)</option>
      </select>

      <button className="btn btn-secondary" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}

export default Filters
