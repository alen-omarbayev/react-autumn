import { Link } from 'react-router'
import booksImage from '../assets/books.svg'

function HomePage() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Welcome to Library Books</h1>
        <p>
          This is a small library app. You can search books, filter them by genre and status, open a
          book page, add, edit and delete books, and look at the library statistics.
        </p>

        <div className="hero-links">
          <Link to="/books" className="button primary">
            Browse books
          </Link>
          <Link to="/dashboard" className="button">
            Dashboard
          </Link>
          <Link to="/about" className="button">
            About project
          </Link>
        </div>
      </div>

      <img src={booksImage} alt="Books on a shelf" className="hero-image" />
    </section>
  )
}

export default HomePage
