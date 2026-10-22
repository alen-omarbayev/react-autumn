import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import StatusMessage from './components/StatusMessage.jsx'
import MoviesPage from './pages/MoviesPage.jsx'
import MovieDetailPage from './pages/MovieDetailPage.jsx'
import AddMoviePage from './pages/AddMoviePage.jsx'

// App только собирает страницы. Состояние хранится в самих страницах.
function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/add" element={<AddMoviePage />} />
          <Route path="*" element={<StatusMessage type="empty" message="Page not found." />} />
        </Routes>
      </main>
    </>
  )
}

export default App
