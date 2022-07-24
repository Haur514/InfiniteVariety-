import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:8080/',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
