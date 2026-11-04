'use client'
import { useEffect, useRef, useState } from 'react'
import { LogOut, UserRound, ChevronDown } from 'lucide-react'
import { useAccess, useAuthT } from './AccessGate'

export function initials(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const s = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || email || '?').slice(0, 2)
  return s.toUpperCase()
}

export function Avatar({ name, email, size = 32 }: { name: string; email: string; size?: number }) {
  return (
    <span style={{ width: size, height: size, fontSize: size * 0.38 }} className="rounded-full bg-gradient-to-br from-brand-orange to-brand-amber text-white font-mono font-bold flex items-center justify-center flex-shrink-0">
      {initials(name, email)}
    </span>
  )
}

/** Desktop header control: Sign in / Create account, or the avatar dropdown when signed in. */
export default function AccountMenu() {
  const { user, lead, loading, openAuth, signOut } = useAccess()
  const a = useAuthT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn); return () => document.removeEventListener('mousedown', fn)
  }, [])

  if (loading) return <div className="w-32 h-9" aria-hidden />
  if (!user || !lead) {
    return (
      <div className="flex items-center gap-3">
        <button onClick={() => openAuth('signin')} className="text-[11px] font-mono uppercase tracking-widest text-ink-muted hover:text-brand-orange transition-colors">{a.signIn}</button>
        <button onClick={() => openAuth('signup')} className="btn-primary !py-2.5">{a.createAccount}</button>
      </div>
    )
  }
  const first = lead.name.split(' ')[0]
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-surface-border hover:bg-surface-subtle transition-colors">
        <Avatar name={lead.name} email={lead.email} />
        <span className="text-xs font-medium text-ink max-w-[110px] truncate">{first}</span>
        <ChevronDown size={13} className="text-ink-faint" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-64 bg-white border border-surface-border rounded-xl shadow-card-lg overflow-hidden z-50">
          <div className="p-4 flex items-center gap-3 border-b border-surface-border">
            <Avatar name={lead.name} email={lead.email} size={40} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink truncate">{lead.name}</div>
              <div className="text-xs text-ink-faint truncate" title={lead.email}>{lead.email}</div>
              {lead.country && <div className="text-[10px] font-mono uppercase text-ink-faint mt-0.5">{lead.country}</div>}
            </div>
          </div>
          <a href="/account" role="menuitem" className="flex items-center gap-2.5 px-4 py-3 text-xs font-mono uppercase tracking-wider text-ink-muted hover:bg-surface-subtle"><UserRound size={14}/> {a.myAccount}</a>
          <button onClick={() => { setOpen(false); signOut() }} role="menuitem" className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-mono uppercase tracking-wider text-ink-muted hover:bg-surface-subtle border-t border-surface-border"><LogOut size={14}/> {a.signOut}</button>
        </div>
      )}
    </div>
  )
}

/** Mobile menu block: account card (signed in) or sign-in / create-account buttons. */
export function MobileAccount({ onNavigate }: { onNavigate: () => void }) {
  const { user, lead, loading, openAuth, signOut } = useAccess()
  const a = useAuthT()
  if (loading) return null
  if (!user || !lead) {
    return (
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button onClick={() => { onNavigate(); openAuth('signin') }} className="py-3 rounded-xl border border-surface-border text-xs font-mono uppercase tracking-wider text-ink-muted">{a.signIn}</button>
        <button onClick={() => { onNavigate(); openAuth('signup') }} className="btn-primary justify-center !py-3">{a.createAccount}</button>
      </div>
    )
  }
  return (
    <div className="mb-2 p-3 rounded-xl bg-surface-subtle border border-surface-border">
      <div className="flex items-center gap-3">
        <Avatar name={lead.name} email={lead.email} size={40} />
        <div className="min-w-0"><div className="text-sm font-semibold text-ink truncate">{lead.name}</div><div className="text-xs text-ink-faint truncate">{lead.email}</div></div>
      </div>
      <div className="flex gap-2 mt-3">
        <a href="/account" onClick={onNavigate} className="flex-1 text-center py-2 rounded-lg bg-white border border-surface-border text-[11px] font-mono uppercase text-ink-muted">{a.myAccount}</a>
        <button onClick={() => { onNavigate(); signOut() }} className="flex-1 py-2 rounded-lg bg-white border border-surface-border text-[11px] font-mono uppercase text-ink-muted">{a.signOut}</button>
      </div>
    </div>
  )
}
