import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path = '/Math/' for GitHub Pages (repo name)
// Change this to '/' if deploying to a custom domain or root
export default defineConfig({
  plugins: [react()],
  base: '/Math/',
})
