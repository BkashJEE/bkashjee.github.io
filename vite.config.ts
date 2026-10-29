import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// One place for the site's address (src/content/site.json); the HTML pages read it as %VITE_SITE_URL%.
process.env.VITE_SITE_URL = JSON.parse(readFileSync(resolve(__dirname, 'src/content/site.json'), 'utf8')).url

export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: isSsrBuild
    ? { copyPublicDir: false }
    : {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        resume: resolve(__dirname, 'resume/index.html'),
        archive: resolve(__dirname, 'archive/index.html'),
        partners: resolve(__dirname, 'partners/index.html'),
        useCases: resolve(__dirname, 'use-cases/index.html'),
        ...Object.fromEntries(
          existsSync(resolve(__dirname, 'use-cases'))
            ? readdirSync(resolve(__dirname, 'use-cases'), { withFileTypes: true })
                .filter((entry) => entry.isDirectory() && existsSync(resolve(__dirname, 'use-cases', entry.name, 'index.html')))
                .map((entry) => [`useCase-${entry.name}`, resolve(__dirname, 'use-cases', entry.name, 'index.html')])
            : [],
        ),
      },
    },
  },
}))
