import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/index.css'
import { UseCasesApp } from './UseCasesApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UseCasesApp />
  </StrictMode>,
)
