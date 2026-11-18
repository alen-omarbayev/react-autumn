import { useQuery } from '@tanstack/react-query'
import { getItem } from '../services/service.js'
import { bookKeys } from '../services/queryClient.js'

// Одна книга по id
export function useBook(id) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => getItem(id),
    // не делаем запрос, если id не число (/books/abc)
    enabled: /^\d+$/.test(id),
    // если книги нет - повторять запрос бессмысленно
    retry: (count, error) => error.message !== 'Item not found' && count < 1,
  })
}
