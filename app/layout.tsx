import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { AccessProvider } from '@/components/AccessGate'
import { LanguageProvider } from '@/components/LanguageProvider'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

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
      <head>
        {/* Umami analytics */}
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="8943deb8-9bcf-418b-aa6d-7c88175e3ca8" strategy="afterInteractive" />
      </head>
      <body className="bg-white text-slate-900 antialiased"><LanguageProvider><AccessProvider>{children}</AccessProvider></LanguageProvider></body>
    </html>
  )
}
