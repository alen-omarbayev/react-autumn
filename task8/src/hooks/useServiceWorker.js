import { useEffect, useState } from 'react'
import { registerServiceWorker, activateUpdate } from '../services/serviceWorker.js'

// Регистрирует Service Worker один раз и говорит, есть ли новая версия
function useServiceWorker() {
  const [waitingRegistration, setWaitingRegistration] = useState(null)

  useEffect(() => {
    registerServiceWorker((registration) => setWaitingRegistration(registration))
  }, [])

  return {
    updateAvailable: waitingRegistration !== null,
    update: () => activateUpdate(waitingRegistration),
    dismiss: () => setWaitingRegistration(null),
  }
}

export default useServiceWorker
