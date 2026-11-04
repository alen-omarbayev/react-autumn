import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section className="panel not-found">
      <h1>404</h1>
      <p>Sorry, this page does not exist.</p>
      <Link to="/" className="button primary">
        Go Home
      </Link>
    </section>
  )
}

export default NotFoundPage
