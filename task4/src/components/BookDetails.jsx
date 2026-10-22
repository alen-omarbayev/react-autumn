function BookDetails({ selectedId, details, loading, error, busyId, onRetry, onToggleStatus, onEdit, onDelete }) {
  if (selectedId === null) {
    return <p className="message">Select a book to see details.</p>
  }

  // details.id !== selectedId: выбрали новую книгу, а эффект ещё не успел запуститься - старое не показываем
  if (loading || (details && details.id !== selectedId)) {
    return <p className="message">Loading details...</p>
  }

  if (error) {
    return (
      <div className="message error">
        <p>Error: {error}</p>
        <button onClick={onRetry}>Try again</button>
      </div>
    )
  }

  if (!details) {
    return null
  }

  // пока идёт любой запрос, кнопки выключены, чтобы не было конфликтующих действий
  const isBusy = busyId !== null
  const isThisBusy = busyId === details.id

  return (
    <div className="details">
      <h3>{details.name}</h3>
      <p className="description">{details.description}</p>

      <dl className="fields">
        <dt>Author</dt>
        <dd>{details.author}</dd>
        <dt>Genre</dt>
        <dd>{details.genre}</dd>
        <dt>Year</dt>
        <dd>{details.year}</dd>
        <dt>Pages</dt>
        <dd>{details.pages}</dd>
        <dt>Rating</dt>
        <dd>{details.rating} / 5</dd>
        <dt>Status</dt>
        <dd>
          <span className={`badge ${details.status}`}>{details.status}</span>
        </dd>
        <dt>ID</dt>
        <dd>{details.id}</dd>
      </dl>

      <div className="details-buttons">
        <button className="primary" onClick={onToggleStatus} disabled={isBusy}>
          {isThisBusy ? 'Saving...' : details.status === 'available' ? 'Mark as borrowed' : 'Mark as available'}
        </button>
        <button onClick={onEdit} disabled={isBusy}>
          Edit
        </button>
        <button className="danger" onClick={onDelete} disabled={isBusy}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default BookDetails
