import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Electron'da dosya sistemi (file://) üzerinden çalışacağı için
  // yolların mutlak (/) değil göreceli (./) olması gerekir.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});