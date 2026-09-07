import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'lucide-vendor';
            }
            if (id.includes('recharts')) {
              return 'recharts-vendor';
            }
            if (id.includes('tesseract.js')) {
              return 'tesseract-vendor';
            }
            if (id.includes('jspdf')) {
              return 'jspdf-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
