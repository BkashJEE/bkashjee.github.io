import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/index.css'
import { UseCasesApp } from './UseCasesApp'

const root = document.getElementById('root')!
const [, slug] = window.location.pathname.split('/').filter(Boolean)
const page = (
  <StrictMode>
    <UseCasesApp slug={slug} />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, page)
else createRoot(root).render(page)
