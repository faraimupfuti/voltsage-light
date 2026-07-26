'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react'
import { X, User, Mail, Phone, Loader2, Lock } from 'lucide-react'

interface Lead { name: string; email: string; mobile: string }
interface AccessCtx {
  lead: Lead | null
  requireLead: (onSuccess: () => void) => void
}

const Ctx = createContext<AccessCtx | null>(null)
export function useAccess() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAccess must be used within AccessProvider')
  return c
}

const LEAD_KEY = 'voltsage_lead'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AccessProvider({ children }: { children: ReactNode }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [signupOpen, setSignupOpen] = useState(false)
  const pendingRef = useRef<(() => void) | null>(null)

  // Load any previously-captured lead from this browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LEAD_KEY)
      if (raw) setLead(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  const requireLead = useCallback((onSuccess: () => void) => {
    if (lead) { onSuccess(); return }
    pendingRef.current = onSuccess
    setSignupOpen(true)
  }, [lead])

  const handleSignupSuccess = (l: Lead) => {
    setLead(l)
    localStorage.setItem(LEAD_KEY, JSON.stringify(l))
    setSignupOpen(false)
    const cb = pendingRef.current; pendingRef.current = null
    if (cb) cb()
  }

  return (
    <Ctx.Provider value={{ lead, requireLead }}>
      {children}
      {signupOpen && <SignupModal defaultEmail={lead?.email} onClose={() => { setSignupOpen(false); pendingRef.current = null }} onSuccess={handleSignupSuccess} />}
    </Ctx.Provider>
  )
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="relative w-full max-w-sm bg-white rounded-2xl border border-surface-border shadow-card-lg p-6">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-ink-faint hover:text-ink transition-colors"><X size={18}/></button>
        {children}
      </div>
    </div>
  )
}

function SignupModal({ defaultEmail, onClose, onSuccess }: { defaultEmail?: string; onClose: () => void; onSuccess: (l: Lead) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState(defaultEmail || '')
  const [mobile, setMobile] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!name.trim() || !EMAIL_RE.test(email) || !mobile.trim()) {
      setError('Please fill in your name, a valid email and mobile number.'); return
    }
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
      onSuccess({ name, email, mobile })
    } catch (err: any) {
      setError(err.message || 'Could not sign you up. Please try again.')
    } finally { setBusy(false) }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center mb-3"><Lock size={17} className="text-brand-orange"/></div>
      <h3 className="font-disp font-bold text-lg text-ink mb-1">Sign up to use the tools</h3>
      <p className="text-sm text-ink-muted mb-5">Free — just tell us who you are and we'll unlock the sizing tools for you.</p>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block mb-1.5">Full name</label>
          <div className="relative"><User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Tendai Moyo" className="tool-input !pl-10"/></div>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block mb-1.5">Email address</label>
          <div className="relative"><Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@email.com" className="tool-input !pl-10"/></div>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block mb-1.5">Mobile number</label>
          <div className="relative"><Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"/><input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="+263 7…" className="tool-input !pl-10"/></div>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      <button onClick={submit} disabled={busy} className="btn-primary w-full justify-center mt-5 disabled:opacity-50 disabled:cursor-not-allowed">
        {busy ? <Loader2 size={15} className="animate-spin"/> : null} {busy ? 'Please wait…' : 'Unlock the tools'}
      </button>
      <p className="text-[10px] text-ink-faint mt-3 text-center">We'll only use this to follow up about your solar sizing — no spam.</p>
    </ModalShell>
  )
}

/** Wrap any results panel with this to blur/lock it until the visitor has signed up. */
export function LeadLock({ children }: { children: ReactNode }) {
  const { lead, requireLead } = useAccess()
  if (lead) return <>{children}</>
  return (
    <div className="relative">
      <div className="pointer-events-none select-none filter blur-sm opacity-60">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button onClick={() => requireLead(() => {})} className="btn-primary shadow-card-lg"><Lock size={13}/> Sign up to view results</button>
      </div>
    </div>
  )
}
