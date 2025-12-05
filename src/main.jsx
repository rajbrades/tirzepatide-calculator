import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginPage from './LoginPage.jsx'
import { AuthProvider, useAuth } from './AuthContext.jsx'

const AuthenticatedApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // LoginPage handles loading state
  }

  return user ? <App /> : <LoginPage />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  </StrictMode>,
)
