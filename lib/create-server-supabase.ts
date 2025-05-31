import { createClient } from '@supabase/supabase-js'

export function createServerSupabase(token: string | null) {
  const globalOptions: { headers?: { Authorization: string } } = {}
  if (token) {
    globalOptions.headers = { Authorization: `Bearer ${token}` }
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: globalOptions,
    }
  )
}
