// Один компонент для трёх состояний: loading, error, empty
function StatusMessage({ type, message, onRetry }) {
  if (type === 'loading') {
    return (
      <div className="status-message">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (type === 'error') {
    return (
      <div className="status-message error">
        <p>⚠️ {message}</p>
        {onRetry && (
          <button className="btn" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    )
  }

  // type === 'empty'
  return (
    <div className="status-message">
      <p>{message}</p>
    </div>
  )
}

export default StatusMessage
