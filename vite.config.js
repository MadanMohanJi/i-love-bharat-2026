import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Using './' tells the browser to look in the current folder!
  // This prevents the White Screen of Death on GitHub Pages.
  base: './', 
})