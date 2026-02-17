import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { PageLoader } from './components/ui'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallback from './pages/AuthCallback'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <PageLoader />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Admin Protected Route
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <PageLoader />
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }
  
  return children
}

// App Component
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Auth Callback for email verification */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Client Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
