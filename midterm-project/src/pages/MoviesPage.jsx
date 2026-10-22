import { useState, useEffect } from 'react'
import { getMovies } from '../api/moviesApi.js'
import SearchBar from '../components/SearchBar.jsx'
import Filters from '../components/Filters.jsx'
import MovieList from '../components/MovieList.jsx'
import Pagination from '../components/Pagination.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

function MoviesPage() {
  // Что выбрал пользователь
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('all')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [page, setPage] = useState(1)

  // Что пришло с "сервера"
  const [movies, setMovies] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Увеличиваем это число, чтобы загрузить данные ещё раз (кнопка "Try again")
  const [reloadKey, setReloadKey] = useState(0)

  // Загружаем фильмы каждый раз, когда меняется поиск, фильтр, сортировка, страница или reloadKey
  useEffect(() => {
    // ignore = true, если этот запрос уже устарел (пользователь успел изменить фильтры)
    let ignore = false

    setIsLoading(true)
    setErrorMessage('')

    getMovies({ search, genre, status, sortBy, page })
      .then((data) => {
        if (!ignore) {
          setMovies(data.items)
          setTotal(data.total)
          setTotalPages(data.totalPages)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message)
          setIsLoading(false)
        }
      })

    // cleanup: React вызывает его перед следующим запуском эффекта и при уходе со страницы.
    // Ответ старого запроса придёт позже, но мы его проигнорируем.
    return () => {
      ignore = true
    }
  }, [search, genre, status, sortBy, page, reloadKey])

  // При смене фильтра возвращаемся на 1 страницу.
  // Оба set-а в одном обработчике: React объединит их в один ре-рендер (batching).
  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

  function handleGenreChange(value) {
    setGenre(value)
    setPage(1)
  }

  function handleStatusChange(value) {
    setStatus(value)
    setPage(1)
  }

  function handleSortChange(value) {
    setSortBy(value)
    setPage(1)
  }

  function handleReset() {
    setSearch('')
    setGenre('all')
    setStatus('all')
    setSortBy('title')
    setPage(1)
  }

  function handleRetry() {
    setReloadKey(reloadKey + 1)
  }

  // Что показать под фильтрами: loading / error / empty / список
  let content
  if (isLoading) {
    content = <StatusMessage type="loading" />
  } else if (errorMessage) {
    content = <StatusMessage type="error" message={errorMessage} onRetry={handleRetry} />
  } else if (movies.length === 0) {
    content = <StatusMessage type="empty" message="No movies found. Try another search or filter." />
  } else {
    content = (
      <>
        <MovieList movies={movies} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </>
    )
  }

  return (
    <div>
      <div className="page-head">
        <h1>My movies</h1>
        {!isLoading && !errorMessage && <p className="muted">{total} movies found</p>}
      </div>

      <SearchBar value={search} onChange={handleSearchChange} />
      <Filters
        genre={genre}
        status={status}
        sortBy={sortBy}
        onGenreChange={handleGenreChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onReset={handleReset}
      />

      {content}
    </div>
  )
}

export default MoviesPage
