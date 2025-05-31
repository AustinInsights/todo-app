'use client'
import { useState } from 'react'

export default function TodoForm({ token }: { token: string }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error)
    } else {
      setTitle('')
      setSuccess(true)
      window.dispatchEvent(new Event('refresh-todos')) // let list refresh
    }
  }

  return (
    <form onSubmit={handleAdd} className="flex gap-2 mb-6">
      <input
        className="flex-1 p-2 border rounded"
        type="text"
        placeholder="Add a new task"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        disabled={loading}
      />
      <button className="bg-blue-600 text-white rounded p-2 min-w-[100px]" disabled={loading}>
        {loading ? 'Adding...' : 'Add'}
      </button>
      {error && <span className="text-red-500 ml-2">{error}</span>}
      {success && <span className="text-green-600 ml-2">Added!</span>}
    </form>
  )
}
