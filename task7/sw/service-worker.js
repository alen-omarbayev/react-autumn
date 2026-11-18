/* =====================================================================
   SERVICE WORKER — Library Books (task 7)

   Этот файл НЕ проходит через React/Vite как обычный код.
   При сборке (npm run build) плагин из vite.config.js:
     1) подставляет вместо метки VERSION уникальную версию (время сборки)
     2) подставляет вместо метки PRECACHE_FILES список всех файлов из dist
     3) кладёт результат в dist/sw.js
   ===================================================================== */

// ---------- 1. НАСТРОЙКИ И ИМЕНА КЭШЕЙ ----------

// Версия меняется при каждой сборке. Новая версия = новый кэш оболочки.
const VERSION = '__VERSION__'

// Оболочка приложения (HTML, JS, CSS, иконки, offline.html) - версионный кэш
const SHELL_CACHE = `shell-${VERSION}`
// Картинки (обложки книг) - стратегия cache-first
const IMAGE_CACHE = 'images-v1'
// Ответы публичного API Open Library - стратегия network-first
const API_CACHE = 'api-v1'

// Все кэши, которые нужны ЭТОЙ версии. Остальные удалим в activate.
const CURRENT_CACHES = [SHELL_CACHE, IMAGE_CACHE, API_CACHE]

// ignoreVary: сервер может прислать заголовок "Vary: Origin", и тогда запрос со скрипта
// (у него есть заголовок Origin) не совпадёт с сохранённым файлом. Просим кэш не смотреть на Vary.
const MATCH_OPTIONS = { ignoreVary: true }

// Ограничения, чтобы кэш не рос бесконечно
const IMAGE_MAX_ENTRIES = 60
const API_MAX_ENTRIES = 50
const API_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 1 день

// Список файлов сборки: ['./', './index.html', './assets/index-abc.js', ...]
const PRECACHE_FILES = __PRECACHE_FILES__

// ---------- 2. INSTALL: скачиваем и кладём в кэш оболочку приложения ----------

self.addEventListener('install', (event) => {
  console.log('[SW] install', VERSION)
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_FILES)),
  )
  // ВАЖНО: тут НЕТ self.skipWaiting().
  // Новая версия ждёт (waiting), пока пользователь не нажмёт "Update" в баннере.
})

// ---------- 3. ACTIVATE: удаляем старые кэши ----------

self.addEventListener('activate', (event) => {
  console.log('[SW] activate', VERSION)
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => !CURRENT_CACHES.includes(name))
            .map((name) => {
              console.log('[SW] delete old cache', name)
              return caches.delete(name)
            }),
        ),
      )
      // сразу берём под контроль открытые вкладки
      .then(() => self.clients.claim()),
  )
})

// ---------- 4. СООБЩЕНИЯ ОТ ПРИЛОЖЕНИЯ ----------

// Пользователь нажал "Update" -> приложение присылает SKIP_WAITING ->
// новая версия становится активной -> в приложении срабатывает controllerchange -> перезагрузка
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// ---------- 5. FETCH: решаем, откуда брать каждый ответ ----------

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // Кэшируем ТОЛЬКО GET. POST/PUT/DELETE всегда идут в сеть.
  if (request.method !== 'GET') return

  // Firebase / Google (вход, токены, данные пользователя) - НЕ трогаем совсем.
  // Ответы авторизации нельзя класть в общий кэш.
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebaseapp.com') ||
    url.hostname.includes('google.com') ||
    url.hostname.includes('gstatic.com')
  ) {
    return
  }

  // 5.1 Переход по страницам (ввели адрес, обновили страницу) -> network-first + offline.html
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }

  // 5.2 Публичный API Open Library (список и детали) -> NETWORK-FIRST
  if (url.hostname === 'openlibrary.org') {
    event.respondWith(networkFirst(request))
    return
  }

  // 5.3 Картинки (обложки, иконки) -> CACHE-FIRST
  if (request.destination === 'image' || url.hostname === 'covers.openlibrary.org') {
    event.respondWith(cacheFirst(request))
    return
  }

  // 5.4 Файлы нашего приложения (JS, CSS, manifest) -> сначала кэш оболочки, потом сеть
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request, MATCH_OPTIONS).then((cached) => cached || fetch(request)),
    )
  }
  // всё остальное браузер грузит сам, как обычно
})

// ---------- 6. СТРАТЕГИИ ----------

// Навигация: пробуем сеть. Нет сети -> отдаём index.html из кэша (приложение
// откроется и покажет сохранённые данные). Если и его нет -> offline.html.
async function handleNavigation(request) {
  try {
    return await fetch(request)
  } catch {
    const url = new URL(request.url)
    // Наше приложение - это одна страница index.html (HashRouter: /task7/#/books/3)
    const isAppPage = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')
    if (isAppPage) {
      const shell = await caches.match('./index.html', MATCH_OPTIONS)
      if (shell) return shell
    }
    return caches.match('./offline.html', MATCH_OPTIONS)
  }
}

// CACHE-FIRST: есть в кэше - отдаём сразу, без сети. Нет - качаем и сохраняем.
// Для картинок: они не меняются, а грузятся долго.
async function cacheFirst(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cached = await cache.match(request, MATCH_OPTIONS)
  if (cached) return cached

  try {
    const response = await fetch(request)
    // status 0 = "opaque" ответ (картинка с другого сайта без CORS) - его тоже можно хранить
    if (response.ok || response.status === 0) {
      await cache.put(request, response.clone())
      await trimCache(IMAGE_CACHE, IMAGE_MAX_ENTRIES)
    }
    return response
  } catch {
    // нет сети и нет в кэше - пустой ответ, <img> просто не покажется, приложение не падает
    return new Response('', { status: 503, statusText: 'Offline' })
  }
}

// NETWORK-FIRST: сначала сеть (свежие данные). Сеть упала -> берём из кэша
// и добавляем в JSON поля _fromCache и _cachedAt, чтобы приложение показало "cached data".
async function networkFirst(request) {
  const cache = await caches.open(API_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) {
      // сохраняем копию + время сохранения (для срока жизни и для надписи в интерфейсе)
      const headers = new Headers(response.headers)
      headers.set('X-Cached-At', String(Date.now()))
      const body = await response.clone().blob()
      await cache.put(request, new Response(body, { status: response.status, headers }))
      await trimCache(API_CACHE, API_MAX_ENTRIES)
    }
    return response
  } catch {
    const cached = await cache.match(request, MATCH_OPTIONS)
    if (cached) {
      const cachedAt = Number(cached.headers.get('X-Cached-At'))
      // слишком старые данные не показываем, удаляем
      if (Date.now() - cachedAt < API_MAX_AGE_MS) {
        const data = await cached.json()
        const body = JSON.stringify({ ...data, _fromCache: true, _cachedAt: cachedAt })
        return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      await cache.delete(request)
    }
    // нет ни сети, ни кэша: отдаём ошибку 503 в формате JSON, приложение покажет сообщение
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Удаляем самые старые записи, если их больше maxEntries
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys() // ключи идут в порядке добавления
  for (let i = 0; i < keys.length - maxEntries; i++) {
    await cache.delete(keys[i])
  }
}
