import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider'
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
      <App />
    </SplunkThemeProvider>
  </StrictMode>,
)
