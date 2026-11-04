import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_KEY } from './config'

let client: ReturnType<typeof createBrowserClient> | null = null
export function getSupabase() {
  if (!client) client = createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
  return client
}
