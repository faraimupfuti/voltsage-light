import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL || 'https://hook.eu2.make.com/j2wohmf4y7d3jkjgn36i9bhxseuqbt4e'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let data: any
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const name = String(data.name || '').trim().slice(0, 200)
  const email = String(data.email || '').trim().slice(0, 200)

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please add your name and a valid email.' }, { status: 400 })
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email,
        source: 'voltsage-sizing-tools',
        page: req.headers.get('referer') || undefined,
        ts: new Date().toISOString(),
      }),
    })
  } catch (err) {
    // A webhook hiccup shouldn't block someone from using the free tools —
    // log it and let the signup through.
    console.error('Lead webhook failed:', err)
  }

  return NextResponse.json({ ok: true })
}
