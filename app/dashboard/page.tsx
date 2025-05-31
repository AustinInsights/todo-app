'use client'
import { useEffect, useState } from 'react'
import TodoList from '@/components/todo-list'
import TodoForm from '@/components/todo-form'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      router.push('/login')
      return
    }
    // Check if token is still valid
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('access_token')
          router.push('/login')
        } else {
          setToken(access_token)
        }
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        router.push('/login')
        setLoading(false)
      })
  }, [router])

  function handleLogout() {
    localStorage.removeItem('access_token')
    router.push('/login')
  }

  if (loading) {
    return <p className="mt-10 text-center text-gray-500">Loading...</p>
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My To-Do List</h1>
        <button className="text-gray-500 underline" onClick={handleLogout}>Logout</button>
      </div>
      {token && (
        <>
          <TodoForm token={token} />
          <TodoList token={token} />
        </>
      )}
    </div>
  )
}
