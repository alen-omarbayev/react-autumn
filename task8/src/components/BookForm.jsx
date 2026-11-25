import { useState } from 'react'

const emptyBook = {
  name: '',
  author: '',
  genre: '',
  year: '',
  pages: '',
  rating: '',
  description: '',
}

// Одна форма и для создания, и для редактирования. Черновик хранится в локальном состоянии.
function BookForm({ title, initialBook = emptyBook, saving, onSubmit, onCancel }) {
  const [name, setName] = useState(initialBook.name)
  const [author, setAuthor] = useState(initialBook.author)
  const [genre, setGenre] = useState(initialBook.genre)
  const [year, setYear] = useState(initialBook.year)
  const [pages, setPages] = useState(initialBook.pages)
  const [rating, setRating] = useState(initialBook.rating)
  const [description, setDescription] = useState(initialBook.description)
  const [formError, setFormError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (name.trim() === '' || author.trim() === '') {
      setFormError('Title and author are required.')
      return
    }
    if (Number(rating) < 0 || Number(rating) > 5) {
      setFormError('Rating must be from 0 to 5.')
      return
    }

    setFormError('')
    onSubmit({
      name: name.trim(),
      author: author.trim(),
      genre: genre.trim(),
      year: Number(year),
      pages: Number(pages),
      rating: Number(rating),
      description: description.trim(),
    })
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>

      <div className="form-grid">
        <label>
          Title
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Author
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <label>
          Genre
          <input value={genre} onChange={(e) => setGenre(e.target.value)} />
        </label>
        <label>
          Year
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </label>
        <label>
          Pages
          <input type="number" min="1" value={pages} onChange={(e) => setPages(e.target.value)} />
        </label>
        <label>
          Rating (0-5)
          <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
        </label>
      </div>

      <label>
        Description
        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      {formError && <p className="form-error">{formError}</p>}

      <div className="form-buttons">
        <button type="submit" className="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default BookForm
