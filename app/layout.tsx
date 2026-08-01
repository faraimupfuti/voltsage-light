import type { Metadata } from 'next'
import { AccessProvider } from '@/components/AccessGate'
import { LanguageProvider } from '@/components/LanguageProvider'
import Analytics from '@/components/Analytics'
import CookieConsent from '@/components/CookieConsent'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoltSage Solutions — Solar Sizing & Energy Tools',
  description: 'Free professional solar sizing tools for residential, small commercial and agricultural installations. Know exactly what you need before you buy.',
  keywords: 'solar sizing tool, solar calculator Zimbabwe, battery runtime, agricultural solar, Africa solar, VoltSage',
  openGraph: { title: 'VoltSage Solutions', description: 'Use our free tools before you buy a solar system.', type: 'website' },
  icons: {
    icon: [{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }, { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-slate-900 antialiased">
        <Analytics />
        <LanguageProvider><AccessProvider>{children}</AccessProvider></LanguageProvider>
        <CookieConsent />
      </body>
    </html>
  )
}
