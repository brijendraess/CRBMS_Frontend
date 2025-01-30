import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow connections from other devices
    port: 5173, // Ensure the correct port is specified
  },
  build: {
    chunkSizeWarningLimit: 5000 // 1MB
  }
},
)
