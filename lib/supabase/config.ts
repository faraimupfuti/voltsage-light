// Both values are public by design (Supabase publishable key + project URL).
// Env vars win; the fallbacks keep builds working if they aren't set at Docker build time.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnlpdsqrqqrmbggjujqi.supabase.co'
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_3KJ5oScBMPnyjQRYUaxUeA_KuGXlMRx'
