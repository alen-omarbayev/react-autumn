import { NavLink, Link } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

// NavLink сам добавляет класс "active" к ссылке текущей страницы.
// Ссылки меняют адрес без перезагрузки страницы.
function NavBar() {
  const { user, loading, logout } = useAuth()

  // Правая часть меню зависит от того, вошёл пользователь или нет
  let authLinks
  if (loading) {
    authLinks = null // пока проверяем сессию - ничего не показываем, чтобы не мигало
  } else if (user) {
    authLinks = (
      <>
        <NavLink to="/profile">Profile</NavLink>
        <button className="nav-button" onClick={logout}>
          Logout
        </button>
      </>
    )
  } else {
    authLinks = (
      <>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign up</NavLink>
      </>
    )
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        📚 Library Books
      </Link>

      <nav className="nav-links">
        {/* end - чтобы "Home" не была активной на всех страницах */}
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/about">About</NavLink>
        {authLinks}
      </nav>
    </header>
  )
}

export default NavBar
