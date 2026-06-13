import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'path';

// vite.config.ts lives in frontend/ so Vite treats frontend/ as the project root.
// index.html, src/, and all source files resolve relative to frontend/.
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      // Paths relative to frontend/ (the Vite root)
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
  ],
  resolve: {
    alias: {
      // '@/' maps to frontend/src/
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // In dev, forward /api/* to the local Express server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Output to root dist/ so Vercel finds it at project root
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
