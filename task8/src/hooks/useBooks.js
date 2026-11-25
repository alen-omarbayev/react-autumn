import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooks, fetchAllBooks, fetchGenres } from '../features/books/booksSlice.js'
import { selectBooksList, selectAllBooksState, selectGenres, selectGenresStale } from '../features/books/booksSelectors.js'

// Свои хуки - "мостик" между Redux и компонентами.
// Компонент просто пишет useBooks(query), а dispatch и useSelector спрятаны тут.

// Список книг для страницы Books
export function useBooks(query) {
  const dispatch = useDispatch()
  const list = useSelector(selectBooksList)

  // загружаем при смене query и когда данные устарели после изменений (stale)
  useEffect(() => {
    dispatch(fetchBooks({ query }))
  }, [dispatch, query, list.stale])

  // в store могут лежать данные ДРУГОГО запроса (прошлого фильтра) - их не показываем
  const isCurrent = list.query === query

  return {
    result: isCurrent && list.status === 'succeeded' ? list : null,
    loading: !isCurrent || list.status === 'loading' || list.status === 'idle',
    error: isCurrent && list.status === 'failed' ? list.error : null,
    reload: () => dispatch(fetchBooks({ query, force: true })), // Reload / Try again
  }
}

// Все книги для Dashboard
export function useAllBooks() {
  const dispatch = useDispatch()
  const all = useSelector(selectAllBooksState)

  useEffect(() => {
    dispatch(fetchAllBooks())
  }, [dispatch, all.stale])

  return {
    books: all.items,
    loading: all.status === 'loading' || all.status === 'idle',
    error: all.status === 'failed' ? all.error : null,
    reload: () => dispatch(fetchAllBooks({ force: true })),
  }
}

// Жанры для фильтра
export function useGenres() {
  const dispatch = useDispatch()
  const genres = useSelector(selectGenres)
  const stale = useSelector(selectGenresStale)

  useEffect(() => {
    dispatch(fetchGenres())
  }, [dispatch, stale])

  return genres
}
