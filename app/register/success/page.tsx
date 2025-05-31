'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function SuccessContent() {
  const params = useSearchParams()
  const email = params.get('email') || 'user'
  const router = useRouter()

  return (
    <div className="mt-12 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Welcome, {email}!</h1>
      <p className="mb-6">
        Thanks for registering.<br />
        Supabase Auth sent you a verification link to your email address.<br />
        Please follow the link to confirm your email.<br />
        Make sure to check your junk or spam folder if you don't see it in your inbox.
      </p>
      <button
        className="bg-blue-600 text-white rounded p-2"
        onClick={() => router.push('/login')}
      >
        Go to Login
      </button>
    </div>
  )
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
