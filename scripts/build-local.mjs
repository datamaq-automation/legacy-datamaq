import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const DEFAULT_LOCAL_BUILD_OUT_DIR = 'C:\\AppServ\\www'
const DEFAULT_LOCAL_BACKEND_BASE_URL = 'http://127.0.0.1:8899'
const APP_OUTPUT_ENTRIES = ['assets', 'media', 'w', 'favicon.ico', 'index.html', 'robots.txt', 'sitemap.xml', '_redirects']

function normalize(value) {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed || undefined
}

function removeExistingBuildArtifacts(outputDir) {
  for (const entry of APP_OUTPUT_ENTRIES) {
    fs.rmSync(path.resolve(outputDir, entry), {
      force: true,
      recursive: true
    })
  }
}

function run(command, args, env) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env
  })

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status)
  }

  if (result.error) {
    throw result.error
  }
}

function main() {
  const outputDir = normalize(process.env.LOCAL_BUILD_OUT_DIR) ?? DEFAULT_LOCAL_BUILD_OUT_DIR
  const backendBaseUrl = normalize(process.env.LOCAL_BACKEND_BASE_URL) ?? DEFAULT_LOCAL_BACKEND_BASE_URL

  fs.mkdirSync(outputDir, { recursive: true })
  removeExistingBuildArtifacts(outputDir)

  run(process.execPath, ['scripts/build-target.mjs', ...process.argv.slice(2)], {
    ...process.env,
    BUILD_OUT_DIR: outputDir,
    VITE_BACKEND_BASE_URL: backendBaseUrl,
    VITE_BACKEND_POLICY_MODE: 'local-preview'
  })
}

main()
