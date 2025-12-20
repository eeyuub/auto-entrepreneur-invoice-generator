import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './', // Fix for white page issue on deployment
    plugins: [
      react(),
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:9911',
          changeOrigin: true,
          secure: false,
        }
      }
    },
  }
})
