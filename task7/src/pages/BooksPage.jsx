import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useBooks, useGenres } from '../hooks/useBooks.js'
import { useCreateBook } from '../hooks/useBookMutations.js'
import BookCard from '../components/BookCard.jsx'
import BookForm from '../components/BookForm.jsx'
import Pagination from '../components/Pagination.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

const PAGE_SIZE = 6

function BooksPage() {
  const navigate = useNavigate()

  // Все фильтры хранятся в URL: /books?search=dune&genre=Sci-Fi&status=available&sort=year&page=2
  // Поэтому они не теряются после обновления страницы, и работают кнопки Назад/Вперёд.
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const genre = searchParams.get('genre') || ''
  const status = searchParams.get('status') || ''
  const sort = searchParams.get('sort') || 'name'
  const page = Number(searchParams.get('page')) || 1

  // Строка запроса для API = параметры из URL + limit
  const apiParams = new URLSearchParams(searchParams)
  apiParams.set('limit', PAGE_SIZE)
  // TanStack Query: данные берутся из кэша, если они там есть и ещё свежие
  // isPending - первая загрузка (данных ещё нет), isFetching - идёт любой запрос (в т.ч. фоновый)
  const { data: result, isPending, isFetching, isError, error, refetch } = useBooks('?' + apiParams.toString())

  // список жанров для выпадающего фильтра (если не загрузился - будет только "All genres")
  const genresQuery = useGenres()
  const genres = genresQuery.data || []

  // форма добавления книги (функционал из task 4)
  const [showForm, setShowForm] = useState(false)
  const createBook = useCreateBook()

  // Меняет один параметр в URL. Пустое значение - удаляем параметр.
  // При смене фильтра возвращаемся на 1 страницу.
  function updateParam(name, value) {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(name, value)
    } else {
      newParams.delete(name)
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  function changePage(newPage) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage)
    setSearchParams(newParams)
  }

  function clearFilters() {
    setSearchParams({})
  }

  function handleCreate(data) {
    createBook.mutate(
      { ...data, status: 'available' },
      {
        // после создания сразу открываем страницу новой книги (кэш уже обновлён в хуке)
        onSuccess: (created) => navigate(`/books/${created.id}`),
      },
    )
  }

  let content
  if (isPending) {
    content = <p className="message">Loading books...</p>
  } else if (isError) {
    content = <ErrorMessage text={error.message} onRetry={refetch} />
  } else if (result.data.length === 0) {
    content = (
      <div className="message">
        <p>No books found.</p>
        <button onClick={clearFilters}>Clear filters</button>
      </div>
    )
  } else {
    content = (
      <>
        <div className="card-grid">
          {result.data.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <Pagination page={page} totalPages={result.totalPages} onPageChange={changePage} />
      </>
    )
  }

  return (
    <section>
      <div className="page-header">
        <h1>Books {result && !isError && <span className="count">({result.total})</span>}</h1>
        <div className="header-buttons">
          {/* refetch - принудительно идём на сервер, даже если данные в кэше свежие */}
          <button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Reload'}
          </button>
          <button className="primary" onClick={() => setShowForm(true)} disabled={showForm}>
            + Add book
          </button>
        </div>
      </div>

      {createBook.isError && <p className="message error">Could not create: {createBook.error.message}</p>}

      {showForm && (
        <BookForm title="New book" saving={createBook.isPending} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <div className="filters">
        <input
          type="search"
          placeholder="Search by title, author..."
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
        />

        <select value={genre} onChange={(e) => updateParam('genre', e.target.value)}>
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => updateParam('status', e.target.value)}>
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>

        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
          <option value="name">Title A-Z</option>
          <option value="name-desc">Title Z-A</option>
          <option value="rating-desc">Best rating</option>
          <option value="year-desc">Newest first</option>
          <option value="year">Oldest first</option>
        </select>

        <button onClick={clearFilters}>Reset</button>
      </div>

      {content}
    </section>
  )
}

export default BooksPage
