import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo, Input, Alert } from '../components/ui'
import { Phone, Mail, MapPin, Clock, Send, Menu, X, MessageSquare } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSuccess(true)
    setLoading(false)
  }

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+234 801 234 5678', href: 'tel:+2348012345678' },
    { icon: Mail, label: 'Email', value: 'info@itsatravels.com', href: 'mailto:info@itsatravels.com' },
    { icon: MapPin, label: 'Address', value: 'Ibadan, Nigeria', href: '#' },
    { icon: Clock, label: 'Hours', value: 'Mon - Fri: 9am - 6pm', href: '#' },
  ]

  return (
    <>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '1rem 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      }}>
        <Logo />
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: '#334155', fontWeight: 500 }}>Home</Link>
          <Link to="/about" style={{ color: '#334155', fontWeight: 500 }}>About</Link>
          <Link to="/contact" style={{ color: '#0040ff', fontWeight: 600 }}>Contact</Link>
        </div>
        <div className="hide-mobile" style={{ display: 'flex', gap: '1rem' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
        <button className="hide-desktop" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none' }}>
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1001, padding: '2rem' }}>
          <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none' }}>
            <X size={24} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '3rem' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 600 }}>Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 600 }}>About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0040ff' }}>Contact</Link>
            <Link to="/login" className="btn btn-secondary btn-full">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-full">Get Started</Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ padding: '8rem 5% 4rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Contact Us</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem' }}>
            Get in <span style={{ color: '#0040ff' }}>Touch</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.8 }}>
            Have questions? We're here to help! Reach out to us and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '4rem 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          {/* Contact Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
              <MessageSquare size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
              Send us a Message
            </h2>

            {success ? (
              <Alert type="success">
                Thank you for your message! We'll get back to you within 24 hours.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input label="Your Name" placeholder="John Doe" value={formData.name} onChange={handleChange('name')} required />
                  <Input label="Email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange('email')} required />
                </div>
                <Input label="Phone" type="tel" placeholder="+234 800 000 0000" value={formData.phone} onChange={handleChange('phone')} />
                <div className="form-group">
                  <label className="form-label">Subject <span className="required">*</span></label>
                  <select className="input" value={formData.subject} onChange={handleChange('subject')} required>
                    <option value="">Select a subject</option>
                    <option value="study-visa">Study Visa Inquiry</option>
                    <option value="work-visa">Work Visa Inquiry</option>
                    <option value="tourism">Tourism & Travel</option>
                    <option value="scholarship">Scholarship Application</option>
                    <option value="cv-services">CV Writing Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message <span className="required">*</span></label>
                  <textarea className="input" placeholder="How can we help you?" value={formData.message} onChange={handleChange('message')} rows={5} required />
                </div>
                <button type="submit" className="btn btn-blue btn-lg btn-full" disabled={loading}>
                  {loading ? <div className="spinner spinner-white" style={{ width: 20, height: 20 }} /> : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
              Contact Information
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {contactInfo.map((info, i) => (
                <a key={i} href={info.href} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s' }}>
                  <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg, rgba(0,64,255,0.1), rgba(6,0,139,0.05))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <info.icon size={22} color="#0040ff" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>{info.label}</p>
                    <p style={{ fontWeight: 600, color: '#06008b' }}>{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #0040ff, #06008b)', borderRadius: '20px', padding: '3rem', color: '#fff', textAlign: 'center' }}>
              <MapPin size={48} style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Visit Our Office</h3>
              <p style={{ opacity: 0.8 }}>Ibadan, Oyo State, Nigeria</p>
              <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0a1a', padding: '3rem 5%', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
        <Logo />
        <p style={{ marginTop: '1rem' }}>© {new Date().getFullYear()} ITSA TRAVELS & EDU-CONSULT. All rights reserved.</p>
      </footer>
    </>
  )
}
