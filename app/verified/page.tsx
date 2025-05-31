'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function VerifiedPage() {
  const router = useRouter()
  useEffect(() => {
    // Optionally, in a real app, you can use the access_token to sign in the user immediately.
    // Here, we simply provide a message and a login link.
  }, [])

  return (
    <div className="mt-12 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Email Verified!</h1>
      <p className="mb-6">
        Your email address has been successfully verified.<br />
        You can now log in with your credentials.
      </p>
      <a href="/login" className="bg-blue-600 text-white rounded p-2">Go to Login</a>
    </div>
  )
}
