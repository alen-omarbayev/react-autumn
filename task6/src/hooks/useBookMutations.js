import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createItem, updateItem, deleteItem } from '../services/service.js'
import { bookKeys } from '../services/queryClient.js'

// Мутации = запросы, которые МЕНЯЮТ данные (create / update / delete).
// После успеха помечаем кэш устаревшим (invalidate), и TanStack Query перезагрузит нужные списки.

export function useCreateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => createItem(data),
    onSuccess: (created) => {
      // новая книга должна появиться в списках, а её жанр мог быть новым
      queryClient.invalidateQueries({ queryKey: bookKeys.lists })
      queryClient.invalidateQueries({ queryKey: bookKeys.genres })
      // сразу кладём книгу в кэш - страница книги откроется без загрузки
      queryClient.setQueryData(bookKeys.detail(created.id), created)
    },
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }) => updateItem(id, changes),
    onSuccess: (updated) => {
      // страница книги сразу показывает новые данные из ответа сервера
      queryClient.setQueryData(bookKeys.detail(updated.id), updated)
      // списки (Books, Dashboard) и жанры надо перезагрузить: мог поменяться статус, рейтинг, жанр
      queryClient.invalidateQueries({ queryKey: bookKeys.lists })
      queryClient.invalidateQueries({ queryKey: bookKeys.genres })
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteItem(id),
    onSuccess: (result) => {
      // удалённой книги больше нет - убираем её из кэша
      queryClient.removeQueries({ queryKey: bookKeys.detail(result.id) })
      queryClient.invalidateQueries({ queryKey: bookKeys.lists })
      queryClient.invalidateQueries({ queryKey: bookKeys.genres })
    },
  })
}
