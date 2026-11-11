import { QueryClient } from '@tanstack/react-query'

// Один общий кэш для всего приложения (TanStack Query)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1 минуту данные считаются свежими - повторный заход на страницу берёт их из кэша без запроса
      staleTime: 60 * 1000,
      // 5 минут неиспользуемые данные лежат в кэше, потом удаляются
      gcTime: 5 * 60 * 1000,
      // fake API иногда падает - пробуем ещё 1 раз, потом показываем ошибку
      retry: 1,
      // при возврате на вкладку браузера устаревшие данные перезагружаются (revalidation)
      refetchOnWindowFocus: true,
    },
  },
})

// Ключи кэша в одном месте, чтобы не ошибиться в названиях
export const bookKeys = {
  lists: ['books'], //                              все списки книг (начало ключа)
  list: (query) => ['books', query], //            один список: ['books', '?page=2&limit=6']
  detail: (id) => ['book', String(id)], //        одна книга: ['book', '3']
  genres: ['genres'], //                          список жанров
}
