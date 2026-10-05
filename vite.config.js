import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true, 
    port: 5173,
    
    allowedHosts: [
      'permit-veteran-mysimon-played.trycloudflare.com '
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
