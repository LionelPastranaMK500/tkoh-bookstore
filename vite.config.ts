import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      //'@routes': path.resolve(__dirname, './src/routes'),
      //'@layouts': path.resolve(__dirname, './src/layouts'),
      //'@modules': path.resolve(__dirname, './src/modules'),
      //'@components': path.resolve(__dirname, './src/components'),
      //'@services': path.resolve(__dirname, './src/services'),
      //'@utils': path.resolve(__dirname, './src/utils'),
      //'@styles': path.resolve(__dirname, './src/styles'),
    },
  },
});
