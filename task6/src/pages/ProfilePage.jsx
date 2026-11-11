import { useAuth } from '../context/AuthContext.jsx'

// Закрытая страница (обёрнута в ProtectedRoute), поэтому user здесь всегда есть
function ProfilePage() {
  const { user, logout, error } = useAuth()

  return (
    <section className="login-box">
      <h1>Profile</h1>

      <dl className="fields">
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>UID</dt>
        <dd className="uid">{user.uid}</dd>
        <dt>Signed in with</dt>
        <dd>{user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email / password'}</dd>
      </dl>

      {error && <p className="message error">{error}</p>}

      {/* после logout user станет null, ProtectedRoute сам перекинет на /login */}
      <button className="danger" onClick={logout}>
        Logout
      </button>
    </section>
  )
}

export default ProfilePage
