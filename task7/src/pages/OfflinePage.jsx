import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { checkConnection } from '../services/serviceWorker.js'

// Страница /offline. Её же показываем внутри Discover-страниц,
// если без интернета открыли то, чего нет в кэше.
// onRetry - что делать, если связь вернулась (по умолчанию - вернуться назад / на главную)
function OfflinePage({ text, onRetry }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(false)
  const [stillOffline, setStillOffline] = useState(false)

  async function handleRetry() {
    setChecking(true)
    setStillOffline(false)
    const ok = await checkConnection() // настоящий запрос в сеть, мимо кэша
    setChecking(false)

    if (!ok) {
      setStillOffline(true)
      return
    }
    if (onRetry) {
      onRetry()
    } else {
      // вернуться туда, откуда пришли на /offline, или на главную
      navigate(location.state?.from || '/', { replace: true })
    }
  }

  return (
    <section className="panel offline-page">
      <div className="offline-icon">📡</div>
      <h1>You are offline</h1>
      <p>{text || 'This page needs an internet connection and it was not saved for offline use.'}</p>
      <p className="offline-hint">
        Your library (Books, Dashboard) and pages you opened before still work without internet.
      </p>
      <button className="primary" onClick={handleRetry} disabled={checking}>
        {checking ? 'Checking...' : 'Retry connection'}
      </button>
      {stillOffline && <p className="message error">Still no connection. Try again later.</p>}
    </section>
  )
}

export default OfflinePage
