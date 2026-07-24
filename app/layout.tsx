import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoltSage Solutions — Solar Sizing & Energy Tools',
  description: 'Free professional solar sizing tools for residential, small commercial and agricultural installations. Know exactly what you need before you buy.',
  keywords: 'solar sizing tool, solar calculator Zimbabwe, battery runtime, agricultural solar, Africa solar, VoltSage',
  openGraph: { title: 'VoltSage Solutions', description: 'Use our free tools before you buy a solar system.', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script defer src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "fd494aad6ebb456eb67e072c220d16e4"}' strategy="afterInteractive" />
      </head>
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  )
}
