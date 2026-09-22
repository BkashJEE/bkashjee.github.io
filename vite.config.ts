import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        resume: resolve(__dirname, 'resume/index.html'),
        archive: resolve(__dirname, 'archive/index.html'),
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
})
