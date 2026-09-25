import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2035',
            color: '#e2e8f0',
            border: '1px solid #252d45',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0f1117' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f1117' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)