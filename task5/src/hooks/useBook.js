import { useState, useEffect } from 'react'
import { getItem } from '../services/service.js'

// Свой хук: загружает одну книгу по id
function useBook(id) {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    setBook(null)
    setLoading(true)
    setError('')
    setNotFound(false)

    getItem(id)
      .then((data) => {
        if (!ignore) {
          setBook(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          // "Item not found" - книги нет. Остальное - ошибка сервера, её можно повторить.
          if (err.message === 'Item not found') {
            setNotFound(true)
          } else {
            setError(err.message)
          }
          setLoading(false)
        }
      })

    // cleanup: перешли на другую книгу (id поменялся) - старый ответ не покажем (stale request)
    return () => {
      ignore = true
    }
  }, [id, reloadCount])

  function reload() {
    setReloadCount((count) => count + 1)
  }

  return { book, setBook, loading, error, notFound, reload }
}

export default useBook
