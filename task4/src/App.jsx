import { useState, useEffect } from 'react'
import { getItemsList, getItem, createItem, updateItem, deleteItem } from './api/fakeApi.js'
import BookList from './components/BookList.jsx'
import BookDetails from './components/BookDetails.jsx'
import BookForm from './components/BookForm.jsx'

function App() {
  // список книг
  const [books, setBooks] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  // выбранная книга и её детали
  const [selectedId, setSelectedId] = useState(null)
  const [details, setDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const [detailsReloadCount, setDetailsReloadCount] = useState(0)

  // id книги, с которой сейчас идёт запрос (смена статуса, редактирование, удаление)
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  // форма: null - закрыта, 'create' - новая книга, 'edit' - редактирование
  const [formMode, setFormMode] = useState(null)
  const [formSaving, setFormSaving] = useState(false)

  // Загружаем список. Зависимость [reloadCount]: кнопка Reload увеличивает число и эффект запускается снова.
  useEffect(() => {
    let ignore = false

    setListLoading(true)
    setListError('')

    getItemsList('?limit=100')
      .then((result) => {
        if (!ignore) {
          setBooks(result.data)
          setListLoading(false)
        }
      })
      .catch((error) => {
        if (!ignore) {
          setListError(error.message)
          setListLoading(false)
        }
      })

    // cleanup: если нажали Reload ещё раз, ответ старого запроса игнорируем
    return () => {
      ignore = true
    }
  }, [reloadCount])

  // Загружаем детали выбранной книги. Зависимость [selectedId]: при выборе другой книги грузим заново.
  useEffect(() => {
    if (selectedId === null) {
      setDetails(null)
      return
    }

    let ignore = false

    setDetails(null)
    setDetailsLoading(true)
    setDetailsError('')

    getItem(selectedId)
      .then((data) => {
        if (!ignore) {
          setDetails(data)
          setDetailsLoading(false)
        }
      })
      .catch((error) => {
        if (!ignore) {
          setDetailsError(error.message)
          setDetailsLoading(false)
        }
      })

    // cleanup: если быстро выбрали другую книгу, старый ответ не покажется (защита от race condition)
    return () => {
      ignore = true
    }
  }, [selectedId, detailsReloadCount])

  function handleSelect(id) {
    setSelectedId(id)
    setActionError('')
    if (formMode === 'edit') {
      setFormMode(null)
    }
  }

  // Меняет статус книги: available <-> borrowed
  function handleToggleStatus() {
    // запоминаем id и статус в момент клика. Пока ждём ответ, пользователь может выбрать другую книгу,
    // поэтому дальше используем только эти переменные, а не selectedId/details.
    const id = details.id
    const newStatus = details.status === 'available' ? 'borrowed' : 'available'

    setBusyId(id)
    setActionError('')

    updateItem(id, { status: newStatus })
      .then((updated) => {
        // обновляем именно ту книгу, для которой был запрос
        setBooks((prev) => prev.map((book) => (book.id === updated.id ? updated : book)))
        // детали меняем только если сейчас открыта эта же книга
        setDetails((prev) => (prev && prev.id === updated.id ? updated : prev))
      })
      .catch((error) => {
        setActionError(`Could not change status: ${error.message}`)
      })
      .finally(() => {
        setBusyId(null)
      })
  }

  function handleDelete() {
    const id = details.id

    if (!window.confirm(`Delete "${details.name}"?`)) {
      return
    }

    setBusyId(id)
    setActionError('')

    deleteItem(id)
      .then(() => {
        setBooks((prev) => prev.filter((book) => book.id !== id))
        // снимаем выбор, только если всё ещё выбрана удалённая книга
        setSelectedId((prev) => (prev === id ? null : prev))
      })
      .catch((error) => {
        setActionError(`Could not delete: ${error.message}`)
      })
      .finally(() => {
        setBusyId(null)
      })
  }

  function handleCreate(data) {
    setFormSaving(true)
    setActionError('')

    createItem({ ...data, status: 'available' })
      .then((created) => {
        setBooks((prev) => [...prev, created])
        setFormMode(null)
        setSelectedId(created.id)
      })
      .catch((error) => {
        setActionError(`Could not create: ${error.message}`)
      })
      .finally(() => {
        setFormSaving(false)
      })
  }

  function handleEdit(data) {
    const id = details.id

    setFormSaving(true)
    setBusyId(id)
    setActionError('')

    updateItem(id, data)
      .then((updated) => {
        setBooks((prev) => prev.map((book) => (book.id === updated.id ? updated : book)))
        setDetails((prev) => (prev && prev.id === updated.id ? updated : prev))
        setFormMode(null)
      })
      .catch((error) => {
        setActionError(`Could not save: ${error.message}`)
      })
      .finally(() => {
        setFormSaving(false)
        setBusyId(null)
      })
  }

  let listContent
  if (listLoading) {
    listContent = <p className="message">Loading books...</p>
  } else if (listError) {
    listContent = (
      <div className="message error">
        <p>Error: {listError}</p>
        <button onClick={() => setReloadCount(reloadCount + 1)}>Try again</button>
      </div>
    )
  } else if (books.length === 0) {
    listContent = <p className="message">No books yet. Add the first one!</p>
  } else {
    listContent = (
      <BookList books={books} selectedId={selectedId} busyId={busyId} onSelect={handleSelect} />
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Library Books</h1>
        <div className="header-buttons">
          <button onClick={() => setReloadCount(reloadCount + 1)} disabled={listLoading}>
            {listLoading ? 'Loading...' : 'Reload'}
          </button>
          <button className="primary" onClick={() => setFormMode('create')} disabled={formMode !== null}>
            + Add book
          </button>
        </div>
      </header>

      {actionError && (
        <div className="message error action-error">
          <p>{actionError}</p>
          <button onClick={() => setActionError('')}>Close</button>
        </div>
      )}

      {formMode === 'create' && (
        <BookForm title="New book" saving={formSaving} onSubmit={handleCreate} onCancel={() => setFormMode(null)} />
      )}

      <main className="layout">
        <section className="panel">
          <h2>Books {!listLoading && !listError && `(${books.length})`}</h2>
          {listContent}
        </section>

        <section className="panel">
          <h2>Details</h2>
          {formMode === 'edit' && details ? (
            <BookForm
              key={details.id}
              title="Edit book"
              initialBook={details}
              saving={formSaving}
              onSubmit={handleEdit}
              onCancel={() => setFormMode(null)}
            />
          ) : (
            <BookDetails
              selectedId={selectedId}
              details={details}
              loading={detailsLoading}
              error={detailsError}
              busyId={busyId}
              onRetry={() => setDetailsReloadCount(detailsReloadCount + 1)}
              onToggleStatus={handleToggleStatus}
              onEdit={() => setFormMode('edit')}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
