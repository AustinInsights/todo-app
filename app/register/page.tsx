'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) {
        setError(data.error)
    } else {
        router.push(`/register/success?email=${encodeURIComponent(email)}`)
    }
  }

  return (
    <div className="mt-12 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input className="p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white rounded p-2">Register</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 underline">Login</a>
      </p>
    </div>
  )
}
