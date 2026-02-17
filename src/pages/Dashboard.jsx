import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { Logo, Badge, EmptyState, Alert, Modal } from '../components/ui'
import { Home, FileText, MessageSquare, Upload, User, LogOut, Menu, Bell, Plus, Clock, CheckCircle, AlertCircle, ArrowRight, GraduationCap, Briefcase, Plane, Award, Calendar, MapPin, Save, CreditCard, Building, Wallet, Eye, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showNewAppModal, setShowNewAppModal] = useState(false)
  const [showAppDetails, setShowAppDetails] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [applications, setApplications] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [appLoading, setAppLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formStep, setFormStep] = useState(1)
  
  const [newApp, setNewApp] = useState({
    service_type: '', destination_country: '', travel_date: '', notes: '',
    marital_status: '', passport_number: '', passport_issue_date: '', passport_expiry_date: '',
    home_address: '', city: '', state: '', postal_code: '',
    nok_full_name: '', nok_relationship: '', nok_phone: '', nok_email: '', nok_address: ''
  })

  const [uploadFile, setUploadFile] = useState(null)
  const [uploadType, setUploadType] = useState('')
  const [uploadAppId, setUploadAppId] = useState(null)

  useEffect(() => { loadApplications(); loadDocuments() }, [user])

  const loadApplications = async () => {
    if (!user || !supabase) { setLoading(false); return }
    try {
      const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single()
      if (userData) {
        const { data } = await supabase.from('applications').select('*').eq('user_id', userData.id).order('created_at', { ascending: false })
        if (data) setApplications(data)
      }
    } catch (err) { console.log('Error:', err) }
    setLoading(false)
  }

  const loadDocuments = async () => {
    if (!user || !supabase) return
    try {
      const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single()
      if (userData) {
        const { data } = await supabase.from('application_documents').select('*').order('created_at', { ascending: false })
        if (data) setDocuments(data)
      }
    } catch (err) { console.log('Error:', err) }
  }

  const handleLogout = async () => { try { await signOut(); window.location.href = '/' } catch { window.location.href = '/' } }

  const resetForm = () => {
    setNewApp({ service_type: '', destination_country: '', travel_date: '', notes: '', marital_status: '', passport_number: '', passport_issue_date: '', passport_expiry_date: '', home_address: '', city: '', state: '', postal_code: '', nok_full_name: '', nok_relationship: '', nok_phone: '', nok_email: '', nok_address: '' })
    setFormStep(1)
  }

  const handleCreateApplication = async (e) => {
    e.preventDefault()
    setAppLoading(true)
    setError('')
    if (!newApp.service_type) { setError('Please select a service type'); setAppLoading(false); return }
    try {
      const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single()
      if (!userData) { setError('User not found'); setAppLoading(false); return }
      const formData = { service_type: newApp.service_type, marital_status: newApp.marital_status, passport_number: newApp.passport_number, passport_issue_date: newApp.passport_issue_date, passport_expiry_date: newApp.passport_expiry_date, home_address: newApp.home_address, city: newApp.city, state: newApp.state, postal_code: newApp.postal_code, next_of_kin: { full_name: newApp.nok_full_name, relationship: newApp.nok_relationship, phone: newApp.nok_phone, email: newApp.nok_email, address: newApp.nok_address } }
      const { error } = await supabase.from('applications').insert({ user_id: userData.id, destination_country: newApp.destination_country || null, travel_date: newApp.travel_date || null, client_notes: newApp.notes || null, status: 'submitted', priority: 'normal', form_data: formData }).select().single()
      if (error) { setError(error.message); setAppLoading(false); return }
      setSuccess('Application submitted! Upload documents and make payment.')
      setShowNewAppModal(false)
      resetForm()
      loadApplications()
      setActiveTab('applications')
    } catch { setError('Error occurred') }
    setAppLoading(false)
  }

  const handleDocumentUpload = async (e) => {
    e.preventDefault()
    if (!uploadFile || !uploadType || !uploadAppId) { setError('Select file, type and application'); return }
    setUploadLoading(true)
    try {
      const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single()
      if (!userData) { setError('User not found'); setUploadLoading(false); return }
      const fileName = `${userData.id}/${Date.now()}.${uploadFile.name.split('.').pop()}`
      await supabase.storage.from('documents').upload(fileName, uploadFile).catch(() => {})
      const { error } = await supabase.from('application_documents').insert({ application_id: uploadAppId, document_type: uploadType, file_name: uploadFile.name, file_path: fileName, file_size: uploadFile.size, mime_type: uploadFile.type, uploaded_by: userData.id, status: 'pending_review' })
      if (error) { setError(error.message); setUploadLoading(false); return }
      setSuccess('Document uploaded!')
      setShowUploadModal(false)
      setUploadFile(null)
      setUploadType('')
      setUploadAppId(null)
      loadDocuments()
    } catch { setError('Upload failed') }
    setUploadLoading(false)
  }

  const navItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'applications', icon: FileText, label: 'My Applications' },
    { id: 'documents', icon: Upload, label: 'Documents' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' }
  ]

  const serviceTypes = [
    { id: 'study_admission', label: 'Study Admission Application', icon: GraduationCap, desc: 'University & college programs', price: 500000 },
    { id: 'work_permit', label: 'Work Permit Application', icon: Briefcase, desc: 'Employment permits', price: 3800000, priceMax: 5500000 },
    { id: 'tourist_visa', label: 'Tourist Visa Application', icon: Plane, desc: 'Travel & tourism', price: 3500000 },
    { id: 'scholarship', label: 'Scholarship Application', icon: Award, desc: 'Funding opportunities', price: 300000 },
    { id: 'cv_writing', label: 'CV/Resume/Personal Statement Writing', icon: FileText, desc: 'Professional documents', price: 50000 },
    { id: 'consultation', label: 'Consultation', icon: MessageSquare, desc: 'Expert guidance', price: 15000 }
  ]

  const documentTypes = ['International Passport', 'Passport Photograph', 'Birth Certificate', 'Educational Certificates', 'Transcripts', 'Employment Letter', 'Bank Statement', 'Proof of Address', 'Marriage Certificate', 'Other']
  const countries = ['United Kingdom', 'Canada', 'United States', 'Germany', 'Poland', 'Australia', 'France', 'Netherlands', 'Ireland', 'Sweden', 'Other']

  const getServiceType = (app) => { try { const d = typeof app.form_data === 'string' ? JSON.parse(app.form_data) : app.form_data; return d?.service_type } catch { return null } }
  const getServiceInfo = (app) => serviceTypes.find(s => s.id === getServiceType(app)) || { label: 'Application', icon: FileText, price: 0 }
  const getStatusBadge = (status) => { const m = { submitted: 'blue', documents_review: 'warning', processing: 'blue', approved: 'success', rejected: 'error', completed: 'success' }; return <Badge variant={m[status] || 'gray'}>{status?.replace('_', ' ') || 'Unknown'}</Badge> }
  const formatCurrency = (n) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n)
  const formatPrice = (service) => service.priceMax ? `${formatCurrency(service.price)} - ${formatCurrency(service.priceMax)}` : formatCurrency(service.price)
  const getAppDocs = (id) => documents.filter(d => d.application_id === id)

  const stats = [
    { label: 'Total', value: applications.length, icon: FileText, color: '#0040ff' },
    { label: 'In Progress', value: applications.filter(a => ['submitted','documents_review','processing'].includes(a.status)).length, icon: Clock, color: '#f59e0b' },
    { label: 'Completed', value: applications.filter(a => ['approved','completed'].includes(a.status)).length, icon: CheckCircle, color: '#10b981' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><Logo size="small" /></div>
        <nav className="sidebar-nav">
          {navItems.map(item => <button key={item.id} className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}><item.icon size={20} />{item.label}</button>)}
          {isAdmin && <Link to="/admin" className="sidebar-link" style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}><AlertCircle size={20} />Admin</Link>}
        </nav>
        <div className="sidebar-footer"><button onClick={handleLogout} className="sidebar-link" style={{ color: '#ef4444' }}><LogOut size={20} />Log Out</button></div>
      </aside>
      {sidebarOpen && <div className="sidebar-overlay hide-desktop" onClick={() => setSidebarOpen(false)} />}

      <div className="main-content">
        <header className="top-header">
          <button className="hide-desktop" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none' }}><Menu size={24} /></button>
          <h1 className="hide-mobile" style={{ fontSize: '1.25rem' }}>{navItems.find(n => n.id === activeTab)?.label}</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={20} color="#64748b" /></button>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0040ff, #06008b)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>{user?.email?.[0]?.toUpperCase()}</div>
          </div>
        </header>

        <main className="page-container">
          {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
          {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Welcome{profile?.first_name ? `, ${profile.first_name}` : ''}! 👋</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((s, i) => <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ width: 50, height: 50, background: `${s.color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={24} color={s.color} /></div><div><p style={{ color: '#64748b', fontSize: '0.85rem' }}>{s.label}</p><p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{s.value}</p></div></div>)}
              </div>
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Start New Application</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  {serviceTypes.map(s => <button key={s.id} className="card card-hover" style={{ padding: '1rem', border: 'none', cursor: 'pointer', textAlign: 'center' }} onClick={() => { setNewApp({...newApp, service_type: s.id}); setShowNewAppModal(true) }}><s.icon size={28} color="#0040ff" style={{ marginBottom: '0.5rem' }} /><p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</p><p style={{ color: '#0040ff', fontWeight: 600, fontSize: '0.8rem' }}>{formatPrice(s)}</p></button>)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem' }}>My Applications</h1>
                <button className="btn btn-primary" onClick={() => setShowNewAppModal(true)}><Plus size={18} /> New</button>
              </div>
              {applications.length === 0 ? <div className="card" style={{ padding: '3rem' }}><EmptyState icon={FileText} title="No applications" action={<button className="btn btn-primary" onClick={() => setShowNewAppModal(true)}><Plus size={18} /> Create</button>} /></div> : (
                <div className="card">{applications.map((app, i) => { const info = getServiceInfo(app); return (
                  <div key={app.id} style={{ padding: '1rem', borderBottom: i < applications.length-1 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <info.icon size={24} color="#0040ff" />
                      <div><p style={{ fontWeight: 600 }}>{info.label}</p><p style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.destination_country || 'N/A'} • {new Date(app.created_at).toLocaleDateString()}</p></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {getStatusBadge(app.status)}
                      <button className="btn btn-ghost btn-sm" onClick={() => setShowAppDetails(app)}><Eye size={16} /> View</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setUploadAppId(app.id); setShowUploadModal(true) }}><Upload size={16} /> Upload</button>
                      <button className="btn btn-primary btn-sm" onClick={() => setShowPaymentModal(app)}><CreditCard size={16} /> Pay</button>
                    </div>
                  </div>
                )})}</div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h1 style={{ fontSize: '1.5rem' }}>Documents</h1><button className="btn btn-primary" onClick={() => setShowUploadModal(true)}><Upload size={18} /> Upload</button></div>
              {documents.length === 0 ? <div className="card" style={{ padding: '3rem' }}><EmptyState icon={Upload} title="No documents" action={<button className="btn btn-primary" onClick={() => setShowUploadModal(true)}><Upload size={18} /> Upload</button>} /></div> : (
                <div className="card">{documents.map((d, i) => <div key={d.id} style={{ padding: '1rem', borderBottom: i < documents.length-1 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between' }}><div><p style={{ fontWeight: 600 }}>{d.document_type}</p><p style={{ fontSize: '0.8rem', color: '#64748b' }}>{d.file_name}</p></div><Badge variant={d.status === 'approved' ? 'success' : 'warning'}>{d.status}</Badge></div>)}</div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Payments</h1>
              {applications.length === 0 ? <div className="card" style={{ padding: '3rem' }}><EmptyState icon={CreditCard} title="No payments" /></div> : (
                <div className="card">{applications.map((app, i) => { const info = getServiceInfo(app); return <div key={app.id} style={{ padding: '1rem', borderBottom: i < applications.length-1 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><p style={{ fontWeight: 600 }}>{info.label}</p><p style={{ fontSize: '0.8rem', color: '#64748b' }}>Ref: {app.id.slice(0,8)}</p></div><div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><p style={{ fontWeight: 700, color: '#0040ff' }}>{formatCurrency(info.price)}</p><button className="btn btn-primary btn-sm" onClick={() => setShowPaymentModal(app)}>Pay Now</button></div></div>})}</div>
              )}
            </div>
          )}

          {activeTab === 'messages' && <div className="animate-fade-in"><h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Messages</h1><div className="card" style={{ padding: '3rem' }}><EmptyState icon={MessageSquare} title="No messages" /></div></div>}

          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Profile</h1>
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ width: 70, height: 70, background: 'linear-gradient(135deg, #0040ff, #06008b)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>{user?.email?.[0]?.toUpperCase()}</div>
                  <div><h2>{profile?.first_name} {profile?.last_name}</h2><p style={{ color: '#64748b' }}>{user?.email}</p></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* NEW APPLICATION MODAL */}
      <Modal isOpen={showNewAppModal} onClose={() => { setShowNewAppModal(false); resetForm() }} title={`New Application - Step ${formStep}/3`}>
        <div style={{ background: '#fef3c7', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '10px' }}>
          <AlertTriangle size={20} color="#b45309" />
          <p style={{ fontSize: '0.85rem', color: '#92400e' }}><strong>Warning:</strong> Information and documents cannot be altered after submission.</p>
        </div>

        {formStep === 1 && <>
          <div className="form-group"><label className="form-label">Service *</label><select className="input" value={newApp.service_type} onChange={e => setNewApp({...newApp, service_type: e.target.value})}><option value="">Select</option>{serviceTypes.map(s => <option key={s.id} value={s.id}>{s.label} - {formatPrice(s)}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Country</label><select className="input" value={newApp.destination_country} onChange={e => setNewApp({...newApp, destination_country: e.target.value})}><option value="">Select</option>{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Travel Date</label><input type="date" className="input" value={newApp.travel_date} onChange={e => setNewApp({...newApp, travel_date: e.target.value})} /></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}><button className="btn btn-secondary" onClick={() => setShowNewAppModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => setFormStep(2)} disabled={!newApp.service_type}>Next <ArrowRight size={16} /></button></div>
        </>}

        {formStep === 2 && <>
          <h3 style={{ marginBottom: '1rem' }}>Personal Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Marital Status</label><select className="input" value={newApp.marital_status} onChange={e => setNewApp({...newApp, marital_status: e.target.value})}><option value="">Select</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option></select></div>
            <div className="form-group"><label className="form-label">Passport No. *</label><input className="input" placeholder="A12345678" value={newApp.passport_number} onChange={e => setNewApp({...newApp, passport_number: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Passport Issue</label><input type="date" className="input" value={newApp.passport_issue_date} onChange={e => setNewApp({...newApp, passport_issue_date: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Passport Expiry</label><input type="date" className="input" value={newApp.passport_expiry_date} onChange={e => setNewApp({...newApp, passport_expiry_date: e.target.value})} /></div>
          </div>
          <div className="form-group"><label className="form-label">Home Address</label><input className="input" placeholder="123 Main St" value={newApp.home_address} onChange={e => setNewApp({...newApp, home_address: e.target.value})} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">City</label><input className="input" value={newApp.city} onChange={e => setNewApp({...newApp, city: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">State</label><input className="input" value={newApp.state} onChange={e => setNewApp({...newApp, state: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Postal Code</label><input className="input" value={newApp.postal_code} onChange={e => setNewApp({...newApp, postal_code: e.target.value})} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}><button className="btn btn-secondary" onClick={() => setFormStep(1)}>Back</button><button className="btn btn-primary" onClick={() => setFormStep(3)}>Next <ArrowRight size={16} /></button></div>
        </>}

        {formStep === 3 && <>
          <h3 style={{ marginBottom: '1rem' }}>Next of Kin</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Full Name *</label><input className="input" value={newApp.nok_full_name} onChange={e => setNewApp({...newApp, nok_full_name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Relationship</label><select className="input" value={newApp.nok_relationship} onChange={e => setNewApp({...newApp, nok_relationship: e.target.value})}><option value="">Select</option><option>Spouse</option><option>Parent</option><option>Sibling</option><option>Child</option><option>Other</option></select></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="input" value={newApp.nok_phone} onChange={e => setNewApp({...newApp, nok_phone: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Email</label><input type="email" className="input" value={newApp.nok_email} onChange={e => setNewApp({...newApp, nok_email: e.target.value})} /></div>
          </div>
          <div className="form-group"><label className="form-label">Address</label><input className="input" value={newApp.nok_address} onChange={e => setNewApp({...newApp, nok_address: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="input" rows={3} value={newApp.notes} onChange={e => setNewApp({...newApp, notes: e.target.value})} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}><button className="btn btn-secondary" onClick={() => setFormStep(2)}>Back</button><button className="btn btn-primary" onClick={handleCreateApplication} disabled={appLoading}>{appLoading ? 'Submitting...' : <><Save size={16} /> Submit</>}</button></div>
        </>}
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal isOpen={!!showAppDetails} onClose={() => setShowAppDetails(null)} title="Application Details">
        {showAppDetails && (() => {
          const app = showAppDetails, info = getServiceInfo(app)
          const fd = typeof app.form_data === 'string' ? JSON.parse(app.form_data || '{}') : (app.form_data || {})
          const docs = getAppDocs(app.id)
          return <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><h3>{info.label}</h3>{getStatusBadge(app.status)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: '#64748b' }}>Destination:</span> {app.destination_country || 'N/A'}</div>
              <div><span style={{ color: '#64748b' }}>Travel Date:</span> {app.travel_date || 'N/A'}</div>
              <div><span style={{ color: '#64748b' }}>Price:</span> {formatPrice(info)}</div>
              <div><span style={{ color: '#64748b' }}>Submitted:</span> {new Date(app.created_at).toLocaleDateString()}</div>
            </div>
            {fd.passport_number && <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Personal Info</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div><span style={{ color: '#64748b' }}>Marital:</span> {fd.marital_status || 'N/A'}</div>
                <div><span style={{ color: '#64748b' }}>Passport:</span> {fd.passport_number}</div>
                <div><span style={{ color: '#64748b' }}>Issue:</span> {fd.passport_issue_date || 'N/A'}</div>
                <div><span style={{ color: '#64748b' }}>Expiry:</span> {fd.passport_expiry_date || 'N/A'}</div>
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}><span style={{ color: '#64748b' }}>Address:</span> {fd.home_address}, {fd.city}, {fd.state} {fd.postal_code}</p>
            </div>}
            {fd.next_of_kin?.full_name && <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Next of Kin</h4>
              <div style={{ fontSize: '0.85rem' }}>
                <p>{fd.next_of_kin.full_name} ({fd.next_of_kin.relationship})</p>
                <p style={{ color: '#64748b' }}>{fd.next_of_kin.phone} • {fd.next_of_kin.email}</p>
              </div>
            </div>}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Documents ({docs.length})</h4>
              {docs.length === 0 ? <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No documents uploaded</p> : docs.map(d => <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', marginBottom: '0.25rem', fontSize: '0.85rem' }}><span>{d.document_type}</span><Badge variant={d.status === 'approved' ? 'success' : 'warning'}>{d.status}</Badge></div>)}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setUploadAppId(app.id); setShowUploadModal(true); setShowAppDetails(null) }}><Upload size={16} /> Upload Doc</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setShowPaymentModal(app); setShowAppDetails(null) }}><CreditCard size={16} /> Pay</button>
            </div>
          </div>
        })()}
      </Modal>

      {/* UPLOAD MODAL */}
      <Modal isOpen={showUploadModal} onClose={() => { setShowUploadModal(false); setUploadFile(null); setUploadType('') }} title="Upload Document">
        <form onSubmit={handleDocumentUpload}>
          {!uploadAppId && applications.length > 0 && <div className="form-group"><label className="form-label">Application *</label><select className="input" value={uploadAppId || ''} onChange={e => setUploadAppId(e.target.value)}><option value="">Select</option>{applications.map(a => <option key={a.id} value={a.id}>{getServiceInfo(a).label}</option>)}</select></div>}
          <div className="form-group"><label className="form-label">Document Type *</label><select className="input" value={uploadType} onChange={e => setUploadType(e.target.value)}><option value="">Select</option>{documentTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div className="form-group"><label className="form-label">File *</label><div className="upload-zone" onClick={() => document.getElementById('file-input').click()} style={{ cursor: 'pointer', padding: '2rem', textAlign: 'center' }}><Upload size={32} color="#64748b" /><p style={{ marginTop: '0.5rem' }}>{uploadFile ? uploadFile.name : 'Click to select'}</p></div><input id="file-input" type="file" style={{ display: 'none' }} accept=".pdf,.jpg,.jpeg,.png" onChange={e => setUploadFile(e.target.files[0])} /></div>
          <div style={{ display: 'flex', gap: '1rem' }}><button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowUploadModal(false)}>Cancel</button><button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploadLoading || !uploadFile || !uploadType}>{uploadLoading ? 'Uploading...' : 'Upload'}</button></div>
        </form>
      </Modal>

      {/* PAYMENT MODAL */}
      <Modal isOpen={!!showPaymentModal} onClose={() => setShowPaymentModal(null)} title="Make Payment">
        {showPaymentModal && (() => {
          const app = showPaymentModal, info = getServiceInfo(app)
          return <div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: '#64748b' }}>{info.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0040ff' }}>{formatPrice(info)}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Ref: {app.id.slice(0,8)}</p>
            </div>
            <h4 style={{ marginBottom: '1rem' }}>Payment Methods</h4>
            <button className="card card-hover" style={{ width: '100%', padding: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: 'pointer' }}><div style={{ width: 44, height: 44, background: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={22} color="#2563eb" /></div><div style={{ textAlign: 'left' }}><p style={{ fontWeight: 600 }}>Pay with Card</p><p style={{ fontSize: '0.8rem', color: '#64748b' }}>Visa, Mastercard, Verve</p></div></button>
            <button className="card card-hover" style={{ width: '100%', padding: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: 'pointer' }}><div style={{ width: 44, height: 44, background: '#dcfce7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building size={22} color="#16a34a" /></div><div style={{ textAlign: 'left' }}><p style={{ fontWeight: 600 }}>Bank Transfer</p><p style={{ fontSize: '0.8rem', color: '#64748b' }}>Direct bank payment</p></div></button>
            <button className="card card-hover" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: 'pointer' }}><div style={{ width: 44, height: 44, background: '#fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={22} color="#d97706" /></div><div style={{ textAlign: 'left' }}><p style={{ fontWeight: 600 }}>Crypto Wallet</p><p style={{ fontSize: '0.8rem', color: '#64748b' }}>BTC, USDT, ETH</p></div></button>
            <div style={{ background: '#f0f9ff', borderRadius: '8px', padding: '1rem', fontSize: '0.85rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Bank Transfer Details:</p>
              <div style={{ marginBottom: '0.75rem' }}>
                <p><strong>Zenith Bank Plc</strong></p>
                <p>Account Name: Itsa Travels & Edu-Consult</p>
                <p>Account No: 1310731161</p>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <p><strong>UBA Plc</strong></p>
                <p>Account Name: Itsa Travels & Edu-Consult</p>
                <p>Account No: 1028373185</p>
              </div>
              <div>
                <p><strong>Guaranty Trust Bank (GTB)</strong></p>
                <p>Account Name: Itsa Travels & Edu-Consult</p>
                <p>Account No: 0680861929</p>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem', textAlign: 'center' }}>Send proof of payment to info@itsatravels.com</p>
          </div>
        })()}
      </Modal>
    </div>
  )
}
