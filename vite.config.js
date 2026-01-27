import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true,
  },

  server: {
    host: "0.0.0.0",
    port: 4173,
    hmr: {
      overlay: true,
    },
  },

  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['guiaogi.com', 'www.guiaogi.com']
  }
})
