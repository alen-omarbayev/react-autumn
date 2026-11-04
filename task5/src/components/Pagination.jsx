// Кнопки страниц. Сама не знает про URL - просто вызывает onPageChange(номер)
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  // массив [1, 2, 3, ..., totalPages]
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        ← Prev
      </button>

      {pages.map((number) => (
        <button
          key={number}
          className={number === page ? 'primary' : ''}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next →
      </button>
    </div>
  )
}

export default Pagination
