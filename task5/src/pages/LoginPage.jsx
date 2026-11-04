import { useState } from 'react'

// Заглушка: настоящей авторизации пока нет, форма просто показывает сообщение
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setMessage('Authentication is not ready yet. It will be added in a future task.')
  }

  return (
    <section className="login-box">
      <h1>Login</h1>
      <p className="message">Sign in to manage the library (coming soon).</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </label>
        <button type="submit" className="primary">
          Sign in
        </button>
      </form>

      {message && <p className="info">{message}</p>}
    </section>
  )
}

export default LoginPage
