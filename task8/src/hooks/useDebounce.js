import { useEffect, useState } from 'react'

// Debounce: возвращает value с задержкой. Пока пользователь печатает, значение не меняется;
// перестал печатать на delay мс - отдаём новое значение.
// Так поиск не отправляет запрос на каждую букву.
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    // напечатали ещё букву раньше времени - старый таймер отменяем
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export default useDebounce
