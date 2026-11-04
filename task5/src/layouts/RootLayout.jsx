import { Suspense } from 'react'
import { Outlet } from 'react-router'
import NavBar from '../components/NavBar.jsx'

// Общий каркас для всех страниц: шапка сверху, страница внутри <Outlet />
function RootLayout() {
  return (
    <div className="app">
      <NavBar />

      <main>
        {/* Suspense показывает fallback, пока грузится lazy-страница */}
        <Suspense fallback={<p className="message">Loading page...</p>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="footer">Library Books · React Router homework</footer>
    </div>
  )
}

export default RootLayout
