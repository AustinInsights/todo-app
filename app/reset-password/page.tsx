'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.hash.slice(1))
      const access_token = params.get('access_token')
      setToken(access_token)
    }
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!token) {
      setError('Reset token missing. Please use the link from your email.')
      return
    }

    // Step 1: Create a client with the reset token as the current session
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    })

    // Step 2: Now call updateUser
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="mt-12 p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Password Reset Successful</h1>
        <p className="mb-6">Your password has been changed successfully.</p>
        <a href="/login" className="bg-blue-600 text-white rounded p-2">Go Back to Login</a>
      </div>
    )
  }

  return (
    <div className="mt-12 p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      <form className="flex flex-col gap-4" onSubmit={handleReset}>
        <input
          type="password"
          className="p-2 border rounded"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="p-2 border rounded"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white rounded p-2">Reset Password</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  )
}
