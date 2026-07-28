import type { Metadata } from 'next'
import Script from 'next/script'
import { AccessProvider } from '@/components/AccessGate'
import { LanguageProvider } from '@/components/LanguageProvider'
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
      <head>
        <Script defer src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "fd494aad6ebb456eb67e072c220d16e4"}' strategy="afterInteractive" />
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-RFR1NS0JPF" strategy="afterInteractive" />
        <Script id="ga-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RFR1NS0JPF');
          `}
        </Script>
      </head>
      <body className="bg-white text-slate-900 antialiased"><LanguageProvider><AccessProvider>{children}</AccessProvider></LanguageProvider></body>
    </html>
  )
}
