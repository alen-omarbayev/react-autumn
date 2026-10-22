function Pagination({ page, totalPages, onPageChange }) {
  // Массив номеров страниц: [1, 2, 3, ...]
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="pagination">
      <button className="btn btn-secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ← Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? 'btn' : 'btn btn-secondary'}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="btn btn-secondary"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  )
}

export default Pagination
