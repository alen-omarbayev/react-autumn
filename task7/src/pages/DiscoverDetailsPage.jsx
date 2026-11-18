import { useParams, useNavigate, useLocation, Link } from 'react-router'
import { useWork } from '../hooks/useOpenLibrary.js'
import { coverUrl } from '../services/openLibrary.js'
import ErrorMessage from '../components/ErrorMessage.jsx'
import CachedNotice from '../components/CachedNotice.jsx'
import OfflinePage from './OfflinePage.jsx'

// Детали книги из Open Library: /discover/OL27482W
function DiscoverDetailsPage() {
  const { workId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: result, isPending, isError, error, refetch } = useWork(workId)

  function goBack() {
    if (location.key === 'default') {
      navigate('/discover')
    } else {
      navigate(-1)
    }
  }

  const links = (
    <div className="details-links">
      <button onClick={goBack}>← Back</button>
      <Link to="/discover" className="button">
        Search
      </Link>
    </div>
  )

  if (isError && error.message === 'offline') {
    return <OfflinePage text="This book was not opened before, so it is not saved for offline use." onRetry={refetch} />
  }

  let content
  if (isPending) {
    content = <p className="message">Loading book...</p>
  } else if (isError) {
    content = <ErrorMessage text={error.message} onRetry={refetch} />
  } else {
    const work = result.data
    // описание бывает строкой или объектом { value: '...' }
    const description = typeof work.description === 'string' ? work.description : work.description?.value
    const coverId = work.covers?.find((id) => id > 0)

    content = (
      <div className="discover-details">
        {result.fromCache && <CachedNotice cachedAt={result.cachedAt} />}
        <div className="discover-layout">
          {coverId && <img src={coverUrl(coverId, 'M')} alt={work.title} className="discover-big-cover" />}
          <div>
            <h1>{work.title}</h1>
            <p className="description">{description || 'No description.'}</p>
            <dl className="fields">
              <dt>First published</dt>
              <dd>{work.first_publish_date || '—'}</dd>
              <dt>Open Library ID</dt>
              <dd>{workId}</dd>
            </dl>
            {work.subjects && (
              <div className="subjects">
                {work.subjects.slice(0, 12).map((subject) => (
                  <span key={subject} className="badge">
                    {subject}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="panel">
      {links}
      {content}
    </section>
  )
}

export default DiscoverDetailsPage
