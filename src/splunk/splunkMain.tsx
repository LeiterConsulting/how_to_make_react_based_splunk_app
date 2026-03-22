import React from 'react'
import ReactDOM from 'react-dom/client'
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider'
import App from '../App'
import '../styles.css'

function mount() {
  const el = document.getElementById('splunk-react-app-root')
  if (!el) return

  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
        <App />
      </SplunkThemeProvider>
    </React.StrictMode>,
  )
}

mount()
