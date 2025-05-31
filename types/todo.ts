export type TodoStatus = 'pending' | 'completed'

export interface Todo {
  id: string
  user_id: string
  title: string
  status: TodoStatus
  created_at: string
}
