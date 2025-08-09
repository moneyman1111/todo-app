'use client'

import React, { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import ThemeToggle from './ThemeToggle'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos)
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos)
        }
      } catch (error) {
        console.error('Error parsing todos from localStorage:', error)
      }
    }
  }, [])

  // Сохранение в localStorage при изменении todos
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, mounted])

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      setTodos([newTodo, ...todos])
      setInputValue('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed
      case 'completed':
        return todo.completed
      default:
        return true
    }
  })

  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.filter(todo => todo.completed).length

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
          Todo App
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Organize your tasks beautifully
        </p>
        <ThemeToggle />
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
          />
          <button
            onClick={addTodo}
            disabled={!inputValue.trim()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                     text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:transform-none disabled:hover:bg-gray-300"
          >
            Add
          </button>
        </div>
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Total: {todos.length}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              Active: {activeCount}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Completed: {completedCount}
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      {todos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'completed'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize
                  ${filter === filterOption
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {filterOption}
              </button>
            ))}
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 
                         text-white transition-all duration-200 ml-auto"
              >
                Clear Completed
              </button>
            )}
          </div>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg">
              {todos.length === 0 
                ? "No tasks yet. Add one above to get started!" 
                : `No ${filter} tasks`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoApp