// СЛАЙС "books" - всё про СПИСКИ книг:
//   list   - текущая страница списка (с поиском, фильтрами, сортировкой, пагинацией)
//   all    - все книги сразу (для Dashboard)
//   genres - список жанров (для фильтра)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getItemsList, getGenres } from '../../services/service.js'
import { createBook, updateBook, deleteBook } from './bookDetailsSlice.js'

// Сколько данные считаются свежими: 1 минута. Свежие данные заново не запрашиваем.
const FRESH_TIME = 60 * 1000

function isFresh(loadedAt) {
  return Date.now() - loadedAt < FRESH_TIME
}

// ---------- THUNKS (асинхронные действия) ----------

// THUNK 1: список книг. query - строка вида "?search=dune&genre=Sci-Fi&page=2&limit=6"
// force: true - загрузить даже если данные свежие (кнопки Reload / Try again)
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({ query }) => {
    return await getItemsList(query) // вернули -> fulfilled, ошибка -> rejected
  },
  {
    // condition вызывается ДО запроса. return false - запрос не делаем вообще.
    condition: ({ query, force }, { getState }) => {
      const list = getState().books.list
      if (force) return true
      // точно такой же запрос уже идёт - второй не нужен
      if (list.status === 'loading' && list.query === query) return false
      // этот запрос уже загружен, данные свежие и не устарели после изменений - не повторяем
      if (list.status === 'succeeded' && list.query === query && isFresh(list.loadedAt) && !list.stale) {
        return false
      }
      return true
    },
  },
)

// Все книги для Dashboard (limit большой)
export const fetchAllBooks = createAsyncThunk(
  'books/fetchAllBooks',
  async () => {
    const result = await getItemsList('?limit=1000')
    return result.data
  },
  {
    condition: ({ force } = {}, { getState }) => {
      const all = getState().books.all
      if (force) return true
      if (all.status === 'loading') return false
      if (all.status === 'succeeded' && isFresh(all.loadedAt) && !all.stale) return false
      return true
    },
  },
)

// Жанры для выпадающего фильтра
export const fetchGenres = createAsyncThunk(
  'books/fetchGenres',
  async () => {
    return await getGenres()
  },
  {
    condition: (arg, { getState }) => {
      const genres = getState().books.genres
      if (genres.status === 'loading') return false
      if (genres.status === 'succeeded' && !genres.stale) return false
      return true
    },
  },
)

// ---------- НАЧАЛЬНОЕ СОСТОЯНИЕ ----------

const initialState = {
  list: {
    query: null, //      для какого запроса эти данные
    items: [],
    total: 0,
    totalPages: 0,
    status: 'idle', //   'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    requestId: null, //  id последнего запроса (защита от устаревших ответов)
    loadedAt: 0, //      когда загрузили (для "свежести")
    stale: false, //     true = данные устарели после изменений, надо перезагрузить
  },
  all: { items: [], status: 'idle', error: null, requestId: null, loadedAt: 0, stale: false },
  genres: { items: [], status: 'idle', stale: false },
}

// Помечаем все списки устаревшими (после create/update/delete)
function markAllStale(state) {
  state.list.stale = true
  state.all.stale = true
  state.genres.stale = true
}

// ---------- SLICE ----------

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {}, // обычных (синхронных) действий тут не нужно
  extraReducers: (builder) => {
    builder
      // ===== fetchBooks =====
      .addCase(fetchBooks.pending, (state, action) => {
        state.list.status = 'loading'
        state.list.error = null
        state.list.query = action.meta.arg.query
        state.list.requestId = action.meta.requestId // запоминаем, какой запрос самый новый
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        // УСТАРЕВШИЙ ЗАПРОС: пока ждали ответ, уже отправили новый -> этот ответ выбрасываем
        if (state.list.requestId !== action.meta.requestId) return

        state.list.status = 'succeeded'
        state.list.items = action.payload.data
        state.list.total = action.payload.total
        state.list.totalPages = action.payload.totalPages
        state.list.loadedAt = Date.now()
        state.list.stale = false
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return
        state.list.status = 'failed'
        state.list.error = action.error.message
      })

      // ===== fetchAllBooks =====
      .addCase(fetchAllBooks.pending, (state, action) => {
        state.all.status = 'loading'
        state.all.error = null
        state.all.requestId = action.meta.requestId
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        if (state.all.requestId !== action.meta.requestId) return
        state.all.status = 'succeeded'
        state.all.items = action.payload
        state.all.loadedAt = Date.now()
        state.all.stale = false
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        if (state.all.requestId !== action.meta.requestId) return
        state.all.status = 'failed'
        state.all.error = action.error.message
      })

      // ===== fetchGenres =====
      .addCase(fetchGenres.pending, (state) => {
        state.genres.status = 'loading'
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres.status = 'succeeded'
        state.genres.items = action.payload
        state.genres.stale = false
      })
      .addCase(fetchGenres.rejected, (state) => {
        // не загрузилось - в фильтре будет только "All genres"
        state.genres.status = 'failed'
      })

      // ===== ОБНОВЛЕНИЕ ПОСЛЕ ИЗМЕНЕНИЙ (thunks из bookDetailsSlice) =====
      .addCase(updateBook.fulfilled, (state, action) => {
        const updated = action.payload
        // сразу меняем книгу в уже загруженных списках, чтобы не было старых данных на экране
        state.list.items = state.list.items.map((book) => (book.id === updated.id ? { ...book, ...updated } : book))
        state.all.items = state.all.items.map((book) => (book.id === updated.id ? updated : book))
        // но сортировка/фильтры могли поменяться -> перезагрузим при следующем показе
        markAllStale(state)
      })
      .addCase(createBook.fulfilled, (state) => {
        markAllStale(state)
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        const id = action.payload.id
        state.list.items = state.list.items.filter((book) => book.id !== id)
        state.all.items = state.all.items.filter((book) => book.id !== id)
        markAllStale(state)
      })
  },
})

export default booksSlice.reducer
