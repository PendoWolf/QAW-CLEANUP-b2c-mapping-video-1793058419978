import { useEffect, useId, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'clearlist-todos'

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')
  const inputId = useId()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(event) {
    event.preventDefault()
    const value = text.trim()
    if (!value) return

    setTodos((current) => [
      { id: crypto.randomUUID(), text: value, done: false },
      ...current,
    ])
    setText('')
  }

  function toggleTodo(id) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    )
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.done))
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done
    if (filter === 'done') return todo.done
    return true
  })

  const remaining = todos.filter((todo) => !todo.done).length
  const completedCount = todos.length - remaining

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <main className="shell">
        <header className="hero">
          <p className="brand">Clearlist</p>
          <h1>What needs doing?</h1>
          <p className="lede">Add a task, check it off, keep moving.</p>
        </header>

        <form className="composer" onSubmit={addTodo}>
          <label className="sr-only" htmlFor={inputId}>
            New task
          </label>
          <input
            id={inputId}
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write a task…"
            autoComplete="off"
          />
          <button type="submit" disabled={!text.trim()}>
            Add
          </button>
        </form>

        <div className="toolbar">
          <p className="count">
            {remaining === 0
              ? todos.length === 0
                ? 'No tasks yet'
                : 'All clear'
              : `${remaining} left`}
          </p>
          <div className="filters" role="group" aria-label="Filter tasks">
            {[
              ['all', 'All'],
              ['active', 'Active'],
              ['done', 'Done'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={filter === value ? 'is-active' : undefined}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="list">
          {visibleTodos.map((todo, index) => (
            <li
              key={todo.id}
              className={todo.done ? 'item is-done' : 'item'}
              style={{ '--i': index }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
              </label>
              <button
                type="button"
                className="delete"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete ${todo.text}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {visibleTodos.length === 0 && todos.length > 0 && (
          <p className="empty">Nothing in this view.</p>
        )}

        {completedCount > 0 && (
          <button type="button" className="clear" onClick={clearCompleted}>
            Clear {completedCount} completed
          </button>
        )}
      </main>
    </div>
  )
}

export default App
