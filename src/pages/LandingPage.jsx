import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Logo } from '../components/ui'
import {
  Plane, GraduationCap, Briefcase, FileText, Shield, Award, Globe,
  Menu, X, ArrowRight, CheckCircle, Phone, Mail, MapPin,
  Facebook, Instagram, Linkedin, Twitter
} from 'lucide-react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    { icon: GraduationCap, title: 'Study Visa', desc: 'BSc, MSc & PhD programs worldwide', tags: ['University Selection', 'Admission Support'] },
    { icon: Briefcase, title: 'Work Visa', desc: 'Poland, Germany, Slovakia & more', tags: ['Job Matching', 'Work Permits'] },
    { icon: Plane, title: 'Tourism & Travel', desc: 'Flights, hotels & tourist visas', tags: ['Flight Booking', 'Hotel Reservations'] },
    { icon: Award, title: 'Scholarships', desc: 'Chevening, Erasmus, Swedish Institute', tags: ['Application Help', 'Essay Review'] },
    { icon: FileText, title: 'CV & Documents', desc: 'Professional CV & motivation letters', tags: ['CV Writing', 'Personal Statements'] },
    { icon: Shield, title: 'Visa Counselling', desc: 'Expert guidance & mock interviews', tags: ['Free Consultation', 'Document Review'] },
  ]

  const destinations = [
    { flag: '🇬🇧', name: 'United Kingdom' },
    { flag: '🇨🇦', name: 'Canada' },
    { flag: '🇩🇪', name: 'Germany' },
    { flag: '🇵🇱', name: 'Poland' },
    { flag: '🇺🇸', name: 'United States' },
    { flag: '🇦🇺', name: 'Australia' },
  ]

  return (
    <>
      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '0.75rem 5%' : '1rem 5%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.3s',
        }}
      >
        <Logo size={scrolled ? 'small' : 'default'} />

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {[
            { label: 'Services', href: '#services' },
            { label: 'Destinations', href: '#destinations' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map(item => (
            item.href.startsWith('#') ? (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: scrolled ? '#334155' : 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  transition: 'color 0.3s',
                }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                style={{
                  color: scrolled ? '#334155' : 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  transition: 'color 0.3s',
                }}
              >
                {item.label}
              </Link>
            )
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '1rem' }}>
          {isAuthenticated ? (
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-primary">
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost"
                style={{ color: scrolled ? '#06008b' : '#fff', border: scrolled ? '2px solid #e2e8f0' : '2px solid rgba(255,255,255,0.3)' }}
              >
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="hide-desktop"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
        >
          {mobileMenuOpen ? (
            <X size={24} color={scrolled ? '#06008b' : '#fff'} />
          ) : (
            <Menu size={24} color={scrolled ? '#06008b' : '#fff'} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="hide-desktop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            zIndex: 999,
            padding: '5rem 2rem 2rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={24} color="#06008b" />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {['Services', 'About', 'Contact'].map(item => (
              <Link
                key={item}
                to={item === 'Services' ? '/#services' : `/${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '1.25rem', fontWeight: 600, color: '#06008b' }}
              >
                {item}
              </Link>
            ))}
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-full" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-full" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="gradient-hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '8rem 5% 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background elements */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(0,64,255,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        <div style={{ maxWidth: 650, position: 'relative', zIndex: 2 }}>
          <div
            className="badge badge-gold animate-fade-in-down"
            style={{ marginBottom: '1.5rem' }}
          >
            <Shield size={18} /> Trusted by 5,000+ Travelers
          </div>

          <h1
            className="animate-fade-in-up"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#fff',
              marginBottom: '1.5rem',
              lineHeight: 1.1,
            }}
          >
            Your Gateway to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ffd700, #ffb700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Global Opportunities
            </span>
          </h1>

          <p
            className="animate-fade-in-up"
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '2.5rem',
              lineHeight: 1.8,
              animationDelay: '0.1s',
            }}
          >
            Expert visa processing, study abroad guidance, and travel services. We make your
            international dreams a reality with our proven 98% success rate.
          </p>

          <div
            className="animate-fade-in-up"
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animationDelay: '0.2s' }}
          >
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Your Journey <ArrowRight size={20} />
            </Link>
            <a
              href="#services"
              className="btn btn-lg"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.3)',
                color: '#fff',
              }}
            >
              Explore Services
            </a>
          </div>

          <div
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              gap: '3rem',
              marginTop: '4rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              flexWrap: 'wrap',
              animationDelay: '0.3s',
            }}
          >
            {[
              { num: '98%', label: 'Success Rate' },
              { num: '5K+', label: 'Happy Clients' },
              { num: '50+', label: 'Countries' },
            ].map(stat => (
              <div key={stat.label}>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2.5rem',
                    color: '#ffd700',
                    display: 'block',
                  }}
                >
                  {stat.num}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Destinations Card */}
        <div
          className="hide-tablet"
          style={{
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: 350,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: 50,
                height: 50,
                background: 'linear-gradient(135deg, #ffd700, #ffb700)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={24} color="#06008b" />
            </div>
            <div>
              <h3
                style={{
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                }}
              >
                Popular Destinations
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                Where dreams take flight
              </p>
            </div>
          </div>
          <div id="destinations" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {destinations.map(d => (
              <span
                key={d.name}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 14px',
                  borderRadius: '50px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              >
                {d.flag} {d.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '6rem 5%', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 4rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>
            Our Services
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Comprehensive Travel & Education Solutions
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            From visa applications to academic support, we've got every step of your journey covered.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            maxWidth: 1400,
            margin: '0 auto',
          }}
        >
          {services.map((service, i) => (
            <div key={i} className="card card-hover" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, rgba(0,64,255,0.1), rgba(6,0,139,0.05))',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <service.icon size={28} color="#0040ff" />
              </div>
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '0.75rem',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                }}
              >
                {service.title}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{service.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {service.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#f1f5f9',
                      padding: '6px 12px',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      color: '#475569',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '6rem 5%', background: '#fff' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 4rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            Simple Process
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            How It Works
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Your journey to success in four easy steps
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          {[
            { num: '1', title: 'Register', desc: 'Create your account and tell us about your goals' },
            { num: '2', title: 'Select Service', desc: 'Choose from our wide range of services' },
            { num: '3', title: 'Upload Documents', desc: 'Securely upload required documents' },
            { num: '4', title: 'Track Progress', desc: 'Monitor your application status in real-time' },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  border: '4px solid #0040ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2rem',
                  color: '#0040ff',
                  fontWeight: 700,
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                }}
              >
                {step.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero" style={{ padding: '5rem 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem' }}>
          Ready to <span style={{ color: '#ffd700' }}>Come Fly With Us?</span>
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.15rem',
            marginBottom: '2rem',
            maxWidth: 600,
            margin: '0 auto 2rem',
          }}
        >
          Start your application today and take the first step towards your international dreams.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Start Your Application <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0a1a', padding: '4rem 5% 2rem', color: 'rgba(255,255,255,0.7)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            maxWidth: 1200,
            margin: '0 auto 3rem',
          }}
        >
          <div>
            <Logo size="default" />
            <p style={{ marginTop: '1rem', lineHeight: 1.8 }}>
              Your trusted partner for international travel, education, and career opportunities.
              Come fly with us!
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 40,
                    height: 40,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}
                >
                  <Icon size={18} color="#fff" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4
              style={{
                color: '#fff',
                fontFamily: "'Outfit', sans-serif",
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Services
            </h4>
            {['Study Visa', 'Work Visa', 'Tourism', 'Scholarships', 'CV Writing'].map(item => (
              <a
                key={item}
                href="#services"
                style={{ display: 'block', marginBottom: '0.75rem', transition: 'color 0.3s' }}
              >
                {item}
              </a>
            ))}
          </div>
          <div>
            <h4
              style={{
                color: '#fff',
                fontFamily: "'Outfit', sans-serif",
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Company
            </h4>
            {[
              { label: 'About Us', to: '/about' },
              { label: 'Contact', to: '/contact' },
              { label: 'Careers', to: '/contact' },
              { label: 'Admin', to: '/admin/login' },
            ].map(item => (
              <Link
                key={item.label}
                to={item.to}
                style={{ display: 'block', marginBottom: '0.75rem' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h4
              style={{
                color: '#fff',
                fontFamily: "'Outfit', sans-serif",
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Contact
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <Mail size={16} />
              <span>info@itsatravels.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <Phone size={16} />
              <span>+234 801 234 5678</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} />
              <span>Ibadan, Nigeria</span>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '2rem',
            textAlign: 'center',
          }}
        >
          <p>© {new Date().getFullYear()} ITSA TRAVELS & EDU-CONSULT. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
