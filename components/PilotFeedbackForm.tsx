'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle, CheckCircle2, ClipboardList } from 'lucide-react'
import {
  getSections, isAnswered, sectionMissing,
  ROLE_OPTIONS,
  Question, ChoiceQuestion, ScaleQuestion, MatrixQuestion, TextQuestion,
  Answers, RoleValue,
} from '@/lib/feedbackForm'

const DRAFT_KEY = 'voltsage_pilot_feedback_draft_v1'

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function RequiredMark({ required }: { required: boolean }) {
  if (!required) return null
  return <span className="text-brand-orange ml-1">*</span>
}

function OptionRow({ label, selected, onClick, shape = 'circle' }: { label: string; selected: boolean; onClick: () => void; shape?: 'circle' | 'square' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border flex items-start gap-3 text-sm transition-all ${
        selected ? 'border-brand-teal bg-teal-50 text-ink' : 'border-surface-border bg-white text-ink-muted hover:border-brand-orange/40'
      }`}
    >
      <span
        className={`mt-0.5 flex-shrink-0 w-4 h-4 border-2 flex items-center justify-center ${shape === 'circle' ? 'rounded-full' : 'rounded-[4px]'} ${
          selected ? 'border-brand-orange bg-brand-orange' : 'border-surface-border2'
        }`}
      >
        {selected && <Check size={10} className="text-white" strokeWidth={3} />}
      </span>
      <span className="leading-snug">{label}</span>
    </button>
  )
}

function OtherTextField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Please specify"
      className="tool-input text-sm mt-2 ml-7 w-[calc(100%-1.75rem)]"
      onClick={e => e.stopPropagation()}
    />
  )
}

function SingleChoiceField({ q, value, otherValue, onChange, onOtherChange }: {
  q: ChoiceQuestion; value: string | undefined; otherValue: string
  onChange: (v: string) => void; onOtherChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {q.options.map(opt => (
        <div key={opt}>
          <OptionRow label={opt} selected={value === opt} onClick={() => onChange(opt)} />
          {q.allowOther && opt === 'Other' && value === 'Other' && (
            <OtherTextField value={otherValue} onChange={onOtherChange} />
          )}
        </div>
      ))}
    </div>
  )
}

function MultiChoiceField({ q, value, otherValue, onChange, onOtherChange }: {
  q: ChoiceQuestion; value: string[] | undefined; otherValue: string
  onChange: (v: string[]) => void; onOtherChange: (v: string) => void
}) {
  const selected = value ?? []
  const atMax = !!q.max && selected.length >= q.max
  const toggle = (opt: string) => {
    if (selected.includes(opt)) { onChange(selected.filter(o => o !== opt)); return }
    if (atMax) return
    onChange([...selected, opt])
  }
  return (
    <div className="flex flex-col gap-2">
      {q.options.map(opt => {
        const isSel = selected.includes(opt)
        const disabled = atMax && !isSel
        return (
          <div key={opt}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => toggle(opt)}
              className={`w-full text-left px-4 py-3 rounded-xl border flex items-start gap-3 text-sm transition-all ${
                isSel ? 'border-brand-teal bg-teal-50 text-ink' : disabled ? 'border-surface-border bg-surface-subtle text-ink-faint cursor-not-allowed' : 'border-surface-border bg-white text-ink-muted hover:border-brand-orange/40'
              }`}
            >
              <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-[4px] border-2 flex items-center justify-center ${isSel ? 'border-brand-orange bg-brand-orange' : 'border-surface-border2'}`}>
                {isSel && <Check size={10} className="text-white" strokeWidth={3} />}
              </span>
              <span className="leading-snug">{opt}</span>
            </button>
            {q.allowOther && opt === 'Other' && isSel && (
              <OtherTextField value={otherValue} onChange={onOtherChange} />
            )}
          </div>
        )
      })}
      {q.max && (
        <p className="text-[11px] font-mono text-ink-faint mt-1">{selected.length} / {q.max} selected</p>
      )}
    </div>
  )
}

function ScaleField({ q, value, onChange }: { q: ScaleQuestion; value: number | undefined; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 aspect-square rounded-xl border-2 font-mono font-bold text-base flex items-center justify-center transition-all ${
              value === n ? 'border-brand-orange bg-brand-orange text-white' : 'border-surface-border bg-white text-ink-muted hover:border-brand-orange/40'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] font-mono uppercase tracking-wide text-ink-faint">
        <span>{q.minLabel}</span>
        <span>{q.maxLabel}</span>
      </div>
    </div>
  )
}

function MatrixField({ q, value, onChange }: { q: MatrixQuestion; value: Record<string, string> | undefined; onChange: (v: Record<string, string>) => void }) {
  const val = value ?? {}
  return (
    <div className="flex flex-col gap-2.5">
      {q.rows.map(row => (
        <div key={row} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
          <span className="text-xs text-ink-muted sm:w-56 sm:flex-shrink-0">{row}</span>
          <select
            value={val[row] ?? ''}
            onChange={e => onChange({ ...val, [row]: e.target.value })}
            className={`tool-input text-xs flex-1 ${val[row] ? 'text-ink' : 'text-ink-faint'}`}
          >
            <option value="" disabled>Select…</option>
            {q.columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>
      ))}
    </div>
  )
}

function TextField({ q, value, onChange }: { q: TextQuestion; value: string | undefined; onChange: (v: string) => void }) {
  if (q.type === 'long') {
    return (
      <textarea
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={q.placeholder}
        rows={4}
        className="tool-input text-sm resize-y"
        maxLength={q.maxLength ?? 5000}
      />
    )
  }
  return (
    <input
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={q.placeholder}
      className="tool-input text-sm"
      maxLength={q.maxLength ?? 200}
    />
  )
}

function YesNoField({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-3">
      {['Yes', 'No'].map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 py-3 rounded-xl border-2 font-mono text-xs uppercase tracking-wider transition-all ${
            value === opt ? 'border-brand-orange bg-brand-orange text-white' : 'border-surface-border bg-white text-ink-muted hover:border-brand-orange/40'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function QuestionField({ q, answers, setAnswer }: { q: Question; answers: Answers; setAnswer: (id: string, v: any) => void }) {
  const otherId = `${q.id}_other`
  return (
    <div className="py-5 border-b border-surface-border last:border-b-0">
      <div className="flex items-start gap-2 mb-3">
        <span className="mt-0.5 flex-shrink-0 text-[9px] font-mono uppercase tracking-widest text-ink-faint bg-surface-subtle border border-surface-border rounded px-1.5 py-0.5">{q.ref}</span>
        <div>
          <p className="text-[15px] font-medium text-ink leading-snug">{q.prompt}<RequiredMark required={q.required} /></p>
          {q.helper && <p className="text-xs text-ink-faint mt-1">{q.helper}</p>}
        </div>
      </div>
      {q.type === 'single' && (
        <SingleChoiceField
          q={q}
          value={answers[q.id]}
          otherValue={answers[otherId] ?? ''}
          onChange={v => setAnswer(q.id, v)}
          onOtherChange={v => setAnswer(otherId, v)}
        />
      )}
      {q.type === 'multi' && (
        <MultiChoiceField
          q={q}
          value={answers[q.id]}
          otherValue={answers[otherId] ?? ''}
          onChange={v => setAnswer(q.id, v)}
          onOtherChange={v => setAnswer(otherId, v)}
        />
      )}
      {q.type === 'scale' && <ScaleField q={q} value={answers[q.id]} onChange={v => setAnswer(q.id, v)} />}
      {q.type === 'matrix' && <MatrixField q={q} value={answers[q.id]} onChange={v => setAnswer(q.id, v)} />}
      {(q.type === 'short' || q.type === 'long') && <TextField q={q} value={answers[q.id]} onChange={v => setAnswer(q.id, v)} />}
      {q.type === 'yesno' && <YesNoField value={answers[q.id]} onChange={v => setAnswer(q.id, v)} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main form
// ---------------------------------------------------------------------------

export default function PilotFeedbackForm() {
  const [answers, setAnswers] = useState<Answers>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [showErrors, setShowErrors] = useState(false)
  const [status, setStatus] = useState<'form' | 'submitting' | 'success' | 'error'>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const topRef = useRef<HTMLDivElement>(null)
  const loadedDraft = useRef(false)

  // `answers.role` stores the option label directly (Q1 renders labels as
  // its option list), so resolve it back to a RoleValue for branching.
  const roleValue = useMemo<RoleValue | ''>(() => {
    const label = answers.role as string | undefined
    if (!label) return ''
    return ROLE_OPTIONS.find(o => o.label === label)?.value ?? ''
  }, [answers.role])

  const steps = useMemo(() => getSections(roleValue), [roleValue])

  // Clamp the current step if the branch (and therefore step count) changed.
  useEffect(() => {
    setStepIndex(i => Math.min(i, steps.length - 1))
  }, [steps.length])

  // Restore a draft from this browser, if any.
  useEffect(() => {
    if (loadedDraft.current) return
    loadedDraft.current = true
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && parsed.answers) {
          setAnswers(parsed.answers)
          if (typeof parsed.stepIndex === 'number') setStepIndex(parsed.stepIndex)
        }
      }
    } catch { /* ignore malformed/unavailable storage */ }
  }, [])

  // Persist a draft as the respondent progresses.
  useEffect(() => {
    if (status !== 'form') return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, stepIndex }))
    } catch { /* storage unavailable — draft simply won't persist */ }
  }, [answers, stepIndex, status])

  const setAnswer = useCallback((id: string, v: any) => {
    setAnswers(prev => ({ ...prev, [id]: v }))
  }, [])

  const section = steps[stepIndex]
  const missing = section ? sectionMissing(section, answers) : []
  const progressPct = steps.length > 0 ? ((stepIndex + 1) / steps.length) * 100 : 0
  const isLastStep = stepIndex === steps.length - 1

  const goNext = () => {
    if (missing.length > 0) { setShowErrors(true); return }
    setShowErrors(false)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setStepIndex(i => Math.min(i + 1, steps.length - 1))
  }

  const goBack = () => {
    setShowErrors(false)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setStepIndex(i => Math.max(i - 1, 0))
  }

  const submit = async () => {
    if (missing.length > 0) { setShowErrors(true); return }
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus('success')
      try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message || 'Could not submit your feedback. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-teal-50 border border-brand-teal/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={26} className="text-brand-orange" />
        </div>
        <h1 className="font-disp font-bold text-2xl text-ink mb-2">Thank you for the feedback</h1>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          Your responses have been submitted to the VoltSage team. If you asked to be contacted for a follow-up, we'll be in touch shortly.
        </p>
        <a href="/" className="btn-primary justify-center inline-flex mt-8"><ArrowLeft size={13} /> Back to voltsage.co</a>
      </div>
    )
  }

  if (!section) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14" ref={topRef}>
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-brand-orange"><ClipboardList size={12} /> VoltSage pilot feedback</span>
        <h1 className="font-disp font-bold text-2xl sm:text-3xl text-ink mt-2">Help us build the right product</h1>
        <p className="text-sm text-ink-muted mt-2">
          Two things at once: how VoltSage worked for you, and how it fits your business. It takes about 8–10 minutes — your progress is saved as you go.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-faint">Step {stepIndex + 1} of {steps.length} · {section.ref}</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-faint">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-border overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#2621FF,#171254)' }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6 sm:p-8">
        <div className="mb-1">
          <h2 className="font-disp font-bold text-xl text-ink">{section.title}</h2>
          {section.description && <p className="text-xs text-ink-faint mt-1">{section.description}</p>}
        </div>
        <div>
          {section.questions.map(q => (
            <div key={q.id}>
              <QuestionField q={q} answers={answers} setAnswer={setAnswer} />
              {showErrors && q.required && !isAnswered(q, answers[q.id]) && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 -mt-3 mb-4"><AlertCircle size={12} /> This question needs an answer.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {status === 'error' && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-mono text-red-500">{errorMsg}</div>
      )}

      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          onClick={goBack}
          disabled={stepIndex === 0 || status === 'submitting'}
          className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={13} /> Back
        </button>
        {isLastStep ? (
          <button onClick={submit} disabled={status === 'submitting'} className="btn-primary disabled:opacity-60">
            {status === 'submitting' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {status === 'submitting' ? 'Submitting…' : 'Submit feedback'}
          </button>
        ) : (
          <button onClick={goNext} className="btn-primary">
            Next <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  )
}

