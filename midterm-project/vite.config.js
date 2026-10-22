import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base нужен для GitHub Pages: сайт лежит не в корне, а в /react-autumn/midterm-project/
export default defineConfig({
  plugins: [react()],
  base: '/react-autumn/midterm-project/',
})
