// Регистрация Service Worker и проверка обновлений.
// Работает только в собранной версии (npm run build / деплой), в npm run dev - выключено.

// флаги на уровне модуля: в StrictMode useEffect вызывается дважды, а регистрировать нужно один раз
let registered = false
let reloaded = false

// onUpdate(registration) вызывается, когда скачана НОВАЯ версия и она ждёт активации
export function registerServiceWorker(onUpdate) {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD || registered) {
    return
  }
  registered = true

  // BASE_URL = '/react-autumn/task7/', значит sw.js лежит по адресу /react-autumn/task7/sw.js
  // и управляет только страницами внутри /react-autumn/task7/ (scope)
  const swUrl = `${import.meta.env.BASE_URL}sw.js`

  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // 1) Новая версия уже скачана и ждёт (например, вкладку открыли после деплоя)
      if (registration.waiting && navigator.serviceWorker.controller) {
        onUpdate(registration)
      }

      // 2) Новая версия начала скачиваться прямо сейчас
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        newWorker.addEventListener('statechange', () => {
          // installed + уже есть старый controller = это ОБНОВЛЕНИЕ, а не первая установка
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            onUpdate(registration)
          }
        })
      })

      // 3) Проверяем обновления раз в 30 минут (если вкладка долго открыта)
      setInterval(() => registration.update(), 30 * 60 * 1000)
    })
    .catch((error) => console.error('Service Worker registration failed:', error))

  // Когда новая версия стала активной - перезагружаем страницу один раз,
  // чтобы загрузились новые JS/CSS. Пользователю не нужно чистить кэш руками.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!reloaded) {
      reloaded = true
      window.location.reload()
    }
  })
}

// Кнопка "Update": говорим ждущему Service Worker'у "активируйся"
export function activateUpdate(registration) {
  if (registration && registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }
}

// Настоящая проверка интернета: делаем запрос мимо кэша.
// (navigator.onLine иногда врёт: Wi-Fi есть, а интернета нет)
export async function checkConnection() {
  try {
    const url = `${import.meta.env.BASE_URL}manifest.json?check=${Date.now()}`
    const response = await fetch(url, { cache: 'no-store' })
    return response.ok
  } catch {
    return false
  }
}
