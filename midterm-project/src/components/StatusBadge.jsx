import { STATUSES } from '../api/moviesApi.js'

// Маленькая плашка со статусом фильма: "Want to watch", "Watching", "Watched"
function StatusBadge({ status }) {
  const found = STATUSES.find((s) => s.value === status)
  const label = found ? found.label : status

  return <span className={`badge badge-${status}`}>{label}</span>
}

export default StatusBadge
