import useOnlineStatus from '../hooks/useOnlineStatus.js'

// Маленький значок в шапке: зелёный - онлайн, красный - офлайн
function OnlineIndicator() {
  const online = useOnlineStatus()

  return (
    <span className={online ? 'online-indicator online' : 'online-indicator offline'} title={online ? 'Online' : 'Offline'}>
      <span className="dot" />
      {online ? 'Online' : 'Offline'}
    </span>
  )
}

export default OnlineIndicator
