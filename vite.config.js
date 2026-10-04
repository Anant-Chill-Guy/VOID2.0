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
    // three.js (~900 kB) is a lazy route chunk; warn only above it.
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true, // listen on all interfaces
    port: 5173,
    // allow Cloudflare Tunnel host
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
