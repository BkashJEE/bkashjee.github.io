import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/resume.css'
import ResumePage from './ResumePage'

const root = document.getElementById('root')!
const page = (
  <StrictMode>
    <ResumePage />
  </StrictMode>
)
// The build pre-renders this page into #root; hydrate over it rather than
// throwing it away. A dev server serves an empty #root, so render fresh there.
if (root.hasChildNodes()) hydrateRoot(root, page)
else createRoot(root).render(page)
