import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This tells Vite where your files will be hosted on GitHub
  base: '/i-love-bharat-2026/', 
})