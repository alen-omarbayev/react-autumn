import { NavLink, Link } from 'react-router'

// NavLink сам добавляет класс "active" к ссылке текущей страницы.
// Ссылки меняют адрес без перезагрузки страницы.
function NavBar() {
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
        <NavLink to="/login">Login</NavLink>
      </nav>
    </header>
  )
}

export default NavBar
