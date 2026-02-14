/*
Path: vite.config.js
*/

import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import removeConsole from 'vite-plugin-remove-console'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    vue(),
    removeConsole({ exclude: ['info', 'error', 'warn'] })
  ]
  const customOutDir = process.env.BUILD_OUT_DIR?.trim()
  const outDir = customOutDir ? path.resolve(customOutDir) : 'dist'

  if (mode !== 'production') {
    plugins.push(vueDevTools())
  }

  return {
    plugins,
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
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './tests/setup.ts',
      include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
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
