'use client'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Footer } from '@/components/ContactAndFooter'
import { Avatar } from '@/components/AccountMenu'
import { useAccess, useAuthT } from '@/components/AccessGate'
import { getSupabase } from '@/lib/supabase/client'

export default function AccountPage() {
  const { user, lead, profile, loading, openAuth, signOut, updateProfile } = useAccess()
  const a = useAuthT()
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [msg, setMsg] = useState('')
  const [pw, setPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [reset, setReset] = useState(false)

  useEffect(() => { setReset(new URLSearchParams(window.location.search).get('reset') === '1') }, [])
  useEffect(() => { if (lead) { setName(lead.name); setCountry(lead.country) } }, [lead?.name, lead?.country]) // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    const err = await updateProfile({ full_name: name.trim(), country: country.trim() })
    setMsg(err ? a.errGeneric : a.saved)
  }
  const changePw = async () => {
    if (pw.length < 8) { setPwMsg(a.errPassword); return }
    const { error } = await getSupabase().auth.updateUser({ password: pw })
    setPwMsg(error ? a.errGeneric : a.passwordUpdated); if (!error) setPw('')
  }

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="pt-32 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="section-eyebrow">{a.myAccount}</div>
          {loading ? null : !user || !lead ? (
            <div>
              <h1 className="font-disp font-extrabold text-3xl text-ink mb-4">{a.accountTitle}</h1>
              <p className="text-ink-muted mb-6">{a.needSignIn}</p>
              <button onClick={() => openAuth('signin')} className="btn-primary">{a.signIn}</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar name={lead.name} email={lead.email} size={64} />
                <div className="min-w-0">
                  <h1 className="font-disp font-extrabold text-3xl text-ink truncate">{lead.name}</h1>
                  <p className="text-sm text-ink-faint truncate">{lead.email}</p>
                  {profile?.created_at && <p className="text-[11px] font-mono uppercase text-ink-faint mt-1">{a.memberSince} {new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-surface-border p-5 shadow-card">
                <h2 className="font-disp font-bold text-lg text-ink mb-4">{a.profile}</h2>
                <div className="space-y-3.5">
                  <div><label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block mb-1.5">{a.name}</label><input className="tool-input" value={name} onChange={e => setName(e.target.value)} /></div>
                  <div><label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block mb-1.5">{a.country}</label><input className="tool-input" value={country} placeholder={a.addCountry} onChange={e => setCountry(e.target.value)} /></div>
                  <div><label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block mb-1.5">{a.email}</label><input className="tool-input opacity-60" value={lead.email} readOnly /></div>
                </div>
                <div className="flex items-center gap-3 mt-5"><button onClick={save} className="btn-primary">{a.save}</button>{msg && <span className="text-xs text-ink-muted">{msg}</span>}</div>
              </div>

              <div className={`rounded-2xl border p-5 shadow-card ${reset ? 'border-brand-orange' : 'border-surface-border'}`}>
                <h2 className="font-disp font-bold text-lg text-ink mb-4">{a.security}</h2>
                <label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block mb-1.5">{a.newPassword}</label>
                <input type="password" autoComplete="new-password" className="tool-input" value={pw} onChange={e => setPw(e.target.value)} />
                <div className="flex items-center gap-3 mt-4"><button onClick={changePw} className="btn-primary">{a.updatePassword}</button>{pwMsg && <span className="text-xs text-ink-muted">{pwMsg}</span>}</div>
              </div>

              <div className="rounded-2xl border border-dashed border-surface-border2 p-5">
                <h2 className="font-disp font-bold text-lg text-ink mb-1">{a.assessments}</h2>
                <p className="text-sm text-ink-muted">{a.assessmentsSoon}</p>
              </div>

              <button onClick={signOut} className="text-xs font-mono uppercase tracking-wider text-ink-faint hover:text-ink">{a.signOut}</button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
