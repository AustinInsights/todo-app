export default function Home() {
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
