// СЛАЙС "bookDetails" - одна открытая книга и изменения книг (create / update / delete)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getItem, createItem, updateItem, deleteItem } from '../../services/service.js'

const FRESH_TIME = 60 * 1000

// ---------- THUNKS ----------

// THUNK 2: детали книги по id
export const fetchBookById = createAsyncThunk(
  'bookDetails/fetchBookById',
  async ({ id }) => {
    return await getItem(id)
  },
  {
    condition: ({ id, force }, { getState }) => {
      const details = getState().bookDetails
      if (force) return true
      if (details.status === 'loading' && details.id === id) return false
      // эта книга уже открыта и свежая - запрос не нужен
      const fresh = Date.now() - details.loadedAt < FRESH_TIME
      if (details.status === 'succeeded' && details.id === id && fresh) return false
      return true
    },
  },
)

// THUNK 3 (мутации): создать, изменить, удалить книгу
export const createBook = createAsyncThunk('bookDetails/createBook', async (data) => {
  return await createItem(data)
})

export const updateBook = createAsyncThunk('bookDetails/updateBook', async ({ id, changes }) => {
  return await updateItem(id, changes)
})

export const deleteBook = createAsyncThunk('bookDetails/deleteBook', async (id) => {
  return await deleteItem(id)
})

// ---------- SLICE ----------

const initialState = {
  id: null, //          id открытой книги (строка из URL, например '3')
  book: null,
  status: 'idle', //    загрузка книги: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  notFound: false, //   книги с таким id нет
  requestId: null,
  loadedAt: 0,
  saving: false, //     идёт create / update / delete
}

const bookDetailsSlice = createSlice({
  name: 'bookDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== загрузка книги =====
      .addCase(fetchBookById.pending, (state, action) => {
        const id = action.meta.arg.id
        if (state.id !== id) {
          state.book = null // открыли другую книгу - старую не показываем
        }
        state.id = id
        state.status = 'loading'
        state.error = null
        state.notFound = false
        state.requestId = action.meta.requestId
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return // устаревший ответ
        state.status = 'succeeded'
        state.book = action.payload
        state.loadedAt = Date.now()
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'failed'
        // "Item not found" - книги нет; остальное - ошибка сервера, её можно повторить
        if (action.error.message === 'Item not found') {
          state.notFound = true
        } else {
          state.error = action.error.message
        }
      })

      // ===== создание =====
      .addCase(createBook.pending, (state) => {
        state.saving = true
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.saving = false
        // новую книгу сразу кладём как "открытую" - её страница откроется без загрузки
        state.id = String(action.payload.id)
        state.book = action.payload
        state.status = 'succeeded'
        state.loadedAt = Date.now()
      })
      .addCase(createBook.rejected, (state) => {
        state.saving = false
      })

      // ===== изменение =====
      .addCase(updateBook.pending, (state) => {
        state.saving = true
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.saving = false
        // ответ сервера = новая версия книги
        if (state.book && state.book.id === action.payload.id) {
          state.book = action.payload
          state.loadedAt = Date.now()
        }
      })
      .addCase(updateBook.rejected, (state) => {
        state.saving = false
      })

      // ===== удаление =====
      .addCase(deleteBook.pending, (state) => {
        state.saving = true
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.saving = false
        if (state.book && state.book.id === action.payload.id) {
          state.book = null
          state.id = null
          state.status = 'idle'
        }
      })
      .addCase(deleteBook.rejected, (state) => {
        state.saving = false
      })
  },
})

export default bookDetailsSlice.reducer
