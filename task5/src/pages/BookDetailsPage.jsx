import { useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router'
import { updateItem, deleteItem } from '../services/service.js'
import useBook from '../hooks/useBook.js'
import BookForm from '../components/BookForm.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

function BookDetailsPage() {
  // useParams достаёт :id из адреса /books/:id (это всегда строка)
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { book, setBook, loading, error, notFound, reload } = useBook(id)

  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [actionError, setActionError] = useState('')

  // Кнопка Back: если пришли с другой страницы приложения - шаг назад (фильтры в URL сохранятся).
  // Если ссылку открыли напрямую (истории нет, key === 'default') - идём на список книг.
  function goBack() {
    if (location.key === 'default') {
      navigate('/books')
    } else {
      navigate(-1)
    }
  }

  function handleToggleStatus() {
    const newStatus = book.status === 'available' ? 'borrowed' : 'available'
    setBusy(true)
    setActionError('')

    updateItem(book.id, { status: newStatus })
      .then((updated) => setBook(updated))
      .catch((err) => setActionError(`Could not change status: ${err.message}`))
      .finally(() => setBusy(false))
  }

  function handleEdit(data) {
    setBusy(true)
    setActionError('')

    updateItem(book.id, data)
      .then((updated) => {
        setBook(updated)
        setEditing(false)
      })
      .catch((err) => setActionError(`Could not save: ${err.message}`))
      .finally(() => setBusy(false))
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${book.name}"?`)) {
      return
    }
    setBusy(true)
    setActionError('')

    deleteItem(book.id)
      .then(() => navigate('/books'))
      .catch((err) => {
        setActionError(`Could not delete: ${err.message}`)
        setBusy(false)
      })
  }

  // Ссылки, которые есть на странице в любом состоянии
  const links = (
    <div className="details-links">
      <button onClick={goBack}>← Back</button>
      <Link to="/books" className="button">
        All books
      </Link>
    </div>
  )

  // Неправильный id (например /books/abc) - даже не ждём ответа сервера
  const isValidId = /^\d+$/.test(id)
  if (!isValidId) {
    return (
      <section className="panel">
        {links}
        <h1>Invalid book id</h1>
        <p className="message">"{id}" is not a valid book id. The id must be a number.</p>
      </section>
    )
  }

  let content
  // book.id !== Number(id): адрес уже поменялся, а старая книга ещё в состоянии - не показываем её
  if (loading || (book && book.id !== Number(id))) {
    content = <p className="message">Loading book...</p>
  } else if (notFound) {
    content = (
      <>
        <h1>Book not found</h1>
        <p className="message">There is no book with id {id}. Maybe it was deleted.</p>
      </>
    )
  } else if (error) {
    content = <ErrorMessage text={error} onRetry={reload} />
  } else if (editing) {
    content = (
      <BookForm title="Edit book" initialBook={book} saving={busy} onSubmit={handleEdit} onCancel={() => setEditing(false)} />
    )
  } else {
    content = (
      <div className="details">
        <h1>{book.name}</h1>
        <p className="description">{book.description}</p>

        <dl className="fields">
          <dt>Author</dt>
          <dd>{book.author}</dd>
          <dt>Genre</dt>
          <dd>
            <Link to={`/books?genre=${encodeURIComponent(book.genre)}`}>{book.genre}</Link>
          </dd>
          <dt>Year</dt>
          <dd>{book.year}</dd>
          <dt>Pages</dt>
          <dd>{book.pages}</dd>
          <dt>Rating</dt>
          <dd>{book.rating} / 5</dd>
          <dt>Status</dt>
          <dd>
            <span className={`badge ${book.status}`}>{book.status}</span>
          </dd>
          <dt>Reading time</dt>
          {/* примерно 40 страниц в час */}
          <dd>~{Math.round(book.pages / 40)} hours</dd>
          <dt>ID</dt>
          <dd>{book.id}</dd>
        </dl>

        <div className="details-buttons">
          <button className="primary" onClick={handleToggleStatus} disabled={busy}>
            {busy ? 'Saving...' : book.status === 'available' ? 'Mark as borrowed' : 'Mark as available'}
          </button>
          <button onClick={() => setEditing(true)} disabled={busy}>
            Edit
          </button>
          <button className="danger" onClick={handleDelete} disabled={busy}>
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="panel">
      {links}
      {actionError && <p className="message error">{actionError}</p>}
      {content}
    </section>
  )
}

export default BookDetailsPage
