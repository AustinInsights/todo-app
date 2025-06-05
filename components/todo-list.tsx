'use client'
import { useEffect, useState } from 'react'
import { Todo, TodoStatus } from '@/types/todo'

const PAGE_SIZE = 10

export default function TodoList({ token }: { token: string }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [refreshFlag, setRefreshFlag] = useState(false)

  function fetchTodos() {
    setLoading(true)
    setError('')
    fetch(
      `/api/todos?status=${status === 'all' ? '' : status}&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(data => {
        setTodos(data.todos || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTodos()
    // Listen for custom event to refresh
    const listener = () => setRefreshFlag(v => !v)
    window.addEventListener('refresh-todos', listener)
    return () => window.removeEventListener('refresh-todos', listener)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    fetchTodos()
    // eslint-disable-next-line
  }, [status, page, refreshFlag])

  async function handleDelete(id: string) {
    if (!confirm('Delete this to-do?')) return
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    window.dispatchEvent(new Event('refresh-todos'))
  }

  async function handleToggleStatus(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: todo.status === 'pending' ? 'completed' : 'pending' })
    })
    window.dispatchEvent(new Event('refresh-todos'))
  }

  async function handleEditTitle(todo: Todo) {
    const newTitle = prompt('Edit to-do', todo.title)
    if (newTitle && newTitle.trim() !== '' && newTitle !== todo.title) {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle })
      })
      window.dispatchEvent(new Event('refresh-todos'))
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
