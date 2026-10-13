import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5175,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/pacientes': 'http://localhost:3000',
      '/exames': 'http://localhost:3000',
      '/resultados': 'http://localhost:3000',
      '/historico': 'http://localhost:3000',
      '/usuarios': 'http://localhost:3000',
      '/logs': 'http://localhost:3000'
    }
  }
});