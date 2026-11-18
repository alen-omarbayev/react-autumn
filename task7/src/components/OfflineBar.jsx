import useOnlineStatus from '../hooks/useOnlineStatus.js'

// Полоска под шапкой, пока нет интернета
function OfflineBar() {
  const online = useOnlineStatus()
  if (online) {
    return null
  }
  return (
    <div className="offline-bar" role="status">
      You are offline. Saved pages and data are still available, changes to your library are saved on this device.
    </div>
  )
}

export default OfflineBar
