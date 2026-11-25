import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import OnlineIndicator from './OnlineIndicator.jsx'

// NavLink сам добавляет класс "active" к ссылке текущей страницы.
// На телефоне (до 700px) ссылки спрятаны и открываются кнопкой ☰ (гамбургер-меню).
function NavBar() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  // Запоминаем, на какой странице открыли меню. Сменилась страница (клик по ссылке,
  // кнопка "Назад") - адрес уже другой, и меню само считается закрытым.
  const [menuOpenedAt, setMenuOpenedAt] = useState(null)
  const menuOpen = menuOpenedAt === location.pathname

  function toggleMenu() {
    setMenuOpenedAt(menuOpen ? null : location.pathname)
  }

  function closeMenu() {
    setMenuOpenedAt(null)
  }

  function handleLogout() {
    closeMenu()
    logout()
  }

  // Правая часть меню зависит от того, вошёл пользователь или нет
  let authLinks
  if (loading) {
    authLinks = null // пока проверяем сессию - ничего не показываем, чтобы не мигало
  } else if (user) {
    authLinks = (
      <>
        <NavLink to="/profile">Profile</NavLink>
        <button className="nav-button" onClick={handleLogout}>
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
      <div className="navbar-top">
        <Link to="/" className="logo" onClick={closeMenu}>
          📚 Library Books
        </Link>

        <OnlineIndicator />

        {/* кнопка видна только на телефоне (см. CSS) */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* onClick на всём nav: клик по любой ссылке закрывает меню */}
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'} onClick={(e) => e.target.tagName === 'A' && closeMenu()}>
        {/* end - чтобы "Home" не была активной на всех страницах */}
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/about">About</NavLink>
        {authLinks}
      </nav>
    </header>
  )
}

export default NavBar
