import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for deleting users (admin privilege)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Authenticated user's client (to get user ID)
  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  )
  // Get user
  const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Optional: check if user has todos
  const { count } = await supabaseUser
    .from('todos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Actually delete the user (using Admin API)
  const { error: adminError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
  if (adminError) {
    return NextResponse.json({ error: adminError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, todoCount: count })
}
