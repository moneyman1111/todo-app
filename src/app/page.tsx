import TodoApp from '../components/TodoApp'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <TodoApp />
      </div>
    </main>
  )
}