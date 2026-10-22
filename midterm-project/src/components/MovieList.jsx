import MovieCard from './MovieCard.jsx'

function MovieList({ movies }) {
  return (
    <div className="grid">
      {/* key = id фильма, а не индекс: id не меняется при сортировке и фильтрации */}
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default MovieList
