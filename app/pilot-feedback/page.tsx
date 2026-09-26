import type { Metadata } from 'next'
import Header from '@/components/Header'
import { Footer } from '@/components/ContactAndFooter'
import PilotFeedbackForm from '@/components/PilotFeedbackForm'

export const metadata: Metadata = {
  title: 'VoltSage Pilot Feedback',
  description: 'Share feedback on your VoltSage pilot experience — product usability and how VoltSage fits your workflow.',
  robots: { index: false, follow: false },
}

export default function PilotFeedbackPage() {
  return (
    <>
      <Header />
      <main className="bg-surface-subtle min-h-screen pt-24 sm:pt-28">
        <PilotFeedbackForm />
      </main>
      <Footer />
    </>
  )
}
