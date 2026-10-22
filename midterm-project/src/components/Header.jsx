import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          🎬 Movie Tracker
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Movies
          </NavLink>
          <NavLink to="/add">+ Add movie</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
