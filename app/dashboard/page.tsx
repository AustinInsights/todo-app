'use client'
import { useEffect, useState } from 'react'
import TodoList from '@/components/todo-list'
import TodoForm from '@/components/todo-form'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [hasTodos, setHasTodos] = useState(false)

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

  // Check if user has todos (for warning)
  useEffect(() => {
    if (!token) return
    fetch('/api/todos?limit=1', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setHasTodos(data.todos && data.todos.length > 0)
      })
  }, [token])

  function handleLogout() {
    localStorage.removeItem('access_token')
    router.push('/login')
  }

  async function handleUnregister() {
    if (!token) return
    const res = await fetch('/api/account/delete', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      localStorage.removeItem('access_token')
      alert('Your account has been deleted. Goodbye!')
      router.push('/')
    } else {
      alert('Failed to delete your account.')
    }
  }

  if (loading) {
    return <p className="mt-10 text-center text-gray-500">Loading...</p>
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My To-Do List</h1>
        <div className="flex gap-4">
          <button className="text-gray-500 underline" onClick={handleLogout}>
            Logout
          </button>
          <button
            className="text-red-500 underline"
            onClick={() => setShowDeleteDialog(true)}
          >
            Un-Register
          </button>
        </div>
      </div>
      {token && (
        <>
          <TodoForm token={token} />
          <TodoList token={token} />
        </>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="font-bold text-xl mb-4 text-red-600">Confirm Un-Registration</h2>
            <p className="mb-4">
              Are you sure you want to un-register your account?
              {hasTodos && (
                <>
                  <br />
                  <span className="text-red-500">
                    Warning: Un-registering will remove your account and any associated To-Dos.
                  </span>
                </>
              )}
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleUnregister}
              >
                Yes, Un-Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
