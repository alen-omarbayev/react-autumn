import useServiceWorker from '../hooks/useServiceWorker.js'

// Плашка "Доступна новая версия". Появляется, когда после деплоя
// браузер скачал новый Service Worker и он ждёт активации.
function UpdateBanner() {
  const { updateAvailable, update, dismiss } = useServiceWorker()

  if (!updateAvailable) {
    return null
  }

  return (
    <div className="update-banner" role="status">
      <span>🔄 A new version of the app is available.</span>
      <div className="update-buttons">
        <button className="primary" onClick={update}>
          Update now
        </button>
        <button onClick={dismiss}>Later</button>
      </div>
    </div>
  )
}

export default UpdateBanner
