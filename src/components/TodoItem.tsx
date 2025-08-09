'use client'

import React from 'react'
import { Todo } from './TodoApp'

interface TodoItemProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 
                    p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200
            ${todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
            }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 m-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-base font-medium transition-all duration-200 ${
            todo.completed
              ? 'text-gray-500 dark:text-gray-400 line-through'
              : 'text-gray-900 dark:text-white'
          }`}>
            {todo.text}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Created: {todo.createdAt}
          </p>
        </div>

        <button
          onClick={onDelete}
          className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 
                   rounded-lg transition-all duration-200"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TodoItem