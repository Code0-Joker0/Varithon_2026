import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project at /Varithon_2026/ (repo name as subpath).
  // During local dev, Vite ignores this and serves from /.
  base: '/Varithon_2026/',

  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true, // Expose to all network interfaces for mobile scanning on Wi-Fi
    port: 5173,
    strictPort: false
  }
})

