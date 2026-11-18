// Пометка "вы смотрите сохранённые данные" (данные пришли из кэша Service Worker)
function CachedNotice({ cachedAt }) {
  const time = cachedAt ? new Date(cachedAt).toLocaleString() : 'earlier'
  return (
    <p className="cached-notice">
      💾 You are viewing cached data (saved {time}). It will update when the connection returns.
    </p>
  )
}

export default CachedNotice
