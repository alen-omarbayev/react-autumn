import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Маленький свой плагин: после сборки создаёт dist/sw.js из шаблона sw/service-worker.js.
// Зачем: имена файлов сборки каждый раз разные (index-AbC123.js), и Service Worker
// должен знать их все, чтобы положить в кэш (pre-cache) оболочку приложения.
function serviceWorkerPlugin() {
  return {
    name: 'build-service-worker',
    apply: 'build', // только для npm run build, в npm run dev Service Worker не нужен
    closeBundle() {
      const distDir = path.resolve('dist')

      // 1. Собираем список всех файлов в dist (кроме самого sw.js)
      const files = []
      function walk(dir) {
        for (const name of fs.readdirSync(dir)) {
          const fullPath = path.join(dir, name)
          if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath)
          } else {
            const relative = path.relative(distDir, fullPath).split(path.sep).join('/')
            if (relative !== 'sw.js') files.push('./' + relative)
          }
        }
      }
      walk(distDir)
      files.push('./') // стартовая страница (start_url)

      // 2. Версия = время сборки. Новая сборка -> новая версия -> браузер видит обновление.
      const version = new Date().toISOString().replace(/[-:.TZ]/g, '')

      // 3. Подставляем значения в шаблон и сохраняем
      const template = fs.readFileSync(path.resolve('sw/service-worker.js'), 'utf-8')
      const result = template
        .replace('__VERSION__', version)
        .replace('__PRECACHE_FILES__', JSON.stringify(files, null, 2))
      fs.writeFileSync(path.join(distDir, 'sw.js'), result)

      console.log(`\n[sw] dist/sw.js created: version ${version}, ${files.length} files pre-cached`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serviceWorkerPlugin()],
  base: '/react-autumn/task7/',
})
