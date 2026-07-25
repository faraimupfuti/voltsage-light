import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID
  if (!secretKey || !priceId) {
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
    return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' })
  const origin = req.headers.get('origin') || process.env.APP_BASE_URL || ''

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#tools`,
      cancel_url: `${origin}/?checkout=cancel#tools`,
      allow_promotion_codes: true,
    })
    return NextResponse.json({ ok: true, url: session.url })
  } catch (err) {
    console.error('Stripe checkout session creation failed:', err)
    return NextResponse.json({ ok: false, error: 'Could not start checkout. Please try again.' }, { status: 502 })
  }
}
