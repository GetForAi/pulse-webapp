import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // корень проекта (по умолчанию .)
  build: {
    outDir: 'dist', // куда собирать
    emptyOutDir: true, // очищать перед сборкой
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
