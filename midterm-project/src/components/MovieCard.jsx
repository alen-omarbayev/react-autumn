import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'

// Карточка одного фильма в списке. Клик ведёт на страницу фильма.
function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="card">
      <div className="poster">
        <span className="poster-letter">{movie.title[0]}</span>
        <span className="poster-genre">{movie.genre}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{movie.title}</h3>
        <p className="muted">
          {movie.year} · ⭐ {movie.rating}
        </p>
        <StatusBadge status={movie.status} />
      </div>
    </Link>
  )
}

export default MovieCard
