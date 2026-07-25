import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Namecheap Private Email SMTP (mail.privateemail.com) — see /mnt config screenshot.
// Override any of these via environment variables on Render if needed.
const SMTP_HOST = process.env.SMTP_HOST || 'mail.privateemail.com'
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : SMTP_PORT === 465
const SMTP_USER = process.env.SMTP_USER || 'info@voltsage.co'
const SMTP_PASS = process.env.SMTP_PASS
const CONTACT_TO = process.env.CONTACT_TO_EMAIL || SMTP_USER

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  if (!SMTP_PASS) {
    console.error('SMTP_PASS is not set — contact form cannot send email.')
    return NextResponse.json({ ok: false, error: 'Email is not configured on the server yet.' }, { status: 500 })
  }

  let data: any
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const name = String(data.name || '').trim().slice(0, 200)
  const contact = String(data.contact || '').trim().slice(0, 200)
  const service = String(data.service || 'General enquiry').trim().slice(0, 200)
  const location = String(data.location || '').trim().slice(0, 200)
  const message = String(data.message || '').trim().slice(0, 5000)

  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: 'Please add your name and contact details.' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE, // true for port 465 (SSL), false for 587 (STARTTLS)
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const textBody = `New enquiry from the VoltSage website\n\nName: ${name}\nContact: ${contact}\nLocation: ${location || '—'}\nService: ${service}\n\nMessage:\n${message || '—'}`
  const htmlBody = `
    <div style="font-family:Arial,sans-serif;color:#0f172a;max-width:560px">
      <h2 style="color:#1B17FF;margin:0 0 16px">New enquiry — VoltSage website</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#64748b;width:120px">Name</td><td style="padding:6px 0"><b>${escapeHtml(name)}</b></td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Contact</td><td style="padding:6px 0">${escapeHtml(contact)}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Location</td><td style="padding:6px 0">${escapeHtml(location || '—')}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Service</td><td style="padding:6px 0">${escapeHtml(service)}</td></tr>
      </table>
      <p style="color:#64748b;margin:16px 0 4px">Message</p>
      <p style="white-space:pre-wrap;border-left:3px solid #1B17FF;padding-left:12px">${escapeHtml(message || '—')}</p>
    </div>`

  try {
    await transporter.sendMail({
      from: `"VoltSage Website" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: EMAIL_RE.test(contact) ? contact : undefined,
      subject: `VoltSage enquiry — ${service} — ${name}`,
      text: textBody,
      html: htmlBody,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form send failed:', err)
    return NextResponse.json({ ok: false, error: 'Could not send your enquiry right now. Please try again shortly.' }, { status: 502 })
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] as string))
}
