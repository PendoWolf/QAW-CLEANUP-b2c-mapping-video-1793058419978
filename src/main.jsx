import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Boot Pendo once, before the app renders. An empty visitor id lets the SDK
// reuse a previously stored visitor or fall back to a new anonymous one.
pendo.initialize({
  visitor: {
    id: '',
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
