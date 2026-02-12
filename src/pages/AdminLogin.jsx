import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Logo, Input, Alert } from '../components/ui'
import { Mail, Lock, Shield, ArrowRight } from 'lucide-react'

export default function AdminLogin() {
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

    const { data, error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Check if user is admin (we'll verify on the admin dashboard)
    navigate('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #0a0a2e, #06008b)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 450, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="default" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
            <Shield size={24} color="#0040ff" />
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Admin Portal</h1>
          </div>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Sign in to access the admin dashboard</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="admin@itsatravels.com"
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

          <button type="submit" className="btn btn-blue btn-lg btn-full" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? (
              <div className="spinner spinner-white" style={{ width: 20, height: 20 }} />
            ) : (
              <>Sign In to Admin <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
          Not an admin? <Link to="/login" style={{ color: '#0040ff', fontWeight: 600 }}>Client Login</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '0.9rem' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
