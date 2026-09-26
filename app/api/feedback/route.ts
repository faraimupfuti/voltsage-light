import { NextRequest, NextResponse } from 'next/server'
import { ALL_QUESTIONS, ROLE_GROUP, RoleValue } from '@/lib/feedbackForm'

// Same delivery pattern as /api/contact and /api/lead — a Make.com (or
// equivalent) webhook is the only storage path. Set FEEDBACK_WEBHOOK_URL in
// the deployment environment once the pilot-feedback scenario/sheet exists.
const FEEDBACK_WEBHOOK_URL = process.env.FEEDBACK_WEBHOOK_URL

const MAX_STRING = 5000
const MAX_ARRAY = 30
const MAX_OTHER_TEXT = 300

function cleanString(v: unknown, max = MAX_STRING): string {
  return String(v ?? '').trim().slice(0, max)
}

/** Recursively bounds an unknown answer value to a safe, storable shape. */
function cleanValue(v: unknown): unknown {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  if (typeof v === 'string') return cleanString(v)
  if (Array.isArray(v)) return v.slice(0, MAX_ARRAY).map(item => cleanString(item, 300))
  if (typeof v === 'object') {
    const out: Record<string, string> = {}
    for (const [k, val] of Object.entries(v as Record<string, unknown>).slice(0, 40)) {
      out[cleanString(k, 100)] = cleanString(val, 300)
    }
    return out
  }
  return null
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const rawAnswers = body?.answers
  if (!rawAnswers || typeof rawAnswers !== 'object') {
    return NextResponse.json({ ok: false, error: 'No responses were received.' }, { status: 400 })
  }

  const role = cleanString(rawAnswers.role, 100) as RoleValue | ''
  const name = cleanString(rawAnswers.name, 200)
  const organisation = cleanString(rawAnswers.organisation, 200)

  // Minimal server-side gate: the client already walks respondents through
  // full section-by-section validation, so this only guards against
  // malformed/empty submissions reaching the webhook.
  if (!role || !name || !organisation) {
    return NextResponse.json({ ok: false, error: 'Please complete the required fields before submitting.' }, { status: 400 })
  }

  // Build a fixed-column record: every question across every branch gets a
  // key, with null for whichever branch (2A/2B/2C, 7/8) the respondent
  // didn't walk through, per "all fields on the form should be captured".
  const answers: Record<string, unknown> = {}
  for (const q of ALL_QUESTIONS) {
    answers[q.id] = q.id in rawAnswers ? cleanValue(rawAnswers[q.id]) : null
  }
  // "Other" free-text companions (e.g. assessMethod_other) aren't in the
  // schema itself — pass through any matching by naming convention.
  for (const [k, v] of Object.entries(rawAnswers)) {
    if (k.endsWith('_other') && !(k in answers)) {
      answers[k] = cleanString(v as string, MAX_OTHER_TEXT)
    }
  }

  const payload = {
    source: 'voltsage-pilot-feedback',
    roleGroup: role ? ROLE_GROUP[role as RoleValue] ?? null : null,
    submittedAt: new Date().toISOString(),
    page: req.headers.get('referer') || undefined,
    answers,
  }

  if (!FEEDBACK_WEBHOOK_URL) {
    console.error('FEEDBACK_WEBHOOK_URL is not configured — pilot feedback submission was not delivered:', JSON.stringify(payload))
    return NextResponse.json({ ok: false, error: 'Feedback collection is not configured yet. Please try again later.' }, { status: 503 })
  }

  try {
    const res = await fetch(FEEDBACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const bodyText = await res.text().catch(() => '')
      console.error(`Feedback webhook responded ${res.status}: ${bodyText.slice(0, 300)}`)
      return NextResponse.json({ ok: false, error: 'Could not submit your feedback right now. Please try again shortly.' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Feedback webhook failed:', err)
    return NextResponse.json({ ok: false, error: 'Could not submit your feedback right now. Please try again shortly.' }, { status: 502 })
  }
}
