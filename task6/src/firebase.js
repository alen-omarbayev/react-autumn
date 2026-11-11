// Инициализация Firebase. Все ключи берутся из .env.local через import.meta.env
// (Vite отдаёт в браузер только переменные, которые начинаются с VITE_)
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

// auth - объект авторизации, его используют authService.js и AuthContext.jsx
export const auth = getAuth(app)

// провайдер для входа через Google
export const googleProvider = new GoogleAuthProvider()
