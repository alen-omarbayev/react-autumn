import { Suspense } from 'react'
import { Outlet } from 'react-router'
import NavBar from '../components/NavBar.jsx'
import UpdateBanner from '../components/UpdateBanner.jsx'
import OfflineBar from '../components/OfflineBar.jsx'

// Общий каркас для всех страниц: шапка сверху, страница внутри <Outlet />
function RootLayout() {
  return (
    <div className="app">
      <NavBar />
      <OfflineBar />
      <UpdateBanner />

      <main>
        {/* Suspense показывает fallback, пока грузится lazy-страница */}
        <Suspense fallback={<p className="message">Loading page...</p>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="footer">Library Books · React PWA homework</footer>
    </div>
  )
}

export default RootLayout
