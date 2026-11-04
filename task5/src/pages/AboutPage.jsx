import { Link } from 'react-router'

function AboutPage() {
  return (
    <section className="panel page-text">
      <h1>About the project</h1>
      <p>
        <b>Library Books</b> is my homework for the React course. It started in task 4 as a one-page
        app with a fake async API. In task 5 I split it into several pages with React Router.
      </p>

      <h2>What is used</h2>
      <ul>
        <li>React Router: RootLayout, NavBar, Outlet, nested routes</li>
        <li>Dynamic URL <code>/books/:id</code> with useParams</li>
        <li>Search, filters, sorting and pagination saved in the URL with useSearchParams</li>
        <li>React.lazy and Suspense for lazy loading pages</li>
        <li>Fake API in <code>services/service.js</code> (delays, random errors, localStorage)</li>
      </ul>

      <h2>About me</h2>
      <p>
        My name is Alen Omarbayev. I am a student and I am learning React and frontend development.
      </p>

      <Link to="/books" className="button primary">
        Go to books
      </Link>
    </section>
  )
}

export default AboutPage
