import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sb/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@sb/api-client': path.resolve(__dirname, '../../packages/api-client/src/index.ts'),
      '@sb/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@sb/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
    },
  },
});
