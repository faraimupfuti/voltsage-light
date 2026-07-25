import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { signPayload, ADV_COOKIE } from '@/lib/accessCookie'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const THIRTY_FIVE_DAYS_MS = 35 * 24 * 60 * 60 * 1000

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ ok: false, error: 'Payments are not configured on the server yet.' }, { status: 500 })
  }

  let data: any
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const email = String(data.email || '').trim()
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Enter a valid email.' }, { status: 400 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' })

  try {
    const customers = await stripe.customers.list({ email, limit: 5 })
    for (const c of customers.data) {
      let subs = await stripe.subscriptions.list({ customer: c.id, status: 'active', limit: 1 })
      if (!subs.data.length) subs = await stripe.subscriptions.list({ customer: c.id, status: 'trialing', limit: 1 })
      const sub = subs.data[0]
      if (sub) {
        const exp = Date.now() + THIRTY_FIVE_DAYS_MS
        const token = signPayload({ email, customerId: c.id, subscriptionId: sub.id, exp })
        const res = NextResponse.json({ ok: true })
        res.cookies.set(ADV_COOKIE, token, {
          httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: THIRTY_FIVE_DAYS_MS / 1000,
        })
        return res
      }
    }
    return NextResponse.json({ ok: false, error: 'No active Advanced subscription found for that email.' }, { status: 404 })
  } catch (err) {
    console.error('Stripe restore lookup failed:', err)
    return NextResponse.json({ ok: false, error: 'Could not check your subscription right now.' }, { status: 502 })
  }
}
