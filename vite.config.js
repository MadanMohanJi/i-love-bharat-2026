import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This completely fixes the 404 error on GitHub Pages
  // by telling it exactly which folder to look in!
  base: '/i-love-bharat-2026/', 
})