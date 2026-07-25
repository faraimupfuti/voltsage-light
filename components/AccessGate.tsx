'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react'
import { X, User, Mail, Phone, Loader2, Lock, Sparkles, CreditCard } from 'lucide-react'

interface Lead { name: string; email: string; mobile: string }
interface AccessCtx {
  lead: Lead | null
  advanced: boolean
  advancedChecked: boolean
  requireLead: (onSuccess: () => void) => void
  requireAdvanced: (onSuccess: () => void) => void
  openPortal: () => void
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
  const [advanced, setAdvanced] = useState(false)
  const [advancedChecked, setAdvancedChecked] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const pendingRef = useRef<(() => void) | null>(null)

  // Load any previously-captured lead from this browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LEAD_KEY)
      if (raw) setLead(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  const refreshAdvanced = useCallback(async () => {
    try {
      const res = await fetch('/api/access/status')
      const data = await res.json()
      setAdvanced(!!data.advanced)
    } catch { setAdvanced(false) }
    finally { setAdvancedChecked(true) }
  }, [])

  useEffect(() => { refreshAdvanced() }, [refreshAdvanced])

  // Handle returning from Stripe Checkout (?checkout=success&session_id=...)
  useEffect(() => {
    const url = new URL(window.location.href)
    const checkout = url.searchParams.get('checkout')
    const sessionId = url.searchParams.get('session_id')
    if (checkout === 'success' && sessionId) {
      ;(async () => {
        try {
          const res = await fetch('/api/stripe/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          })
          const data = await res.json()
          if (data.ok) setAdvanced(true)
        } finally {
          url.searchParams.delete('checkout'); url.searchParams.delete('session_id')
          window.history.replaceState({}, '', url.toString())
          setAdvancedChecked(true)
        }
      })()
    } else if (checkout === 'cancel') {
      url.searchParams.delete('checkout')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  const requireLead = useCallback((onSuccess: () => void) => {
    if (lead) { onSuccess(); return }
    pendingRef.current = onSuccess
    setSignupOpen(true)
  }, [lead])

  const requireAdvanced = useCallback((onSuccess: () => void) => {
    if (advanced) { onSuccess(); return }
    pendingRef.current = onSuccess
    setPaywallOpen(true)
  }, [advanced])

  const openPortal = useCallback(async () => {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.ok) window.location.href = data.url
    else alert(data.error || 'Could not open billing portal.')
  }, [])

  const handleSignupSuccess = (l: Lead) => {
    setLead(l)
    localStorage.setItem(LEAD_KEY, JSON.stringify(l))
    setSignupOpen(false)
    const cb = pendingRef.current; pendingRef.current = null
    if (cb) cb()
  }

  const handleAdvancedUnlocked = () => {
    setAdvanced(true)
    setPaywallOpen(false)
    const cb = pendingRef.current; pendingRef.current = null
    if (cb) cb()
  }

  return (
    <Ctx.Provider value={{ lead, advanced, advancedChecked, requireLead, requireAdvanced, openPortal }}>
      {children}
      {signupOpen && <SignupModal defaultEmail={lead?.email} onClose={() => { setSignupOpen(false); pendingRef.current = null }} onSuccess={handleSignupSuccess} />}
      {paywallOpen && <PaywallModal defaultEmail={lead?.email} onClose={() => { setPaywallOpen(false); pendingRef.current = null }} onUnlocked={handleAdvancedUnlocked} />}
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
      <div className="space-y-3">
        <div className="relative"><User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="tool-input pl-9"/></div>
        <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" className="tool-input pl-9"/></div>
        <div className="relative"><Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"/><input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Mobile number" className="tool-input pl-9"/></div>
      </div>
      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      <button onClick={submit} disabled={busy} className="btn-primary w-full justify-center mt-5 disabled:opacity-50 disabled:cursor-not-allowed">
        {busy ? <Loader2 size={15} className="animate-spin"/> : null} {busy ? 'Please wait…' : 'Unlock the tools'}
      </button>
      <p className="text-[10px] text-ink-faint mt-3 text-center">We'll only use this to follow up about your solar sizing — no spam.</p>
    </ModalShell>
  )
}

function PaywallModal({ defaultEmail, onClose, onUnlocked }: { defaultEmail?: string; onClose: () => void; onUnlocked: () => void }) {
  const [email, setEmail] = useState(defaultEmail || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [restoreMode, setRestoreMode] = useState(false)
  const [restoreBusy, setRestoreBusy] = useState(false)

  const subscribe = async () => {
    if (!EMAIL_RE.test(email)) { setError('Enter a valid email to continue to checkout.'); return }
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not start checkout.')
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message || 'Could not start checkout.')
      setBusy(false)
    }
  }

  const restore = async () => {
    if (!EMAIL_RE.test(email)) { setError('Enter the email you subscribed with.'); return }
    setRestoreBusy(true); setError('')
    try {
      const res = await fetch('/api/stripe/restore', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'No active subscription found for that email.')
      onUnlocked()
    } catch (err: any) {
      setError(err.message || 'No active subscription found for that email.')
    } finally { setRestoreBusy(false) }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center mb-3"><Sparkles size={17} className="text-brand-orange"/></div>
      <h3 className="font-disp font-bold text-lg text-ink mb-1">Unlock Advanced</h3>
      <p className="text-sm text-ink-muted mb-1">Power overrides, multiple usage periods, unlimited line items, and full control over every sizing assumption.</p>
      <p className="font-mono text-2xl font-bold text-brand-orange mb-4">$5<span className="text-sm text-ink-faint font-normal"> / month</span></p>
      {!restoreMode ? (
        <>
          <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" className="tool-input pl-9"/></div>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          <button onClick={subscribe} disabled={busy} className="btn-primary w-full justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
            {busy ? <Loader2 size={15} className="animate-spin"/> : <CreditCard size={15}/>} {busy ? 'Redirecting to Stripe…' : 'Subscribe with Stripe'}
          </button>
          <button onClick={() => { setRestoreMode(true); setError('') }} className="text-xs text-ink-faint hover:text-brand-orange transition-colors mt-3 w-full text-center underline">Already subscribed? Restore access</button>
        </>
      ) : (
        <>
          <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Your subscription email" className="tool-input pl-9"/></div>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          <button onClick={restore} disabled={restoreBusy} className="btn-teal w-full justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
            {restoreBusy ? <Loader2 size={15} className="animate-spin"/> : null} {restoreBusy ? 'Checking…' : 'Restore access'}
          </button>
          <button onClick={() => { setRestoreMode(false); setError('') }} className="text-xs text-ink-faint hover:text-brand-orange transition-colors mt-3 w-full text-center underline">Back to subscribe</button>
        </>
      )}
      <p className="text-[10px] text-ink-faint mt-3 text-center">Cancel anytime from the billing portal. Secure checkout by Stripe.</p>
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
