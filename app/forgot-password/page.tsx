'use client'

import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
    } else {
      setMessage('We have sent you an email with a link to reset your password. Please follow the instructions.')
    }
  }

  return (
    <div className="mt-12 p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="p-2 border rounded"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white rounded p-2">Send Reset Link</button>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <p className="mt-4 text-sm">
        <a href="/login" className="text-blue-600 underline">Back to Login</a>
      </p>
    </div>
  )
}
