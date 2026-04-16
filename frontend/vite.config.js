// vite.config.js — Configuración de Vite (el servidor de desarrollo)
// Aquí le decimos a Vite que usamos React y que el backend
// está en el puerto 8000 para evitar errores de CORS

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto del frontend
    proxy: {
      // Redirige las peticiones /api al backend Laravel
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});
