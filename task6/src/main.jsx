import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/queryClient.js'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/index.css'
import App from './App.jsx'

// QueryClientProvider - кэш запросов для всего приложения
// AuthProvider - текущий пользователь для всего приложения
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
