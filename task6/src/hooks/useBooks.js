import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getItemsList, getGenres } from '../services/service.js'
import { bookKeys } from '../services/queryClient.js'

// Список книг по строке запроса (фильтры + страница).
// У каждого query свой ключ кэша, поэтому ответ старого запроса не может попасть в новый список.
export function useBooks(query) {
  return useQuery({
    queryKey: bookKeys.list(query),
    queryFn: () => getItemsList(query),
    // пока грузится новая страница - показываем предыдущую, а не пустой экран
    placeholderData: keepPreviousData,
  })
}

// Жанры для фильтра. Меняются редко - считаем свежими 5 минут.
export function useGenres() {
  return useQuery({
    queryKey: bookKeys.genres,
    queryFn: getGenres,
    staleTime: 5 * 60 * 1000,
  })
}
