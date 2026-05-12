import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  base: './', // Asegura que las rutas sean relativas para que funcione en cualquier subdirectorio
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
