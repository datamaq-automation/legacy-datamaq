/*
Path: vite.config.js
*/

import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY_TARGET?.trim() || 'http://127.0.0.1:8899'
  const plugins = [
    tailwind(),
    vue()
  ]
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
  const hintTimestamps = new Map()
  const hintCooldownMs = 30_000

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
    const verbose = process.env.VITE_PROXY_VERBOSE === 'true'
    const actionableHint = resolveActionableHint({ code, target, verbose })

    console.warn(`[vite:proxy] ${method} ${requestUrl} -> ${target} ${reason}${suffix}${actionableHint}`)

    if (verbose) {
      console.warn('[vite:proxy:details]', {
        code,
        target,
        request: `${method} ${requestUrl}`,
        message: error?.message ?? null
      })
    }

    if (code === 'ECONNREFUSED') {
      maybeLogBackendOfflineSummary({
        target,
        hintTimestamps,
        hintCooldownMs
      })
    }
  })
}

function resolveActionableHint({ code, target, verbose }) {
  if (code !== 'ECONNREFUSED') {
    return verbose ? ' (ejecuta sin verbose para menos ruido)' : ''
  }

  const hint = ` | Backend no disponible en ${target}. Inicia el backend o actualiza VITE_API_PROXY_TARGET.`
  if (verbose) {
    return `${hint} (verbose activo)`
  }

  return `${hint} Usa VITE_PROXY_VERBOSE=true para detalle tecnico.`
}

function maybeLogBackendOfflineSummary({ target, hintTimestamps, hintCooldownMs }) {
  const now = Date.now()
  const lastTimestamp = hintTimestamps.get(target) ?? 0
  if (now - lastTimestamp < hintCooldownMs) {
    return
  }

  hintTimestamps.set(target, now)
  console.warn(`[vite:proxy:summary] Frontend OK. Proxy backend OFFLINE (${target}).`)
}

function normalizeProxyTarget(value) {
  if (typeof value !== 'string') {
    return 'unknown-target'
  }

  const trimmed = value.trim()
  return trimmed || 'unknown-target'
}
