import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import useCases from './src/content/use-cases.json'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const root = fileURLToPath(new URL('.', import.meta.url))

// One place for the site's address (src/content/site.json); the HTML pages read it as %VITE_SITE_URL%.
process.env.VITE_SITE_URL = JSON.parse(readFileSync(resolve(root, 'src/content/site.json'), 'utf8')).url

export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: isSsrBuild
    ? { copyPublicDir: false }
    : {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        resume: resolve(root, 'resume/index.html'),
        archive: resolve(root, 'archive/index.html'),
        partners: resolve(root, 'partners/index.html'),
        useCases: resolve(root, 'use-cases/index.html'),
        ...Object.fromEntries(useCases.map(({ slug }) => [
          `useCase-${slug}`, resolve(root, 'use-cases', slug, 'index.html'),
        ])),
      },
    },
  },
}))
