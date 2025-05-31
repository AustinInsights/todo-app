import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session) {
    return NextResponse.json({ error: error?.message || 'Invalid credentials' }, { status: 401 })
  }
  return NextResponse.json({
    access_token: data.session.access_token,
    user: data.user
  })
}
