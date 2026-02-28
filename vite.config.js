/*
Path: vite.config.js
*/

import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const LEGACY_LOCAL_PROXY_ALIASES = {
  '/api/v1/health': '/api/v1/health/',
  '/api/v1/pricing': '/api/v1/pricing/',
  '/api/v1/content': '/api/v1/content/',
  '/api/v1/contact': '/api/v1/contact/',
  '/api/v1/mail': '/api/v1/mail/',
  '/api/v1/quote/diagnostic': '/api/v1/quote/diagnostic/',
  '/api/v1/quote/pdf': '/api/v1/quote/pdf/'
}
const LEGACY_LOCAL_PROXY_PREFIX = '/plantilla-www/public'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const proxyTarget = process.env.VITE_API_PROXY_TARGET?.trim() || 'http://localhost'
  const configuredProxyPrefix = process.env.VITE_API_PROXY_PREFIX?.trim()
  // AppServ exposes the local backend contract at `/api/v1/...` from the web root.
  const proxyPrefix = resolveProxyPrefix(configuredProxyPrefix, proxyTarget)
  const plugins = [vue()]
  const customOutDir = process.env.BUILD_OUT_DIR?.trim()
  const defaultOutDir = 'dist'
  const outDir = customOutDir ? path.resolve(customOutDir) : defaultOutDir

  if (mode !== 'production') {
    plugins.push(vueDevTools())
  }

  if (configuredProxyPrefix && configuredProxyPrefix !== proxyPrefix) {
    console.warn(
      `[vite:proxy] Ignorando VITE_API_PROXY_PREFIX=${configuredProxyPrefix} para target local ${proxyTarget}. ` +
        'Usa VITE_API_PROXY_FORCE_LEGACY_PREFIX=1 si realmente necesitas /plantilla-www/public.'
    )
  }

  return {
    plugins,
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (requestPath) => rewriteProxyPath(requestPath, proxyPrefix, proxyTarget)
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

function rewriteProxyPath(requestPath, proxyPrefix, proxyTarget) {
  const [pathname, searchParams] = requestPath.split('?')
  const rewrittenPath =
    shouldUseLegacyLocalAliases(proxyTarget, proxyPrefix) &&
    Object.prototype.hasOwnProperty.call(LEGACY_LOCAL_PROXY_ALIASES, pathname)
      ? LEGACY_LOCAL_PROXY_ALIASES[pathname]
      : pathname
  const normalizedPrefix = proxyPrefix.replace(/\/+$/, '')
  const pathWithQuery = searchParams ? `${rewrittenPath}?${searchParams}` : rewrittenPath

  return `${normalizedPrefix}${pathWithQuery}`
}

function shouldUseLegacyLocalAliases(proxyTarget, proxyPrefix) {
  if (proxyPrefix) {
    return false
  }

  try {
    const parsedTarget = new URL(proxyTarget)
    const normalizedHost = parsedTarget.hostname.trim().toLowerCase()
    const normalizedPort = parsedTarget.port.trim()
    const isLoopbackHost =
      normalizedHost === 'localhost' || normalizedHost === '127.0.0.1' || normalizedHost === '::1'
    const isDefaultHttpPort = normalizedPort === '' || normalizedPort === '80'

    return parsedTarget.protocol === 'http:' && isLoopbackHost && isDefaultHttpPort
  } catch {
    return false
  }
}

function resolveProxyPrefix(configuredProxyPrefix, proxyTarget) {
  if (!configuredProxyPrefix) {
    return ''
  }

  if (shouldIgnoreLegacyLocalPrefix(proxyTarget, configuredProxyPrefix)) {
    return ''
  }

  return configuredProxyPrefix
}

function shouldIgnoreLegacyLocalPrefix(proxyTarget, proxyPrefix) {
  if (proxyPrefix !== LEGACY_LOCAL_PROXY_PREFIX) {
    return false
  }

  if (process.env.VITE_API_PROXY_FORCE_LEGACY_PREFIX?.trim() === '1') {
    return false
  }

  try {
    const parsedTarget = new URL(proxyTarget)
    const normalizedHost = parsedTarget.hostname.trim().toLowerCase()
    const isLoopbackHost =
      normalizedHost === 'localhost' || normalizedHost === '127.0.0.1' || normalizedHost === '::1'

    return parsedTarget.protocol === 'http:' && isLoopbackHost
  } catch {
    return false
  }
}
