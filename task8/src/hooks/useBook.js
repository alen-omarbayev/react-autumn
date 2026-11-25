import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookById, createBook, updateBook, deleteBook } from '../features/books/bookDetailsSlice.js'
import { selectBookDetails, selectBookSaving } from '../features/books/booksSelectors.js'

// Одна книга по id из URL
export function useBook(id) {
  const dispatch = useDispatch()
  const details = useSelector(selectBookDetails)
  const isValidId = /^\d+$/.test(id)

  useEffect(() => {
    if (isValidId) {
      dispatch(fetchBookById({ id }))
    }
  }, [dispatch, id, isValidId])

  // в store может лежать другая книга (открытая раньше) - её не показываем
  const isCurrent = details.id === id

  return {
    book: isCurrent ? details.book : null,
    loading: !isCurrent || details.status === 'loading',
    error: isCurrent ? details.error : null,
    notFound: isCurrent && details.notFound,
    reload: () => dispatch(fetchBookById({ id, force: true })),
  }
}

// Действия с книгами (create / update / delete).
// .unwrap() - превращает результат thunk в обычный Promise:
// успех -> данные, ошибка -> throw (её ловит компонент и показывает сообщение)
export function useBookActions() {
  const dispatch = useDispatch()
  const saving = useSelector(selectBookSaving)

  return {
    saving,
    createBook: (data) => dispatch(createBook(data)).unwrap(),
    updateBook: (id, changes) => dispatch(updateBook({ id, changes })).unwrap(),
    deleteBook: (id) => dispatch(deleteBook(id)).unwrap(),
  }
}
