'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { X, User as UserIcon, Mail, Globe, Loader2, Lock, KeyRound } from 'lucide-react'
import { useLang } from './LanguageProvider'
import { authStrings } from '@/lib/i18n/auth'
import { getSupabase } from '@/lib/supabase/client'

interface Lead { name: string; country: string; email: string }
export interface Profile { full_name: string | null; country: string | null; created_at: string }
type Tab = 'signup' | 'signin'

interface AccessCtx {
  /** Supabase user, or null when signed out. */
  user: User | null
  profile: Profile | null
  /** Kept for existing consumers (SiteProvider): derived from the signed-in account. */
  lead: Lead | null
  loading: boolean
  /** Runs onSuccess now if signed in; otherwise opens the sign-up modal and runs it after sign-in. */
  requireLead: (onSuccess: () => void) => void
  openAuth: (tab?: Tab) => void
  signOut: () => Promise<void>
  updateProfile: (patch: { full_name?: string; country?: string }) => Promise<string | null>
}

const Ctx = createContext<AccessCtx | null>(null)
export function useAccess() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAccess must be used within AccessProvider')
  return c
}
export function useAuthT() { return authStrings[useLang().locale] }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LEAD_SENT_KEY = 'voltsage_lead_sent'

function sendLead(name: string, country: string, email: string) {
  try { if (localStorage.getItem(LEAD_SENT_KEY) === email) return; localStorage.setItem(LEAD_SENT_KEY, email) } catch { /* ignore */ }
  fetch('/api/lead', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name || email.split('@')[0], country: country || 'Not given', email }),
  }).catch(() => { /* lead notification is best-effort */ })
}

export function AccessProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; tab: Tab }>({ open: false, tab: 'signup' })
  const pendingRef = useRef<(() => void) | null>(null)
  const modalOpenRef = useRef(false)
  modalOpenRef.current = modal.open

  useEffect(() => {
    const supabase = getSupabase()
    const { data: sub } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (!session) { setProfile(null); return }
      if (event === 'SIGNED_IN' && modalOpenRef.current) {
        setModal(m => ({ ...m, open: false }))
        const cb = pendingRef.current; pendingRef.current = null
        if (cb) setTimeout(cb, 0)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Load the profile row whenever the signed-in user changes.
  useEffect(() => {
    if (!user) return
    let alive = true
    getSupabase().from('profiles').select('full_name,country,created_at').eq('id', user.id).maybeSingle()
      .then(({ data }: { data: unknown }) => {
        if (!alive) return
        setProfile((data as Profile | null) ?? { full_name: null, country: null, created_at: user.created_at })
        // First Google/OAuth sign-in: notify the lead webhook once (email sign-ups notify at sign-up time).
        const isNew = Date.now() - new Date(user.created_at).getTime() < 10 * 60 * 1000
        if (isNew && user.app_metadata?.provider !== 'email' && user.email) {
          const n = (data as Profile | null)?.full_name || (user.user_metadata?.full_name as string) || ''
          sendLead(n, (data as Profile | null)?.country || '', user.email)
        }
      })
    return () => { alive = false }
  }, [user])

  const displayName = profile?.full_name || (user?.user_metadata?.full_name as string) || (user?.user_metadata?.name as string) || user?.email?.split('@')[0] || ''
  const lead: Lead | null = user ? { name: displayName, country: profile?.country || '', email: user.email || '' } : null

  const openAuth = useCallback((tab: Tab = 'signin') => setModal({ open: true, tab }), [])
  const requireLead = useCallback((onSuccess: () => void) => {
    if (user) { onSuccess(); return }
    pendingRef.current = onSuccess
    setModal({ open: true, tab: 'signup' })
  }, [user])
  const signOut = useCallback(async () => { await getSupabase().auth.signOut(); setUser(null); setProfile(null) }, [])
  const updateProfile = useCallback(async (patch: { full_name?: string; country?: string }) => {
    if (!user) return 'Not signed in'
    const { error } = await getSupabase().from('profiles').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', user.id)
    if (error) return error.message
    setProfile(p => ({ full_name: p?.full_name ?? null, country: p?.country ?? null, created_at: p?.created_at ?? user.created_at, ...patch }))
    return null
  }, [user])

  const close = () => { setModal(m => ({ ...m, open: false })); pendingRef.current = null }

  return (
    <Ctx.Provider value={{ user, profile, lead, loading, requireLead, openAuth, signOut, updateProfile }}>
      {children}
      {modal.open && <AuthModal initialTab={modal.tab} onClose={close} />}
    </Ctx.Provider>
  )
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="relative w-full max-w-sm bg-white rounded-2xl border border-surface-border shadow-card-lg p-6 my-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-ink-faint hover:text-ink transition-colors"><X size={18}/></button>
        {children}
      </div>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block mb-1.5">{label}</label>
      <div className="relative"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">{icon}</span>{children}</div>
    </div>
  )
}

function AuthModal({ initialTab, onClose }: { initialTab: Tab; onClose: () => void }) {
  const a = useAuthT()
  const [tab, setTab] = useState<Tab>(initialTab)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [verifyEmail, setVerifyEmail] = useState('')
  const supabase = getSupabase()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const switchTab = (t: Tab) => { setTab(t); setError(''); setInfo('') }

  const google = async () => {
    setError('')
    const next = encodeURIComponent(window.location.pathname + window.location.search)
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin}/auth/callback?next=${next}` } })
    if (error) setError(a.errGeneric)
  }

  const submit = async () => {
    setError(''); setInfo('')
    const em = email.trim()
    if (!EMAIL_RE.test(em) || !password || (tab === 'signup' && (!name.trim() || !country.trim()))) { setError(a.errFields); return }
    if (tab === 'signup' && password.length < 8) { setError(a.errPassword); return }
    setBusy(true)
    try {
      if (tab === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: em, password,
          options: { data: { full_name: name.trim(), country: country.trim() }, emailRedirectTo: `${origin}/auth/callback` },
        })
        if (error) { setError(a.errGeneric); return }
        if (data.user && data.user.identities && data.user.identities.length === 0) { setTab('signin'); setError(a.errExists); return }
        sendLead(name.trim(), country.trim(), em)
        if (!data.session) setVerifyEmail(em) // email confirmation on: wait for the link; onAuthStateChange unlocks this page
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: em, password })
        if (error) setError(/invalid/i.test(error.message) ? a.errCredentials : a.errGeneric)
      }
    } catch { setError(a.errGeneric) } finally { setBusy(false) }
  }

  const forgot = async () => {
    setError(''); setInfo('')
    if (!EMAIL_RE.test(email.trim())) { setInfo(a.resetPrompt); return }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent('/account?reset=1')}` })
    if (error) setError(a.errGeneric); else setInfo(a.resetSent)
  }

  if (verifyEmail) {
    return (
      <ModalShell onClose={onClose}>
        <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center mb-3"><Mail size={17} className="text-brand-orange"/></div>
        <h3 className="font-disp font-bold text-lg text-ink mb-1">{a.verifyTitle}</h3>
        <p className="text-sm text-ink-muted">{a.verifyBody.replace('{email}', verifyEmail)}</p>
      </ModalShell>
    )
  }

  const signup = tab === 'signup'
  return (
    <ModalShell onClose={onClose}>
      <div className="flex gap-1 p-1 bg-surface-muted rounded-lg mb-5 mr-6">
        {(['signup', 'signin'] as const).map(t => (
          <button key={t} onClick={() => switchTab(t)} className={`flex-1 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all ${tab === t ? 'bg-white shadow-sm text-ink' : 'text-ink-faint'}`}>
            {t === 'signup' ? a.createAccount : a.signIn}
          </button>
        ))}
      </div>
      <h3 className="font-disp font-bold text-lg text-ink mb-1">{signup ? a.titleCreate : a.titleSignIn}</h3>
      <p className="text-sm text-ink-muted mb-4">{signup ? a.subCreate : a.subSignIn}</p>

      <button onClick={google} className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-surface-border2 bg-white hover:bg-surface-subtle text-sm font-medium text-ink transition-colors">
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
        {a.google}
      </button>
      <div className="flex items-center gap-3 my-4 text-[10px] font-mono uppercase text-ink-faint"><span className="flex-1 h-px bg-surface-border"/>{a.or}<span className="flex-1 h-px bg-surface-border"/></div>

      <div className="space-y-3.5">
        {signup && <>
          <Field label={a.name} icon={<UserIcon size={14}/>}><input value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="Tendai Moyo" className="tool-input !pl-10"/></Field>
          <Field label={a.country} icon={<Globe size={14}/>}><input value={country} onChange={e => setCountry(e.target.value)} autoComplete="country-name" placeholder="Zimbabwe" className="tool-input !pl-10"/></Field>
        </>}
        <Field label={a.email} icon={<Mail size={14}/>}><input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@email.com" className="tool-input !pl-10"/></Field>
        <Field label={a.password} icon={<KeyRound size={14}/>}><input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} type="password" autoComplete={signup ? 'new-password' : 'current-password'} className="tool-input !pl-10"/></Field>
      </div>
      {!signup && <button onClick={forgot} className="text-xs text-brand-orange hover:underline mt-2.5">{a.forgot}</button>}
      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      {info && <p className="text-xs text-ink-muted mt-3">{info}</p>}
      <button onClick={submit} disabled={busy} className="btn-primary w-full justify-center mt-5 disabled:opacity-50 disabled:cursor-not-allowed">
        {busy && <Loader2 size={15} className="animate-spin"/>} {busy ? a.wait : signup ? a.submitCreate : a.submitSignIn}
      </button>
      {signup && <p className="text-[10px] text-ink-faint mt-3 text-center">{a.privacy}</p>}
    </ModalShell>
  )
}

/** Wrap any results panel with this to blur/lock it until the visitor is signed in. */
export function LeadLock({ children }: { children: ReactNode }) {
  const { user, requireLead } = useAccess()
  const a = useAuthT()
  if (user) return <>{children}</>
  return (
    <div className="relative">
      <div className="pointer-events-none select-none filter blur-sm opacity-60">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button onClick={() => requireLead(() => {})} className="btn-primary shadow-card-lg"><Lock size={13}/> {a.lockCta}</button>
      </div>
    </div>
  )
}
