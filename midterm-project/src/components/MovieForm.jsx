import { useState } from 'react'
import { GENRES, STATUSES } from '../api/moviesApi.js'

// Контролируемая форма: значение каждого поля хранится в state,
// input показывает value из state, а onChange обновляет state.
function MovieForm({ onSubmit, isSaving }) {
  const [title, setTitle] = useState('')
  const [director, setDirector] = useState('')
  const [year, setYear] = useState('')
  const [genre, setGenre] = useState(GENRES[0])
  const [rating, setRating] = useState('')
  const [duration, setDuration] = useState('')
  const [overview, setOverview] = useState('')
  const [status, setStatus] = useState('want')

  // Ошибки валидации: { title: '...', year: '...' }
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    const currentYear = new Date().getFullYear()

    if (title.trim() === '') {
      newErrors.title = 'Title is required'
    }
    if (director.trim() === '') {
      newErrors.director = 'Director is required'
    }
    if (year === '' || Number(year) < 1888 || Number(year) > currentYear) {
      newErrors.year = `Year must be between 1888 and ${currentYear}`
    }
    if (rating === '' || Number(rating) < 0 || Number(rating) > 10) {
      newErrors.rating = 'Rating must be from 0 to 10'
    }
    if (duration === '' || Number(duration) <= 0) {
      newErrors.duration = 'Duration must be more than 0'
    }
    return newErrors
  }

  function handleSubmit(e) {
    // Без этого браузер перезагрузит страницу
    e.preventDefault()

    const newErrors = validate()
    setErrors(newErrors)

    // Если есть хотя бы одна ошибка, не отправляем
    if (Object.keys(newErrors).length > 0) {
      return
    }

    onSubmit({
      title: title.trim(),
      director: director.trim(),
      year: Number(year),
      genre,
      rating: Number(rating),
      duration: Number(duration),
      overview: overview.trim() || 'No description yet.',
      status,
    })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Title *
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </label>

      <label>
        Director *
        <input className="input" value={director} onChange={(e) => setDirector(e.target.value)} />
        {errors.director && <span className="error-text">{errors.director}</span>}
      </label>

      <div className="form-row">
        <label>
          Year *
          <input
            className="input"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          {errors.year && <span className="error-text">{errors.year}</span>}
        </label>

        <label>
          Rating (0–10) *
          <input
            className="input"
            type="number"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </label>

        <label>
          Duration (min) *
          <input
            className="input"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          {errors.duration && <span className="error-text">{errors.duration}</span>}
        </label>
      </div>

      <div className="form-row">
        <label>
          Genre
          <select className="input" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Overview
        <textarea
          className="input"
          rows="4"
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
        />
      </label>

      <button className="btn" type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Add movie'}
      </button>
    </form>
  )
}

export default MovieForm
