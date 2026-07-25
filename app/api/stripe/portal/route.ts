import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyPayload, ADV_COOKIE, AdvPayload } from '@/lib/accessCookie'

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ ok: false, error: 'Payments are not configured on the server yet.' }, { status: 500 })
  }

  const token = req.cookies.get(ADV_COOKIE)?.value
  const payload = verifyPayload<AdvPayload>(token)
  if (!payload) return NextResponse.json({ ok: false, error: 'No active subscription found.' }, { status: 401 })

  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' })
  const origin = req.headers.get('origin') || process.env.APP_BASE_URL || ''

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: payload.customerId,
      return_url: `${origin}/#tools`,
    })
    return NextResponse.json({ ok: true, url: portal.url })
  } catch (err) {
    console.error('Billing portal session failed:', err)
    return NextResponse.json({ ok: false, error: 'Could not open the billing portal.' }, { status: 502 })
  }
}
