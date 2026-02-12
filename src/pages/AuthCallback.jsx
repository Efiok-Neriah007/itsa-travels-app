import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/ui'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function AuthCallback() {
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        if (error) {
          setStatus('error')
          setMessage(errorDescription || 'Authentication failed')
          return
        }

        // Check for code (PKCE flow)
        const code = searchParams.get('code')
        
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setStatus('error')
            setMessage(exchangeError.message)
            return
          }
          
          if (data.session) {
            setStatus('success')
            setMessage('Email verified successfully! Redirecting to dashboard...')
            setTimeout(() => navigate('/dashboard'), 2000)
            return
          }
        }

        // Check hash params (implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')
        const hashError = hashParams.get('error_description')

        if (hashError) {
          setStatus('error')
          setMessage(decodeURIComponent(hashError))
          return
        }

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            setStatus('error')
            setMessage(sessionError.message)
            return
          }

          setStatus('success')
          
          if (type === 'recovery') {
            setMessage('Password reset link verified! Redirecting...')
            setTimeout(() => navigate('/reset-password'), 2000)
          } else {
            setMessage('Email verified successfully! Redirecting to dashboard...')
            setTimeout(() => navigate('/dashboard'), 2000)
          }
          return
        }

        // Check if already logged in
        const { data: sessionData } = await supabase.auth.getSession()
        
        if (sessionData.session) {
          setStatus('success')
          setMessage('You are already logged in! Redirecting...')
          setTimeout(() => navigate('/dashboard'), 2000)
          return
        }

        // No valid params found
        setStatus('error')
        setMessage('Invalid or expired verification link. Please try again.')
        
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    handleCallback()
  }, [navigate, searchParams])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: 450, padding: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Logo size="default" />
        </div>

        {status === 'verifying' && (
          <>
            <div style={{
              width: 64,
              height: 64,
              border: '4px solid #e2e8f0',
              borderTopColor: '#0040ff',
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              animation: 'spin 1s linear infinite',
            }} />
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Verifying Your Email...</h2>
            <p style={{ color: '#64748b' }}>Please wait while we complete the verification.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: 80,
              height: 80,
              background: '#d1fae5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <CheckCircle size={40} color="#10b981" />
            </div>
            <h2 style={{ marginBottom: '0.5rem', color: '#059669', fontSize: '1.5rem' }}>Success!</h2>
            <p style={{ color: '#64748b' }}>{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: 80,
              height: 80,
              background: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <XCircle size={40} color="#ef4444" />
            </div>
            <h2 style={{ marginBottom: '0.5rem', color: '#dc2626', fontSize: '1.5rem' }}>Verification Failed</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>{message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-secondary">
                Go to Login
              </Link>
              <Link to="/register" className="btn btn-blue">
                Register Again
              </Link>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
