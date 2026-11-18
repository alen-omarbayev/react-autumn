// App.jsx отвечает ТОЛЬКО за маршруты (routing). Вся логика лежит в pages/, components/, hooks/, services/.
import { lazy } from 'react'
import { HashRouter, Routes, Route } from 'react-router'
import RootLayout from './layouts/RootLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Lazy loading: код этих страниц скачивается только когда пользователь на них заходит.
// Пока код грузится, показывается fallback из <Suspense> (он в RootLayout).
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const BooksPage = lazy(() => import('./pages/BooksPage.jsx'))
const BookDetailsPage = lazy(() => import('./pages/BookDetailsPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const DiscoverPage = lazy(() => import('./pages/DiscoverPage.jsx'))
const DiscoverDetailsPage = lazy(() => import('./pages/DiscoverDetailsPage.jsx'))
const OfflinePage = lazy(() => import('./pages/OfflinePage.jsx'))

function App() {
  return (
    // HashRouter: адрес выглядит как .../task7/#/books/3
    // На GitHub Pages так работают прямые ссылки и обновление страницы (F5) без 404 от сервера.
    <HashRouter>
      <Routes>
        {/* Родительский маршрут: RootLayout рисует NavBar, а внутри <Outlet /> - текущую страницу */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />

          {/* Вложенные маршруты для книг: /books и /books/:id */}
          <Route path="books">
            <Route index element={<BooksPage />} />
            <Route path=":id" element={<BookDetailsPage />} />
          </Route>

          {/* Публичный API Open Library: список и детали (кэшируются Service Worker'ом) */}
          <Route path="discover">
            <Route index element={<DiscoverPage />} />
            <Route path=":workId" element={<DiscoverDetailsPage />} />
          </Route>

          <Route path="offline" element={<OfflinePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Закрытые страницы: без входа ProtectedRoute перекинет на /login */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* * - любой другой адрес = 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
