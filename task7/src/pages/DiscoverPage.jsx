import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useSearchBooks } from '../hooks/useOpenLibrary.js'
import { PAGE_SIZE, coverUrl } from '../services/openLibrary.js'
import Pagination from '../components/Pagination.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import CachedNotice from '../components/CachedNotice.jsx'
import OfflinePage from './OfflinePage.jsx'

// Поиск по публичному API Open Library. Запрос и страница хранятся в URL: /discover?q=tolkien&page=2
function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const page = Number(searchParams.get('page')) || 1

  // текст в поле ввода; в URL попадает только после нажатия Search
  const [text, setText] = useState(query)

  const { data: result, isFetching, isError, error, refetch } = useSearchBooks(query, page)

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim().length >= 2) {
      setSearchParams({ q: text.trim() })
    }
  }

  function changePage(newPage) {
    setSearchParams({ q: query, page: String(newPage) })
  }

  let content
  if (query.length < 2) {
    content = <p className="message">Type at least 2 letters and press Search. Try "tolkien" or "harry potter".</p>
  } else if (isError && error.message === 'offline') {
    // нет сети и этого поиска нет в кэше
    content = <OfflinePage text={`Search results for "${query}" were not saved for offline use.`} onRetry={refetch} />
  } else if (isError) {
    content = <ErrorMessage text={error.message} onRetry={refetch} />
  } else if (!result) {
    content = <p className="message">Searching...</p>
  } else if (result.data.docs.length === 0) {
    content = <p className="message">Nothing found for "{query}".</p>
  } else {
    const totalPages = Math.min(Math.ceil(result.data.numFound / PAGE_SIZE), 20)
    content = (
      <>
        {result.fromCache && <CachedNotice cachedAt={result.cachedAt} />}
        <p className="message">
          Found {result.data.numFound} books {isFetching && '· updating...'}
        </p>
        <div className="card-grid">
          {result.data.docs.map((book) => {
            const workId = book.key.replace('/works/', '')
            return (
              <Link key={book.key} to={`/discover/${workId}`} className="card discover-card">
                {book.cover_i ? (
                  <img src={coverUrl(book.cover_i, 'M')} alt="" className="discover-cover" loading="lazy" />
                ) : (
                  <div className="discover-cover no-cover">📕</div>
                )}
                <h3 className="card-title">{book.title}</h3>
                <p className="card-author">{book.author_name ? book.author_name.join(', ') : 'Unknown author'}</p>
                <div className="card-bottom">
                  <span>{book.first_publish_year || '—'}</span>
                  <span>{book.edition_count} editions</span>
                </div>
              </Link>
            )
          })}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={changePage} />
      </>
    )
  }

  return (
    <section>
      <div className="page-header">
        <h1>Discover</h1>
      </div>
      <p className="message">Search millions of books in the public Open Library catalog.</p>

      <form className="filters" onSubmit={handleSubmit}>
        <input type="search" placeholder="Book title or author..." value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="primary">
          Search
        </button>
      </form>

      {content}
    </section>
  )
}

export default DiscoverPage
