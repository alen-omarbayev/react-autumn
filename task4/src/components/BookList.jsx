function BookList({ books, selectedId, busyId, onSelect }) {
  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id}>
          <button
            className={book.id === selectedId ? 'book-item selected' : 'book-item'}
            onClick={() => onSelect(book.id)}
          >
            <span className="book-name">{book.name}</span>
            <span className="book-author">{book.author}</span>
            <span className={`badge ${book.status}`}>
              {book.id === busyId ? 'saving...' : book.status}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default BookList
