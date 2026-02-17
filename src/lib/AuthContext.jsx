import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // If Supabase is not configured, just stop loading
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Load profile and admin status, but don't block on them
        loadProfile(session.user.id)
        checkAdminStatus(session.user.id)
      }
      // Always set loading to false after getting session
      setLoading(false)
    }).catch((err) => {
      console.error('Session error:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
        checkAdminStatus(session.user.id)
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle()
      if (data) setProfile(data)
      if (error) console.log('Profile load error:', error.message)
    } catch (error) {
      console.log('Profile not found:', error)
    }
  }

  const checkAdminStatus = async (userId) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('agency_staff')
        .select('*')
        .eq('auth_user_id', userId)
        .eq('is_active', true)
        .maybeSingle()
      setIsAdmin(!!data)
      if (error) console.log('Admin check error:', error.message)
    } catch (error) {
      console.log('Admin check failed:', error)
      setIsAdmin(false)
    }
  }

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: { message: 'Database not configured. Please add Supabase credentials.' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async (email, password, metadata) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: { message: 'Database not configured. Please add Supabase credentials.' } }
    }
    
    // Get the current URL for redirect
    const redirectUrl = `${window.location.origin}/auth/callback`
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: redirectUrl
      }
    })
    
    if (!error && data.user) {
      // Create user profile
      await supabase.from('users').insert({
        auth_user_id: data.user.id,
        email: email,
        first_name: metadata.first_name,
        last_name: metadata.last_name,
        phone: metadata.phone,
      })
    }
    
    return { data, error }
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setProfile(null)
    setIsAdmin(false)
  }

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: { message: 'Database not configured.' } }
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
