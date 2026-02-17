import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'
import { Users, Award, Globe, Shield, CheckCircle, ArrowRight, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stats = [
    { number: '5,000+', label: 'Happy Clients' },
    { number: '98%', label: 'Success Rate' },
    { number: '50+', label: 'Countries' },
    { number: '10+', label: 'Years Experience' },
  ]

  const values = [
    { icon: Shield, title: 'Trust & Integrity', desc: 'We handle your applications with utmost honesty and transparency.' },
    { icon: Award, title: 'Excellence', desc: 'We strive to deliver the best possible outcomes for every client.' },
    { icon: Users, title: 'Client-Centric', desc: 'Your success is our priority. We go above and beyond for you.' },
    { icon: Globe, title: 'Global Reach', desc: 'Our network spans across continents to serve you better.' },
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
          <Link to="/about" style={{ color: '#0040ff', fontWeight: 600 }}>About</Link>
          <Link to="/contact" style={{ color: '#334155', fontWeight: 500 }}>Contact</Link>
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
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0040ff' }}>About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 600 }}>Contact</Link>
            <Link to="/login" className="btn btn-secondary btn-full">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-full">Get Started</Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ padding: '8rem 5% 4rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>About Us</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem' }}>
            Your Trusted Partner for <span style={{ color: '#0040ff' }}>Global Opportunities</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.8 }}>
            ITSA TRAVELS & EDU-CONSULT has been helping individuals achieve their international 
            dreams for over a decade. We specialize in visa processing, study abroad programs, 
            and travel services with an industry-leading 98% success rate.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 5%', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: 1000, margin: '0 auto' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, color: '#0040ff', marginBottom: '0.5rem' }}>
                {stat.number}
              </div>
              <div style={{ color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: '5rem 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Our Story</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>A Journey of Excellence</h2>
            <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '1rem' }}>
              Founded with a vision to make international opportunities accessible to everyone, 
              ITSA TRAVELS & EDU-CONSULT has grown from a small consultancy to one of Nigeria's 
              most trusted travel and education agencies.
            </p>
            <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Our team of experienced consultants has helped thousands of students achieve their 
              academic dreams, assisted professionals in securing work visas, and made countless 
              travel experiences seamless and memorable.
            </p>
            <Link to="/contact" className="btn btn-blue">Get in Touch <ArrowRight size={18} /></Link>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #0040ff, #06008b)', borderRadius: '24px', padding: '3rem', color: '#fff' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>Why Choose Us?</h3>
            {['Personalized consultation for every client', 'Transparent pricing with no hidden fees', 'Expert guidance throughout the process', 'Post-visa support and assistance', '24/7 customer support'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <CheckCircle size={20} color="#ffd700" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '5rem 5%', background: '#fff' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 4rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Our Values</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>What We Stand For</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: 1200, margin: '0 auto' }}>
          {values.map((value, i) => (
            <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, rgba(0,64,255,0.1), rgba(6,0,139,0.05))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <value.icon size={28} color="#0040ff" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{value.title}</h3>
              <p style={{ color: '#64748b' }}>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero" style={{ padding: '5rem 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem' }}>Ready to Start Your Journey?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem' }}>
          Let us help you achieve your international dreams. Contact us today for a free consultation.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
          <Link to="/contact" className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', color: '#fff' }}>Contact Us</Link>
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
