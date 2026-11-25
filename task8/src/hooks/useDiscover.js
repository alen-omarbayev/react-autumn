import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchDiscover, fetchWork, selectDiscoverSearch, selectDiscoverWork } from '../features/discover/discoverSlice.js'

// Поиск Open Library
export function useDiscoverSearch(query, page) {
  const dispatch = useDispatch()
  const search = useSelector(selectDiscoverSearch)
  const enabled = query.length >= 2 // не ищем по одной букве

  useEffect(() => {
    if (enabled) {
      dispatch(searchDiscover({ query, page }))
    }
  }, [dispatch, query, page, enabled])

  const isCurrent = search.query === query && search.page === page

  return {
    result: isCurrent && search.status === 'succeeded' ? search : null,
    loading: enabled && (!isCurrent || search.status === 'loading'),
    error: isCurrent && search.status === 'failed' ? search.error : null,
    reload: () => dispatch(searchDiscover({ query, page, force: true })),
  }
}

// Одна книга Open Library
export function useWork(id) {
  const dispatch = useDispatch()
  const work = useSelector(selectDiscoverWork)

  useEffect(() => {
    dispatch(fetchWork({ id }))
  }, [dispatch, id])

  const isCurrent = work.id === id

  return {
    result: isCurrent && work.status === 'succeeded' ? work : null,
    loading: !isCurrent || work.status === 'loading',
    error: isCurrent && work.status === 'failed' ? work.error : null,
    reload: () => dispatch(fetchWork({ id, force: true })),
  }
}
