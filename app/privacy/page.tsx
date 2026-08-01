import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '@/components/Header'
import { Footer } from '@/components/ContactAndFooter'

export const metadata: Metadata = {
  title: 'Privacy Policy — VoltSage Solutions',
  description: 'How VoltSage collects, uses, stores and protects your information across our free solar sizing tools, forms and website.',
}

const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: 'Information We Collect',
    body: (
      <>
        <p>We may collect the following information:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number or WhatsApp number (if provided)</li>
          <li>Country and location (e.g. when unlocking a sizing tool, or requesting a quote review)</li>
          <li>Information about your energy usage, appliances, equipment and solar requirements — entered into our Residential, Agricultural or Battery Runtime sizing tools</li>
          <li>Information you submit through our contact/enquiry form or the free-tool sign-up form</li>
          <li>Technical information such as browser type, device information and website usage analytics</li>
        </ul>
      </>
    ),
  },
  {
    title: 'How We Use Your Information',
    body: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Provide access to and improve VoltSage's free solar sizing and energy assessment tools</li>
          <li>Calculate your recommended inverter, battery and panel sizing based on the details you provide</li>
          <li>Respond to enquiries submitted through our contact form, quote reviews and support requests</li>
          <li>Send updates about VoltSage tools, services and educational content (you may opt out at any time)</li>
          <li>Improve the performance and user experience of our website and tools</li>
          <li>Analyse trends to improve our sizing tools and services</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Information Sharing',
    body: (
      <>
        <p>VoltSage does not sell your personal information, and we never share it with equipment sellers or installers for marketing purposes.</p>
        <p>We may share your information with trusted service providers who help us operate our website or deliver our services — for example, form-processing and email-delivery providers used to route your enquiries to our team. These providers are required to protect your information and use it only for the agreed purposes.</p>
        <p>We may also disclose information where required by applicable law.</p>
      </>
    ),
  },
  {
    title: 'Data Security',
    body: (
      <p>We take reasonable technical and organisational measures to protect your personal information from unauthorised access, loss, misuse or disclosure. However, no internet-based service can guarantee absolute security.</p>
    ),
  },
  {
    title: 'Cookies & Analytics',
    body: (
      <p>Our website uses privacy-conscious analytics (Umami) and similar technologies to understand how visitors use our site and tools, so we can improve them. This does not sell or share your data with advertisers. You can manage cookie preferences through your browser settings.</p>
    ),
  },
  {
    title: 'Your Rights',
    body: (
      <>
        <p>You may request to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your personal information, where applicable</li>
          <li>Withdraw consent to receive marketing communications</li>
        </ul>
        <p>To make any of these requests, please contact us using the details below.</p>
      </>
    ),
  },
  {
    title: 'Third-Party Services',
    body: (
      <p>VoltSage may use third-party services such as website analytics, cloud hosting providers, email services and social media platforms (including WhatsApp for direct contact). These services may collect information in accordance with their own privacy policies.</p>
    ),
  },
  {
    title: 'Changes to This Policy',
    body: (
      <p>We may update this Privacy Policy from time to time. Any changes will be published on this page with the updated effective date.</p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="section-eyebrow">Legal</div>
          <h1 className="font-disp font-extrabold text-4xl sm:text-5xl text-ink uppercase leading-tight mb-4">
            Privacy <span className="brand-text">Policy</span>
          </h1>
          <p className="text-ink-muted text-base leading-relaxed mb-2">
            At VoltSage, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store and protect the information you provide when using our website, free sizing tools and services.
          </p>
          <p className="text-xs font-mono text-ink-faint uppercase tracking-wider mb-12">Effective date: 1 August 2026</p>

          <div className="card p-6 sm:p-10 space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.title}>
                <h2 className="font-disp font-bold text-xl sm:text-2xl text-ink uppercase mb-3">{s.title}</h2>
                <div className="text-ink-muted text-sm sm:text-base leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:marker:text-brand-orange">
                  {s.body}
                </div>
              </section>
            ))}

            <section>
              <h2 className="font-disp font-bold text-xl sm:text-2xl text-ink uppercase mb-3">Contact Us</h2>
              <div className="text-ink-muted text-sm sm:text-base leading-relaxed">
                <p>If you have any questions about this Privacy Policy or how your information is handled, please contact us at:</p>
                <p className="mt-3 font-mono text-ink font-bold">VoltSage</p>
                <a href="mailto:info@voltsage.co" className="text-brand-orange hover:underline">info@voltsage.co</a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
