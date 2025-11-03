import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], // <-- ELIMINADO de aquí
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      //... (aliases)
    },
  },
});
