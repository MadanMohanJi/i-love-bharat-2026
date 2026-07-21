import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ADD THIS LINE! It must match your exact repo name surrounded by slashes
  base: '/i-love-bharat/', 
})
