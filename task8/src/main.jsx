import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/index.css'
import App from './App.jsx'

// Provider - даёт Redux store всем компонентам (useSelector / useDispatch)
// AuthProvider - текущий пользователь (вход остался в Context, как в task 6)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
