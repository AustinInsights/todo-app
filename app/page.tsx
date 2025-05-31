'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check URL for verification params (hash or query string)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search)
      if (
        (params.get('access_token') && params.get('type') === 'signup') ||
        (params.get('access_token') && params.get('type') === 'recovery')
      ) {
        router.replace('/verified')
      }
    }
  }, [router])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to To-Do App</h1>
      <div className="flex gap-4">
        <a href="/login" className="text-blue-600 underline">Login</a>
        <a href="/register" className="text-blue-600 underline">Register</a>
      </div>
    </main>
  )
}
