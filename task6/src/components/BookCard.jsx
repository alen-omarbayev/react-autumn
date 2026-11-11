import { Link } from 'react-router'

// Переиспользуемая карточка книги. Вся карточка - ссылка на /books/:id
function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="card">
      <div className="card-top">
        <span className="card-genre">{book.genre}</span>
        <span className={`badge ${book.status}`}>{book.status}</span>
      </div>
      <h3 className="card-title">{book.name}</h3>
      <p className="card-author">{book.author}</p>
      <div className="card-bottom">
        <span>⭐ {book.rating}</span>
        <span>{book.year}</span>
        <span>{book.pages} p.</span>
      </div>
    </Link>
  )
}

export default BookCard
