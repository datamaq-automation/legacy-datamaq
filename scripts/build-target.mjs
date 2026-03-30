import { spawnSync } from 'node:child_process'
import path from 'node:path'

const BUILD_TARGET = 'datamaq'

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
  const viteBin = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')
  const targetBuildEnv = {
    VITE_BACKEND_BASE_URL: 'https://api.datamaq.com.ar',
    VITE_INQUIRY_API_URL: 'https://n8n.datamaq.com.ar/webhook/contact-form'
  }

  run(process.execPath, ['scripts/generate-sitemap.mjs'])
  run(process.execPath, [viteBin, 'build', '--mode', BUILD_TARGET], targetBuildEnv)
}

main()
