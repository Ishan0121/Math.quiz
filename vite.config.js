import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is relative so it works on any URL
export default defineConfig({
  plugins: [react()],
  base: './',
})
