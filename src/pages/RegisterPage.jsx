import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Logo, Input, Alert } from '../components/ui'
import { Mail, Lock, User, Phone, CheckCircle, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#f8fafc',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 450 }} className="card p-4">
          <div
            style={{
              width: 80,
              height: 80,
              background: '#d1fae5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <CheckCircle size={40} color="#10b981" />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Check Your Email!</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.7 }}>
            We've sent a verification link to <strong>{formData.email}</strong>. 
            Please click the link in the email to verify your account and start using ITSA TRAVELS.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Didn't receive the email? Check your spam folder or wait a few minutes.
          </p>
          <Link to="/login" className="btn btn-blue btn-lg">
            Go to Login
          </Link>
        </div>
      </div>
    )
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
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Logo size="default" />
          
          <h1 style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '0.5rem' }}>
            Create your account
          </h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Join ITSA TRAVELS and start your journey today
          </p>

          {error && <Alert type="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange('email')}
              icon={Mail}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={handleChange('phone')}
              icon={Phone}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange('password')}
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              icon={Lock}
              required
            />

            <button
              type="submit"
              className="btn btn-blue btn-lg btn-full"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? (
                <div className="spinner spinner-white" style={{ width: 20, height: 20 }} />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0040ff', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Info Side */}
      <div
        className="hide-mobile"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
        }}
      >
        <div style={{ maxWidth: 400, color: '#fff' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' }}>
            Start Your Global Journey
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>
            Join thousands of successful travelers who trusted us with their dreams.
          </p>
          {[
            '98% visa approval rate',
            'Over 5,000 satisfied clients',
            'Expert consultants available 24/7',
            'Secure document handling',
          ].map(item => (
            <div
              key={item}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}
            >
              <CheckCircle size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
