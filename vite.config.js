/*
Path: vite.config.js
*/

import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const proxyTarget = process.env.VITE_API_PROXY_TARGET?.trim() || 'http://localhost'
  const proxyPrefix = process.env.VITE_API_PROXY_PREFIX?.trim() ?? '/plantilla-www/public'
  const plugins = [vue()]
  const customOutDir = process.env.BUILD_OUT_DIR?.trim()
  const defaultOutDir = 'dist'
  const outDir = customOutDir ? path.resolve(customOutDir) : defaultOutDir

  if (mode !== 'production') {
    plugins.push(vueDevTools())
  }

  return {
    plugins,
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (requestPath) => `${proxyPrefix}${requestPath}`
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir,
      // Keep CI/default behavior for dist; avoid deleting external directories.
      emptyOutDir: !customOutDir
    },
    esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : undefined,
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './tests/setup.ts',
      include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
      exclude: ['tests/e2e/**'],
      css: true
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
        }
      }
    }
  }
})
