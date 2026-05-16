import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@sb/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@sb/api-client': path.resolve(__dirname, '../../packages/api-client/src/index.ts'),
      '@sb/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@sb/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },

});
