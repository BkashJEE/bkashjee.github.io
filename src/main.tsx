import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/index.css'
import App from './App'

const root = document.getElementById('root')!
const page = (
  <StrictMode>
    <App />
  </StrictMode>
)
// The build pre-renders this page into #root; hydrate over it rather than
// throwing it away. A dev server serves an empty #root, so render fresh there.
if (root.hasChildNodes()) hydrateRoot(root, page)
else createRoot(root).render(page)
