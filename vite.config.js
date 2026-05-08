import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["erica-delineative-jordan.ngrok-free.dev"],
    proxy: {
      // Proxy ban check API to avoid CORS — browser calls /api/bancheck, Vite forwards to thug4ff
      '/api/bancheck': {
        target: 'http://raw.thug4ff.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bancheck/, '/check_ban'),
        secure: false,
      }
    }
  }
})
