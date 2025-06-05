'use client'
import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { Todo } from '@/types/todo'

const PAGE_SIZE = 10 

export default function TodoList({ token }: { token: string }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  // Fetch user id from the token
  useEffect(() => {
    async function getUserId() {
      if (!token) return
      const { data, error } = await supabase.auth.getUser(token)
      if (error || !data.user) {
        setError('Session expired or invalid.')
      } else {
        setUserId(data.user.id)
      }
    }
    getUserId()
  }, [token])

  // Fetch todos for the user
  async function fetchTodos(currentUserId: string) {
    setLoading(true)
    setError('')
    let query = supabase
      .from('todos')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)
    if (status !== 'all') {
      query = query.eq('status', status)
    }
    const { data, error } = await query
    if (error) {
      setError('Failed to load')
      setLoading(false)
      return
    }
    setTodos(data || [])
    setLoading(false)
  }

  // On mount and on changes, fetch todos
  useEffect(() => {
    if (!userId) return
    fetchTodos(userId)
    // eslint-disable-next-line
  }, [userId, status, page])

  // Set up realtime subscription for the user's todos
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('realtime-todos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Any change (INSERT, UPDATE, DELETE): re-fetch current todos
          fetchTodos(userId)
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line
  }, [userId, status, page])

  async function handleDelete(id: string) {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    // No need to manually refresh; real-time will handle it!
  }

  async function handleToggleStatus(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: todo.status === 'pending' ? 'completed' : 'pending' })
    })
    // No need to manually refresh; real-time will handle it!
  }

  async function handleEditTitle(todo: Todo) {
    const newTitle = prompt('Edit to-do', todo.title)
    if (newTitle && newTitle.trim() !== '' && newTitle !== todo.title) {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle })
      })
      // No need to manually refresh; real-time will handle it!
    }
  }

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <label>
          <select
            className="p-1 border rounded"
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(0) }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="divide-y">
        {todos.length === 0 && !loading && <li className="text-gray-400 text-center p-4">No to-dos found.</li>}
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2 py-2 group">
            <input
              type="checkbox"
              checked={todo.status === 'completed'}
              onChange={() => handleToggleStatus(todo)}
              className="h-5 w-5"
            />
            <span
              className={`flex-1 ${todo.status === 'completed' ? 'line-through text-gray-400' : ''} cursor-pointer`}
              onClick={() => handleEditTitle(todo)}
            >
              {todo.title}
            </span>
            <button
              className="opacity-60 group-hover:opacity-100 text-sm text-red-600"
              onClick={() => handleDelete(todo.id)}
              aria-label="Delete"
            >
              &#10005;
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 mt-4 justify-end">
        <button
          className="p-1 px-3 rounded bg-gray-200 disabled:opacity-50"
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          Prev
        </button>
        <button
          className="p-1 px-3 rounded bg-gray-200 disabled:opacity-50"
          disabled={todos.length < PAGE_SIZE}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
