import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      babelrc: false,
      configFile: false
    }
  })],
  server: {
    proxy: {
      '/api/convert': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/api/issues': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/api/books': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/stock-prices': {
        target: 'http://localhost:3003',
        changeOrigin: true
      },
      '/api/threads': {
        target: 'http://localhost:3004',
        changeOrigin: true
      },
      '/api/replies': {
        target: 'http://localhost:3004',
        changeOrigin: true
      }
    }
  }
})
