import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Logo, Badge, EmptyState, Alert } from '../components/ui'
import {
  Home, Users, FileText, MessageSquare, CreditCard, BarChart3, Settings,
  LogOut, Menu, X, Bell, Search, Plus, Filter, Download, Eye, CheckCircle,
  Clock, AlertCircle, TrendingUp, DollarSign
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, signOut, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login')
    }
  }, [user, loading, navigate])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'applications', icon: FileText, label: 'Applications' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  const stats = [
    { label: 'Total Applications', value: '0', icon: FileText, color: '#0040ff', change: '+0%' },
    { label: 'Active Clients', value: '0', icon: Users, color: '#10b981', change: '+0%' },
    { label: 'Revenue (NGN)', value: '₦0', icon: DollarSign, color: '#f59e0b', change: '+0%' },
    { label: 'Pending Review', value: '0', icon: Clock, color: '#ef4444', change: '0' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ background: '#0a0a1a' }}>
        <div className="sidebar-header" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Logo size="small" />
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{
                color: activeTab === item.id ? '#ffd700' : 'rgba(255,255,255,0.7)',
                background: activeTab === item.id ? 'rgba(255,215,0,0.1)' : 'transparent',
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Link to="/dashboard" className="sidebar-link" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <Eye size={20} />
            Client View
          </Link>
          <button onClick={handleLogout} className="sidebar-link" style={{ color: '#ef4444' }}>
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay hide-desktop" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="hide-desktop" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Menu size={24} color="#334155" />
            </button>
            <div className="hide-mobile">
              <h1 style={{ fontSize: '1.25rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
                Admin {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="hide-mobile" style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search..." className="input" style={{ paddingLeft: 44, width: 250 }} />
            </div>
            <button style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} color="#64748b" />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #ffd700, #ffb700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06008b', fontWeight: 700 }}>
                A
              </div>
              <div className="hide-mobile">
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-container">
          {!isAdmin && (
            <Alert type="warning" style={{ marginBottom: '1.5rem' }}>
              You may not have full admin privileges. Some features may be limited.
            </Alert>
          )}

          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat, i) => (
                  <div key={i} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ width: 48, height: 48, background: `${stat.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <stat.icon size={22} color={stat.color} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: stat.change.startsWith('+') ? '#10b981' : '#64748b', fontWeight: 500 }}>
                        {stat.change}
                      </span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{stat.label}</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary"><Plus size={18} /> New Application</button>
                  <button className="btn btn-secondary"><Users size={18} /> Add Client</button>
                  <button className="btn btn-secondary"><Download size={18} /> Export Data</button>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Recent Applications</h2>
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <EmptyState
                      icon={FileText}
                      title="No applications yet"
                      description="Applications will appear here"
                    />
                  </div>
                </div>
                <div className="card">
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Recent Messages</h2>
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <EmptyState
                      icon={MessageSquare}
                      title="No messages yet"
                      description="Client messages will appear here"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Applications</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary"><Filter size={18} /> Filter</button>
                  <button className="btn btn-primary"><Plus size={18} /> New Application</button>
                </div>
              </div>
              <div className="card" style={{ padding: '3rem' }}>
                <EmptyState icon={FileText} title="No applications" description="Applications will appear here once clients submit them" />
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Clients</h1>
                <button className="btn btn-primary"><Plus size={18} /> Add Client</button>
              </div>
              <div className="card" style={{ padding: '3rem' }}>
                <EmptyState icon={Users} title="No clients yet" description="Registered clients will appear here" />
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Messages</h1>
              <div className="card" style={{ padding: '3rem' }}>
                <EmptyState icon={MessageSquare} title="No messages" description="Client messages will appear here" />
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Payments</h1>
              <div className="card" style={{ padding: '3rem' }}>
                <EmptyState icon={CreditCard} title="No payments" description="Payment records will appear here" />
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Reports</h1>
              <div className="card" style={{ padding: '3rem' }}>
                <EmptyState icon={BarChart3} title="No data for reports" description="Reports will be generated once you have applications" />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Settings</h1>
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>Agency Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Agency Name</label>
                    <p style={{ fontWeight: 500 }}>ITSA TRAVELS & EDU-CONSULT</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <p style={{ fontWeight: 500 }}>info@itsatravels.com</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                    <p style={{ fontWeight: 500 }}>+234 801 234 5678</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Location</label>
                    <p style={{ fontWeight: 500 }}>Ibadan, Nigeria</p>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ marginTop: '2rem' }}>Edit Settings</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
