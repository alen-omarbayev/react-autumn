import { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService.js'

// Контекст - чтобы любой компонент мог узнать текущего пользователя без передачи props
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // loading = true, пока Firebase не сказал, вошёл пользователь или нет (сразу после F5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // onAuthStateChanged срабатывает: при запуске (восстановление сессии), при входе и при выходе
    const unsubscribe = authService.subscribeToAuth((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    // cleanup: отписываемся, когда провайдер удаляется
    return unsubscribe
  }, [])

  // Общая обёртка: чистит старую ошибку, вызывает действие, при ошибке сохраняет текст.
  // Возвращает true/false, чтобы страница знала, получилось или нет.
  async function runAction(action) {
    setError('')
    try {
      await action()
      return true
    } catch (err) {
      setError(authService.getAuthErrorMessage(err))
      return false
    }
  }

  const value = {
    user,
    loading,
    error,
    clearError: () => setError(''),
    signup: (email, password) => runAction(() => authService.signup(email, password)),
    login: (email, password) => runAction(() => authService.login(email, password)),
    loginWithGoogle: () => runAction(() => authService.loginWithGoogle()),
    logout: () => runAction(() => authService.logout()),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Свой хук: const { user, login, logout } = useAuth()
// eslint-disable-next-line react/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
