import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { signPayload, ADV_COOKIE } from '@/lib/accessCookie'

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

  const sessionId = String(data.sessionId || '')
  if (!sessionId) return NextResponse.json({ ok: false, error: 'Missing checkout session.' }, { status: 400 })

  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription'] })
    const sub = session.subscription as Stripe.Subscription | null
    const active = session.payment_status === 'paid' && sub && ['active', 'trialing'].includes(sub.status)

    if (!active || !session.customer_email) {
      return NextResponse.json({ ok: false, error: 'Payment has not been confirmed yet.' }, { status: 402 })
    }

    const exp = Date.now() + THIRTY_FIVE_DAYS_MS
    const token = signPayload({
      email: session.customer_email,
      customerId: String(session.customer),
      subscriptionId: sub!.id,
      exp,
    })

    const res = NextResponse.json({ ok: true, email: session.customer_email })
    res.cookies.set(ADV_COOKIE, token, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: THIRTY_FIVE_DAYS_MS / 1000,
    })
    return res
  } catch (err) {
    console.error('Stripe checkout verification failed:', err)
    return NextResponse.json({ ok: false, error: 'Could not verify your payment.' }, { status: 502 })
  }
}
