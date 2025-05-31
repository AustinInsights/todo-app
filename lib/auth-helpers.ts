import { NextRequest } from 'next/server'
import supabase from './supabase'

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  const { data, error } = await supabase.auth.getUser(token)
  return error ? null : data.user
}
