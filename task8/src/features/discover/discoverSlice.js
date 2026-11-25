// СЛАЙС "discover" - публичный API Open Library: поиск (список) и одна книга (детали)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchBooks, getWork } from '../../services/openLibrary.js'

// ---------- THUNKS ----------

// Поиск. Возвращает { data, fromCache, cachedAt } (fromCache - ответ из кэша Service Worker)
export const searchDiscover = createAsyncThunk(
  'discover/search',
  async ({ query, page }) => {
    return await searchBooks(query, page)
  },
  {
    condition: ({ query, page, force }, { getState }) => {
      const search = getState().discover.search
      if (force) return true
      const same = search.query === query && search.page === page
      // этот же поиск уже грузится или уже загружен из сети - второй раз не идём в сеть.
      // Если данные были из офлайн-кэша (fromCache) - пробуем ещё раз, вдруг сеть вернулась.
      if (same && search.status === 'loading') return false
      if (same && search.status === 'succeeded' && !search.fromCache) return false
      return true
    },
  },
)

// Одна книга (work) по id вида OL27482W
export const fetchWork = createAsyncThunk(
  'discover/fetchWork',
  async ({ id }) => {
    return await getWork(id)
  },
  {
    condition: ({ id, force }, { getState }) => {
      const work = getState().discover.work
      if (force) return true
      if (work.id === id && work.status === 'loading') return false
      if (work.id === id && work.status === 'succeeded' && !work.fromCache) return false
      return true
    },
  },
)

// ---------- SLICE ----------

const initialState = {
  search: { query: '', page: 1, data: null, fromCache: false, cachedAt: null, status: 'idle', error: null, requestId: null },
  work: { id: null, data: null, fromCache: false, cachedAt: null, status: 'idle', error: null, requestId: null },
}

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== поиск =====
      .addCase(searchDiscover.pending, (state, action) => {
        state.search.query = action.meta.arg.query
        state.search.page = action.meta.arg.page
        state.search.status = 'loading'
        state.search.error = null
        state.search.requestId = action.meta.requestId
      })
      .addCase(searchDiscover.fulfilled, (state, action) => {
        if (state.search.requestId !== action.meta.requestId) return // устаревший ответ
        state.search.status = 'succeeded'
        state.search.data = action.payload.data
        state.search.fromCache = action.payload.fromCache
        state.search.cachedAt = action.payload.cachedAt
      })
      .addCase(searchDiscover.rejected, (state, action) => {
        if (state.search.requestId !== action.meta.requestId) return
        state.search.status = 'failed'
        state.search.error = action.error.message // 'offline' - нет сети и нет копии в кэше
      })

      // ===== одна книга =====
      .addCase(fetchWork.pending, (state, action) => {
        if (state.work.id !== action.meta.arg.id) {
          state.work.data = null
        }
        state.work.id = action.meta.arg.id
        state.work.status = 'loading'
        state.work.error = null
        state.work.requestId = action.meta.requestId
      })
      .addCase(fetchWork.fulfilled, (state, action) => {
        if (state.work.requestId !== action.meta.requestId) return
        state.work.status = 'succeeded'
        state.work.data = action.payload.data
        state.work.fromCache = action.payload.fromCache
        state.work.cachedAt = action.payload.cachedAt
      })
      .addCase(fetchWork.rejected, (state, action) => {
        if (state.work.requestId !== action.meta.requestId) return
        state.work.status = 'failed'
        state.work.error = action.error.message
      })
  },
})

// простые селекторы для этого слайса
export const selectDiscoverSearch = (state) => state.discover.search
export const selectDiscoverWork = (state) => state.discover.work

export default discoverSlice.reducer
