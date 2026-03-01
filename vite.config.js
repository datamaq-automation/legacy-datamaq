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
  const proxyTarget = process.env.VITE_API_PROXY_TARGET?.trim() || 'http://127.0.0.1:8000'
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
          configure: (proxy) => attachBackendProxyDiagnostics(proxy, proxyTarget),
          rewrite: (requestPath) => rewriteProxyPath(requestPath)
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
    esbuild:
      mode === 'production'
        ? {
            // Keep warn/error visible in production diagnostics while stripping lower-signal console calls.
            pure: ['console.log', 'console.info', 'console.debug'],
            drop: ['debugger']
          }
        : undefined,
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

function rewriteProxyPath(requestPath) {
  if (!requestPath.startsWith('/api/v1/')) {
    return requestPath
  }

  return requestPath.replace('/api/v1/', '/v1/')
}

export function attachBackendProxyDiagnostics(proxy, proxyTarget) {
  const requestFailures = new Map()

  proxy.on('error', (error, request) => {
    const code = typeof error?.code === 'string' ? error.code : 'UNKNOWN'
    const method = typeof request?.method === 'string' ? request.method : 'GET'
    const requestUrl = typeof request?.url === 'string' ? request.url : '/unknown'
    const bucketKey = `${method} ${requestUrl} ${code}`
    const nextCount = (requestFailures.get(bucketKey) ?? 0) + 1

    requestFailures.set(bucketKey, nextCount)

    const suffix = nextCount > 1 ? ` (x${nextCount})` : ''
    const target = normalizeProxyTarget(proxyTarget)
    const reason = code === 'ECONNREFUSED' ? 'backend-offline' : 'proxy-error'
    console.warn(`[vite:proxy] ${method} ${requestUrl} -> ${target} ${reason}${suffix}`, {
      code,
      target
    })
  })
}

function normalizeProxyTarget(value) {
  if (typeof value !== 'string') {
    return 'unknown-target'
  }

  const trimmed = value.trim()
  return trimmed || 'unknown-target'
}
