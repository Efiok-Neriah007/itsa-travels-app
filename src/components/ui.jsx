import { Link } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useState } from 'react'

// Logo Component
export function Logo({ size = 'default', className = '' }) {
  const sizes = {
    small: { height: 36 },
    default: { height: 48 },
    large: { height: 64 },
  }

  return (
    <Link to="/" className={className} style={{ display: 'inline-block' }}>
      <img
        src="/logo.jpeg"
        alt="ITSA TRAVELS & EDU-CONSULT"
        style={{
          height: sizes[size].height,
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </Link>
  )
}

// Input Component
export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required,
  disabled,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={20}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`input ${Icon ? 'input-icon' : ''} ${error ? 'input-error' : ''}`}
          style={isPassword ? { paddingRight: '48px' } : {}}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '4px',
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

// Alert Component
export function Alert({ type = 'info', children, onClose }) {
  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertCircle,
    info: AlertCircle,
  }
  const Icon = icons[type]

  return (
    <div className={`alert alert-${type}`}>
      <Icon size={20} />
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}

// Loading Spinner
export function Spinner({ size = 'default', className = '' }) {
  const sizes = {
    small: { width: 16, height: 16, borderWidth: 2 },
    default: { width: 24, height: 24, borderWidth: 3 },
    large: { width: 40, height: 40, borderWidth: 4 },
  }

  return (
    <div
      className={`spinner ${className}`}
      style={sizes[size]}
    />
  )
}

// Page Loader
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div
      className="gradient-hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div className="spinner spinner-gold" style={{ width: 48, height: 48, borderWidth: 4 }} />
      <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem' }}>{message}</p>
    </div>
  )
}

// Badge Component
export function Badge({ variant = 'gray', children, className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}

// Card Component
export function Card({ children, hover = false, className = '', style = {} }) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`} style={style}>
      {children}
    </div>
  )
}

// Modal Component
export function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <X size={24} color="#64748b" />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      {Icon && (
        <div
          style={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, rgba(0,64,255,0.1), rgba(6,0,139,0.05))',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Icon size={36} color="#0040ff" />
        </div>
      )}
      <h3 style={{ marginBottom: '0.5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
        {title}
      </h3>
      {description && <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{description}</p>}
      {action}
    </div>
  )
}

// Status Badge for Applications
export function StatusBadge({ status }) {
  const statusConfig = {
    submitted: { label: 'Submitted', variant: 'blue' },
    documents_review: { label: 'Documents Review', variant: 'warning' },
    additional_docs_required: { label: 'Additional Docs Required', variant: 'warning' },
    processing: { label: 'Processing', variant: 'blue' },
    submitted_to_embassy: { label: 'Submitted to Embassy', variant: 'blue' },
    awaiting_response: { label: 'Awaiting Response', variant: 'blue' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'error' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'gray' },
  }

  const config = statusConfig[status] || { label: status, variant: 'gray' }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
