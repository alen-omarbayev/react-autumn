// Публичный API Open Library (https://openlibrary.org/developers/api).
// Эти запросы перехватывает Service Worker (стратегия network-first),
// поэтому один раз открытые результаты доступны и без интернета.

const API_URL = 'https://openlibrary.org'
export const PAGE_SIZE = 12

// Общая функция: делает запрос и понимает, пришли данные из сети или из кэша SW
async function request(url) {
  let response
  try {
    response = await fetch(url)
  } catch {
    // сюда попадаем, если Service Worker ещё не установлен и сети нет
    throw new Error('offline')
  }

  const data = await response.json()
  if (response.status === 503 && data.error === 'offline') {
    throw new Error('offline') // нет сети и нет сохранённой копии
  }
  if (!response.ok) {
    throw new Error(`Server error ${response.status}`)
  }

  // Service Worker добавляет _fromCache и _cachedAt, если отдал сохранённую копию
  return {
    data,
    fromCache: Boolean(data._fromCache),
    cachedAt: data._cachedAt || null,
  }
}

// СПИСОК: поиск книг
export function searchBooks(query, page) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(PAGE_SIZE),
    fields: 'key,title,author_name,first_publish_year,cover_i,edition_count',
  })
  return request(`${API_URL}/search.json?${params}`)
}

// ДЕТАЛИ: одна книга (work), id вида OL27482W
export function getWork(workId) {
  return request(`${API_URL}/works/${workId}.json`)
}

// ссылка на обложку (size: S, M, L)
export function coverUrl(coverId, size = 'M') {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}
