import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

function SignupPage() {
  const { user, signup, loginWithGoogle, error, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    clearError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // после регистрации Firebase сразу входит в аккаунт -> уходим в профиль
  if (user) {
    return <Navigate to="/profile" replace />
  }

  // Своя проверка формы ДО запроса в Firebase
  function validate() {
    if (!email.includes('@')) {
      return 'Please enter a valid email.'
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.'
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.'
    }
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const message = validate()
    setFormError(message)
    if (message) {
      return
    }

    setSubmitting(true)
    await signup(email, password)
    setSubmitting(false)
  }

  async function handleGoogle() {
    setSubmitting(true)
    await loginWithGoogle()
    setSubmitting(false)
  }

  return (
    <section className="login-box">
      <h1>Sign up</h1>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="at least 6 characters" />
        </label>
        <label>
          Confirm password
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="repeat password" />
        </label>
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="or">or</p>
      <button className="google-button" onClick={handleGoogle} disabled={submitting}>
        Sign up with Google
      </button>

      {/* formError - наша проверка, error - ошибка от Firebase */}
      {(formError || error) && <p className="message error">{formError || error}</p>}

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  )
}

export default SignupPage
