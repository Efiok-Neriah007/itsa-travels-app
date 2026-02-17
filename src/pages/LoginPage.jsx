import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Logo, Input, Alert } from '../components/ui'
import { Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Form Side */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Logo size="default" />
          
          <h1 style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '0.5rem' }}>
            Welcome back
          </h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Sign in to access your dashboard
          </p>

          {error && <Alert type="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <Link to="/forgot-password" style={{ color: '#0040ff', fontSize: '0.9rem' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-blue btn-lg btn-full" disabled={loading}>
              {loading ? (
                <div className="spinner spinner-white" style={{ width: 20, height: 20 }} />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0040ff', fontWeight: 600 }}>
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Info Side */}
      <div
        className="hide-mobile"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0040ff, #06008b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div style={{ maxWidth: 400, position: 'relative', zIndex: 1, color: '#fff' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' }}>
            Track Your Applications in Real-Time
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
            Get instant updates on your visa applications, flight bookings, and more.
          </p>
          {[
            'Real-time status updates',
            'Secure document storage',
            'Direct messaging with consultants',
          ].map(item => (
            <div
              key={item}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={14} color="#fff" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
