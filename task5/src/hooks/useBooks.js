import { useState, useEffect } from 'react'
import { getItemsList } from '../services/service.js'

// Свой хук: загружает список книг по строке запроса (query).
// Возвращает данные, загрузку, ошибку и функцию reload.
function useBooks(query) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    setLoading(true)
    setError('')

    getItemsList(query)
      .then((data) => {
        if (!ignore) {
          setResult(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message)
          setLoading(false)
        }
      })

    // cleanup: если query поменялся (новый поиск/фильтр), ответ старого запроса игнорируем
    return () => {
      ignore = true
    }
  }, [query, reloadCount])

  function reload() {
    setReloadCount((count) => count + 1)
  }

  return { result, loading, error, reload }
}

export default useBooks
