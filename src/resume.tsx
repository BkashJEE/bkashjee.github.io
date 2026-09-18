import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/resume.css'
import ResumePage from './ResumePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResumePage />
  </StrictMode>,
)
