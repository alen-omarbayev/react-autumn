import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

// Обёртка для закрытых страниц. Не вошёл - перекидываем на /login.
function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Пока Firebase проверяет сессию - ждём, иначе после F5 нас бы сразу выкинуло на /login
  if (loading) {
    return <p className="message">Checking session...</p>
  }

  if (!user) {
    // state.from - чтобы после входа вернуть пользователя туда, куда он шёл
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
