import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { Logo, Badge, EmptyState, Alert, Modal } from '../components/ui'
import { Home, FileText, Users, MessageSquare, CreditCard, Settings, LogOut, Menu, Bell, Search, Eye, Check, X, Send, Download, RefreshCw, Clock, CheckCircle, AlertCircle, Filter, ChevronDown, Mail, Phone, MapPin, Calendar, Upload, DollarSign, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [clients, setClients] = useState([])
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageRecipient, setMessageRecipient] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      // Load all applications with user info
      const { data: apps } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Load all users/clients
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Load all documents
      const { data: docs } = await supabase
        .from('application_documents')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Load messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (apps) setApplications(apps)
      if (users) setClients(users)
      if (docs) setDocuments(docs)
      if (msgs) setMessages(msgs)
    } catch (err) {
      console.log('Error loading data:', err)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appId)
      
      if (error) throw error
      setSuccess(`Application status updated to ${newStatus}`)
      loadAllData()
      setSelectedApp(null)
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const updateDocumentStatus = async (docId, newStatus) => {
    try {
      const { error } = await supabase
        .from('application_documents')
        .update({ status: newStatus })
        .eq('id', docId)
      
      if (error) throw error
      setSuccess(`Document ${newStatus}`)
      loadAllData()
    } catch (err) {
      setError('Failed to update document')
    }
  }

  const sendMessage = async () => {
    if (!messageText.trim() || !messageRecipient) return
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: messageRecipient.id,
          subject: 'Message from ITSA Travels',
          content: messageText,
          is_from_admin: true,
          is_read: false
        })
      
      if (error) throw error
      setSuccess('Message sent successfully')
      setShowMessageModal(false)
      setMessageText('')
      setMessageRecipient(null)
      loadAllData()
    } catch (err) {
      setError('Failed to send message')
    }
  }

  const getClientById = (userId) => clients.find(c => c.id === userId)
  const getAppDocuments = (appId) => documents.filter(d => d.application_id === appId)
  const getClientApps = (clientId) => applications.filter(a => a.user_id === clientId)

  const serviceTypes = [
    { id: 'study_admission', label: 'Study Admission Application', price: 500000 },
    { id: 'work_permit', label: 'Work Permit Application', price: 3800000, priceMax: 5500000 },
    { id: 'tourist_visa', label: 'Tourist Visa Application', price: 3500000 },
    { id: 'scholarship', label: 'Scholarship Application', price: 300000 },
    { id: 'cv_writing', label: 'CV/Resume/Personal Statement Writing', price: 50000 },
    { id: 'consultation', label: 'Consultation', price: 15000 }
  ]

  const getServiceType = (app) => {
    try {
      const d = typeof app.form_data === 'string' ? JSON.parse(app.form_data) : app.form_data
      return d?.service_type
    } catch { return null }
  }

  const getServiceInfo = (app) => serviceTypes.find(s => s.id === getServiceType(app)) || { label: 'Application', price: 0 }
  
  const formatCurrency = (n) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n)
  const formatPrice = (s) => s.priceMax ? `${formatCurrency(s.price)} - ${formatCurrency(s.priceMax)}` : formatCurrency(s.price)

  const getStatusBadge = (status) => {
    const colors = { submitted: 'blue', documents_review: 'warning', processing: 'blue', approved: 'success', rejected: 'error', completed: 'success', pending_review: 'warning' }
    return <Badge variant={colors[status] || 'gray'}>{status?.replace(/_/g, ' ') || 'Unknown'}</Badge>
  }

  const filteredApplications = applications.filter(app => {
    const client = getClientById(app.user_id)
    const matchesSearch = searchTerm === '' || 
      client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText, color: '#0040ff' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'submitted').length, icon: Clock, color: '#f59e0b' },
    { label: 'Approved', value: applications.filter(a => a.status === 'approved').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Total Clients', value: clients.length, icon: Users, color: '#8b5cf6' }
  ]

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'applications', icon: FileText, label: 'Applications' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'documents', icon: Upload, label: 'Documents' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 400 }}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Access Denied</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>You don't have admin privileges.</p>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ background: '#1e293b', borderRight: '1px solid #334155' }}>
        <div className="sidebar-header" style={{ borderBottom: '1px solid #334155' }}>
          <Logo size="small" />
          <span style={{ color: '#fbbf24', fontSize: '0.75rem', marginLeft: '0.5rem' }}>ADMIN</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button key={item.id} className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }} style={{ color: activeTab === item.id ? '#fbbf24' : '#94a3b8' }}>
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer" style={{ borderTop: '1px solid #334155' }}>
          <Link to="/dashboard" className="sidebar-link" style={{ color: '#94a3b8' }}><Eye size={20} />View Client Portal</Link>
          <button onClick={handleLogout} className="sidebar-link" style={{ color: '#ef4444' }}><LogOut size={20} />Log Out</button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="main-content" style={{ background: '#0f172a' }}>
        <header className="top-header" style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="hide-desktop" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none' }}><Menu size={24} color="#fff" /></button>
            <h1 className="hide-mobile" style={{ fontSize: '1.25rem', color: '#fff' }}>{navItems.find(n => n.id === activeTab)?.label}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }} className="hide-mobile">
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ background: '#334155', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem 0.5rem 2.5rem', color: '#fff', width: 250 }} />
            </div>
            <button onClick={loadAllData} style={{ background: '#334155', border: 'none', borderRadius: '8px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><RefreshCw size={18} color="#94a3b8" /></button>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700 }}>A</div>
          </div>
        </header>

        <main className="page-container" style={{ background: '#0f172a' }}>
          {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
          {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Welcome, Admin! 👋</h1>
                <p style={{ color: '#94a3b8' }}>Here's an overview of your business</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((s, i) => (
                  <div key={i} className="card" style={{ padding: '1.5rem', background: '#1e293b', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 50, height: 50, background: `${s.color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={24} color={s.color} /></div>
                      <div><p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{s.label}</p><p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>{s.value}</p></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ color: '#fff' }}>Recent Applications</h2>
                  <button className="btn btn-ghost btn-sm" style={{ color: '#fbbf24' }} onClick={() => setActiveTab('applications')}>View All</button>
                </div>
                {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" /></div> : (
                  <div>{applications.slice(0, 5).map((app, i) => {
                    const client = getClientById(app.user_id)
                    const info = getServiceInfo(app)
                    return (
                      <div key={app.id} style={{ padding: '1rem', borderBottom: i < 4 ? '1px solid #334155' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <p style={{ color: '#fff', fontWeight: 600 }}>{client?.first_name} {client?.last_name}</p>
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{info.label}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getStatusBadge(app.status)}
                          <button className="btn btn-ghost btn-sm" style={{ color: '#94a3b8' }} onClick={() => setSelectedApp(app)}><Eye size={16} /></button>
                        </div>
                      </div>
                    )
                  })}</div>
                )}
              </div>
            </div>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', color: '#fff' }}>All Applications ({filteredApplications.length})</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: '#334155', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', color: '#fff' }}>
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="documents_review">Documents Review</option>
                    <option value="processing">Processing</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {loading ? <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" /></div> : filteredApplications.length === 0 ? (
                <div className="card" style={{ padding: '3rem', background: '#1e293b', border: '1px solid #334155', textAlign: 'center' }}>
                  <p style={{ color: '#94a3b8' }}>No applications found</p>
                </div>
              ) : (
                <div className="card" style={{ background: '#1e293b', border: '1px solid #334155', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#334155' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Client</th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }} className="hide-mobile">Service</th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }} className="hide-mobile">Date</th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'right', color: '#94a3b8', fontWeight: 500 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map(app => {
                        const client = getClientById(app.user_id)
                        const info = getServiceInfo(app)
                        return (
                          <tr key={app.id} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '1rem' }}>
                              <p style={{ color: '#fff', fontWeight: 500 }}>{client?.first_name} {client?.last_name}</p>
                              <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{client?.email}</p>
                            </td>
                            <td style={{ padding: '1rem', color: '#94a3b8' }} className="hide-mobile">{info.label}</td>
                            <td style={{ padding: '1rem', color: '#94a3b8' }} className="hide-mobile">{new Date(app.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: '1rem' }}>{getStatusBadge(app.status)}</td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                              <button className="btn btn-ghost btn-sm" style={{ color: '#fbbf24' }} onClick={() => setSelectedApp(app)}><Eye size={16} /> View</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CLIENTS TAB */}
          {activeTab === 'clients' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>Clients ({clients.length})</h1>
              {loading ? <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" /></div> : clients.length === 0 ? (
                <div className="card" style={{ padding: '3rem', background: '#1e293b', textAlign: 'center' }}><p style={{ color: '#94a3b8' }}>No clients yet</p></div>
              ) : (
                <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                  {clients.map((client, i) => (
                    <div key={client.id} style={{ padding: '1rem', borderBottom: i < clients.length - 1 ? '1px solid #334155' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 45, height: 45, background: 'linear-gradient(135deg, #0040ff, #06008b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>{client.first_name?.[0]}{client.last_name?.[0]}</div>
                        <div>
                          <p style={{ color: '#fff', fontWeight: 500 }}>{client.first_name} {client.last_name}</p>
                          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{client.email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Badge variant="blue">{getClientApps(client.id).length} apps</Badge>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#94a3b8' }} onClick={() => setSelectedClient(client)}><Eye size={16} /></button>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#fbbf24' }} onClick={() => { setMessageRecipient(client); setShowMessageModal(true) }}><Send size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>Documents ({documents.length})</h1>
              {documents.length === 0 ? (
                <div className="card" style={{ padding: '3rem', background: '#1e293b', textAlign: 'center' }}><p style={{ color: '#94a3b8' }}>No documents uploaded</p></div>
              ) : (
                <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                  {documents.map((doc, i) => {
                    const app = applications.find(a => a.id === doc.application_id)
                    const client = app ? getClientById(app.user_id) : null
                    return (
                      <div key={doc.id} style={{ padding: '1rem', borderBottom: i < documents.length - 1 ? '1px solid #334155' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <p style={{ color: '#fff', fontWeight: 500 }}>{doc.document_type}</p>
                          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{client?.first_name} {client?.last_name} • {doc.file_name}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getStatusBadge(doc.status)}
                          {doc.status === 'pending_review' && (
                            <>
                              <button className="btn btn-sm" style={{ background: '#10b981', color: '#fff' }} onClick={() => updateDocumentStatus(doc.id, 'approved')}><Check size={14} /></button>
                              <button className="btn btn-sm" style={{ background: '#ef4444', color: '#fff' }} onClick={() => updateDocumentStatus(doc.id, 'rejected')}><X size={14} /></button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', color: '#fff' }}>Messages</h1>
                <button className="btn btn-primary" onClick={() => setShowMessageModal(true)}><Send size={16} /> New Message</button>
              </div>
              {messages.length === 0 ? (
                <div className="card" style={{ padding: '3rem', background: '#1e293b', textAlign: 'center' }}><p style={{ color: '#94a3b8' }}>No messages yet</p></div>
              ) : (
                <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                  {messages.map((msg, i) => {
                    const recipient = getClientById(msg.recipient_id)
                    return (
                      <div key={msg.id} style={{ padding: '1rem', borderBottom: i < messages.length - 1 ? '1px solid #334155' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <p style={{ color: '#fff', fontWeight: 500 }}>To: {recipient?.first_name} {recipient?.last_name}</p>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{msg.content}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>Payment Tracking</h1>
              <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#334155' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Client</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }} className="hide-mobile">Service</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Amount</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => {
                      const client = getClientById(app.user_id)
                      const info = getServiceInfo(app)
                      return (
                        <tr key={app.id} style={{ borderBottom: '1px solid #334155' }}>
                          <td style={{ padding: '1rem', color: '#fff' }}>{client?.first_name} {client?.last_name}</td>
                          <td style={{ padding: '1rem', color: '#94a3b8' }} className="hide-mobile">{info.label}</td>
                          <td style={{ padding: '1rem', color: '#fbbf24', fontWeight: 600 }}>{formatPrice(info)}</td>
                          <td style={{ padding: '1rem' }}><Badge variant="warning">Pending</Badge></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>Settings</h1>
              <div className="card" style={{ padding: '2rem', background: '#1e293b', border: '1px solid #334155' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Agency Information</h3>
                <div style={{ color: '#94a3b8' }}>
                  <p><strong>Name:</strong> ITSA TRAVELS & EDU-CONSULT</p>
                  <p><strong>Email:</strong> info@itsatravels.com</p>
                  <p><strong>Phone:</strong> +234 XXX XXX XXXX</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* APPLICATION DETAILS MODAL */}
      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details">
        {selectedApp && (() => {
          const client = getClientById(selectedApp.user_id)
          const info = getServiceInfo(selectedApp)
          const fd = typeof selectedApp.form_data === 'string' ? JSON.parse(selectedApp.form_data || '{}') : (selectedApp.form_data || {})
          const appDocs = getAppDocuments(selectedApp.id)
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h3>{client?.first_name} {client?.last_name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{client?.email}</p>
                </div>
                {getStatusBadge(selectedApp.status)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <div><span style={{ color: '#64748b' }}>Service:</span> {info.label}</div>
                <div><span style={{ color: '#64748b' }}>Price:</span> {formatPrice(info)}</div>
                <div><span style={{ color: '#64748b' }}>Country:</span> {selectedApp.destination_country || 'N/A'}</div>
                <div><span style={{ color: '#64748b' }}>Travel Date:</span> {selectedApp.travel_date || 'N/A'}</div>
                <div><span style={{ color: '#64748b' }}>Submitted:</span> {new Date(selectedApp.created_at).toLocaleDateString()}</div>
                <div><span style={{ color: '#64748b' }}>Ref:</span> {selectedApp.reference_number || selectedApp.id.slice(0,8)}</div>
              </div>

              {fd.passport_number && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Personal Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div><span style={{ color: '#64748b' }}>Passport:</span> {fd.passport_number}</div>
                    <div><span style={{ color: '#64748b' }}>Marital:</span> {fd.marital_status || 'N/A'}</div>
                    <div><span style={{ color: '#64748b' }}>Issue:</span> {fd.passport_issue_date || 'N/A'}</div>
                    <div><span style={{ color: '#64748b' }}>Expiry:</span> {fd.passport_expiry_date || 'N/A'}</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}><span style={{ color: '#64748b' }}>Address:</span> {fd.home_address}, {fd.city}, {fd.state}</p>
                </div>
              )}

              {fd.next_of_kin?.full_name && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Next of Kin</h4>
                  <p style={{ fontSize: '0.85rem' }}>{fd.next_of_kin.full_name} ({fd.next_of_kin.relationship})</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{fd.next_of_kin.phone} • {fd.next_of_kin.email}</p>
                </div>
              )}

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Documents ({appDocs.length})</h4>
                {appDocs.length === 0 ? <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No documents</p> : appDocs.map(d => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                    <span>{d.document_type}</span>
                    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      {getStatusBadge(d.status)}
                      {d.status === 'pending_review' && (
                        <>
                          <button className="btn btn-sm" style={{ background: '#10b981', color: '#fff', padding: '0.25rem 0.5rem' }} onClick={() => updateDocumentStatus(d.id, 'approved')}><Check size={12} /></button>
                          <button className="btn btn-sm" style={{ background: '#ef4444', color: '#fff', padding: '0.25rem 0.5rem' }} onClick={() => updateDocumentStatus(d.id, 'rejected')}><X size={12} /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.75rem' }}>Update Status</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['submitted', 'documents_review', 'processing', 'approved', 'rejected', 'completed'].map(status => (
                    <button key={status} className={`btn btn-sm ${selectedApp.status === status ? 'btn-primary' : 'btn-secondary'}`} onClick={() => updateApplicationStatus(selectedApp.id, status)} disabled={selectedApp.status === status}>
                      {status.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setMessageRecipient(client); setShowMessageModal(true); setSelectedApp(null) }}><Send size={16} /> Message Client</button>
              </div>
            </div>
          )
        })()}
      </Modal>

      {/* CLIENT DETAILS MODAL */}
      <Modal isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} title="Client Details">
        {selectedClient && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #0040ff, #06008b)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>{selectedClient.first_name?.[0]}{selectedClient.last_name?.[0]}</div>
              <div>
                <h3>{selectedClient.first_name} {selectedClient.last_name}</h3>
                <p style={{ color: '#64748b' }}>{selectedClient.email}</p>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.9rem' }}><Phone size={14} style={{ marginRight: '0.5rem' }} />{selectedClient.phone || 'No phone'}</p>
              <p style={{ fontSize: '0.9rem' }}><Calendar size={14} style={{ marginRight: '0.5rem' }} />Joined: {new Date(selectedClient.created_at).toLocaleDateString()}</p>
            </div>
            <h4 style={{ marginBottom: '0.5rem' }}>Applications ({getClientApps(selectedClient.id).length})</h4>
            {getClientApps(selectedClient.id).map(app => (
              <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                <span>{getServiceInfo(app).label}</span>
                {getStatusBadge(app.status)}
              </div>
            ))}
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => { setMessageRecipient(selectedClient); setShowMessageModal(true); setSelectedClient(null) }}><Send size={16} /> Send Message</button>
          </div>
        )}
      </Modal>

      {/* MESSAGE MODAL */}
      <Modal isOpen={showMessageModal} onClose={() => { setShowMessageModal(false); setMessageText(''); setMessageRecipient(null) }} title="Send Message">
        <div className="form-group">
          <label className="form-label">Recipient</label>
          {messageRecipient ? (
            <p style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>{messageRecipient.first_name} {messageRecipient.last_name} ({messageRecipient.email})</p>
          ) : (
            <select className="input" onChange={e => setMessageRecipient(clients.find(c => c.id === e.target.value))}>
              <option value="">Select client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="input" rows={5} placeholder="Type your message..." value={messageText} onChange={e => setMessageText(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowMessageModal(false)}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={sendMessage} disabled={!messageText.trim() || !messageRecipient}><Send size={16} /> Send</button>
        </div>
      </Modal>
    </div>
  )
}
