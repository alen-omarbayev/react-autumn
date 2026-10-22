import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovieById, updateMovieStatus, STATUSES } from '../api/moviesApi.js'
import StatusBadge from '../components/StatusBadge.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

function MovieDetailPage() {
  // id берём из адреса: #/movies/5 → id = "5"
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Загружаем фильм. Зависимость [id]: если id в адресе поменяется, загрузим новый фильм.
  useEffect(() => {
    let ignore = false

    setIsLoading(true)
    setErrorMessage('')

    getMovieById(id)
      .then((data) => {
        if (!ignore) {
          setMovie(data)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [id])

  function handleStatusClick(newStatus) {
    setIsSaving(true)
    updateMovieStatus(movie.id, newStatus).then(() => {
      // Не меняем movie напрямую (movie.status = ...), а создаём новый объект
      setMovie({ ...movie, status: newStatus })
      setIsSaving(false)
    })
  }

  if (isLoading) {
    return <StatusMessage type="loading" />
  }

  if (errorMessage) {
    return (
      <div>
        <StatusMessage type="error" message={errorMessage} />
        <Link to="/" className="back-link">
          ← Back to movies
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to movies
      </Link>

      <div className="details">
        <div className="poster poster-big">
          <span className="poster-letter">{movie.title[0]}</span>
          <span className="poster-genre">{movie.genre}</span>
        </div>

        <div className="details-info">
          <h1>{movie.title}</h1>
          <p className="muted">
            {movie.year} · {movie.genre} · {movie.duration} min
          </p>
          <p>
            <b>Director:</b> {movie.director}
          </p>
          <p>
            <b>Rating:</b> ⭐ {movie.rating} / 10
          </p>
          <p>{movie.overview}</p>

          <p>
            <b>Status:</b> <StatusBadge status={movie.status} />
          </p>
          <div className="status-buttons">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                className={movie.status === s.value ? 'btn' : 'btn btn-secondary'}
                disabled={isSaving || movie.status === s.value}
                onClick={() => handleStatusClick(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailPage
