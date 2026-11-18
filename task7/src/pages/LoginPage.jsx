import { useState, useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage() {
  const { user, login, loginWithGoogle, error, clearError } = useAuth()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // убираем старую ошибку, когда открываем страницу
  useEffect(() => {
    clearError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Уже вошёл - отправляем туда, куда шёл (ProtectedRoute положил адрес в state.from), или в профиль
  if (user) {
    return <Navigate to={location.state?.from || '/profile'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    await login(email, password)
    // при успехе user поменяется и сработает <Navigate> выше
    setSubmitting(false)
  }

  async function handleGoogle() {
    setSubmitting(true)
    await loginWithGoogle()
    setSubmitting(false)
  }

  return (
    <section className="login-box">
      <h1>Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
        </label>
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="or">or</p>
      <button className="google-button" onClick={handleGoogle} disabled={submitting}>
        Sign in with Google
      </button>

      {error && <p className="message error">{error}</p>}

      <p className="auth-switch">
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </section>
  )
}

export default LoginPage
