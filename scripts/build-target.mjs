import { spawnSync } from 'node:child_process'
import path from 'node:path'

const SUPPORTED_TARGETS = new Set(['datamaq', 'upp', 'example', 'e2e'])
const DEFAULT_TARGET = 'datamaq'

function normalize(value) {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim().toLowerCase()
  return trimmed || undefined
}

function resolveTarget(argv) {
  const explicitTargetArg = argv.find((arg) => arg.startsWith('--target='))
  const fromEqualFlag = explicitTargetArg?.split('=')[1]
  const fromSeparateFlag = (() => {
    const index = argv.findIndex((arg) => arg === '--target')
    if (index === -1) {
      return undefined
    }
    return argv[index + 1]
  })()
  const fromPositional = argv.find((arg) => !arg.startsWith('--'))

  const target =
    normalize(fromEqualFlag) ??
    normalize(fromSeparateFlag) ??
    normalize(fromPositional) ??
    DEFAULT_TARGET

  if (!SUPPORTED_TARGETS.has(target)) {
    throw new Error(
      `[build-target] invalid target "${target}". Expected one of: ${Array.from(SUPPORTED_TARGETS).join(', ')}`
    )
  }
  return target
}

function run(command, args, envOverrides = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...envOverrides
    }
  })

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status)
  }

  if (result.error) {
    throw result.error
  }
}

function main() {
  const target = resolveTarget(process.argv.slice(2))
  const viteBin = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')
  const targetBuildEnv = target === 'datamaq'
    ? {
      VITE_BACKEND_BASE_URL: 'https://api.datamaq.com.ar',
      VITE_INQUIRY_API_URL: 'https://n8n.datamaq.com.ar/webhook/contact-form'
    }
    : {}

  run(process.execPath, ['scripts/generate-sitemap.mjs', '--target', target])
  run(process.execPath, [viteBin, 'build', '--mode', target], targetBuildEnv)
}

main()
