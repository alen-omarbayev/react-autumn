// Все вызовы Firebase Auth лежат здесь. Компоненты их напрямую не вызывают,
// они берут функции из useAuth() (см. context/AuthContext.jsx).
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'

// browserLocalPersistence - сессия хранится в браузере и НЕ пропадает после обновления страницы
// и закрытия вкладки. Пользователь выйдет только после logout.
const persistenceReady = setPersistence(auth, browserLocalPersistence)

export async function signup(email, password) {
  await persistenceReady
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function login(email, password) {
  await persistenceReady
  return signInWithEmailAndPassword(auth, email, password)
}

export async function loginWithGoogle() {
  await persistenceReady
  return signInWithPopup(auth, googleProvider)
}

export function logout() {
  return signOut(auth)
}

// Подписка на изменение пользователя (вошёл / вышел). Возвращает функцию отписки.
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback)
}

// Firebase возвращает коды ошибок вида "auth/wrong-password".
// Переводим их в понятный текст для пользователя.
export function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/missing-password':
      return 'Please enter a password.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/email-already-in-use':
      return 'This email is already registered.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Wrong email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in window was closed.'
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.'
    default:
      return error.message
  }
}
