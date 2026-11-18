import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { searchBooks, getWork } from '../services/openLibrary.js'

// Ошибку "offline" повторять бессмысленно - сети нет
function retryUnlessOffline(count, error) {
  return error.message !== 'offline' && count < 1
}

export function useSearchBooks(query, page) {
  return useQuery({
    queryKey: ['openlibrary', 'search', query, page],
    queryFn: () => searchBooks(query, page),
    enabled: query.length >= 2, // не ищем по одной букве
    placeholderData: keepPreviousData,
    retry: retryUnlessOffline,
  })
}

export function useWork(workId) {
  return useQuery({
    queryKey: ['openlibrary', 'work', workId],
    queryFn: () => getWork(workId),
    retry: retryUnlessOffline,
  })
}
