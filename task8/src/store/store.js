// STORE - одно общее хранилище состояния для всего приложения.
// configureStore сам подключает Redux DevTools и redux-thunk (нужен для createAsyncThunk).
import { configureStore } from '@reduxjs/toolkit'
import booksReducer from '../features/books/booksSlice.js'
import bookDetailsReducer from '../features/books/bookDetailsSlice.js'
import discoverReducer from '../features/discover/discoverSlice.js'

export const store = configureStore({
  reducer: {
    books: booksReducer, //             state.books       - списки книг, все книги, жанры
    bookDetails: bookDetailsReducer, // state.bookDetails - открытая книга + create/update/delete
    discover: discoverReducer, //       state.discover    - поиск Open Library
  },
})
