import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const ROOTS = ['src', 'tests']
const EXTRA_FILES = ['.env.example']
const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.mjs',
  '.scss',
  '.ts',
  '.vue',
  '.yaml',
  '.yml'
])
const VITE_SECRET_PATTERN =
  /\bVITE_[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|API_KEY|CLIENT_SECRET|PRIVATE_KEY|ACCESS_KEY)\b/
const SENSITIVE_HEADERS = ['Authorization', 'X-API-Key', 'X-Api-Key', 'X-Auth-Token']

function normalizePath(value) {
  return value.split(path.sep).join('/')
}

function shouldScanFile(filePath) {
  const baseName = path.basename(filePath)
  if (baseName.startsWith('.env')) {
    return true
  }
  return TEXT_EXTENSIONS.has(path.extname(filePath))
}

async function collectFiles(rootPath) {
  const files = []
  const pending = [rootPath]

  while (pending.length > 0) {
    const currentPath = pending.pop()
    if (!currentPath) {
      continue
    }

    let entries = []
    try {
      entries = await readdir(currentPath, { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name)
      if (entry.isDirectory()) {
        pending.push(entryPath)
        continue
      }

      if (!entry.isFile() || !shouldScanFile(entryPath)) {
        continue
      }

      files.push(entryPath)
    }
  }

  return files
}

async function findClientExposure(filePath) {
  const content = await readFile(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  const matches = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? ''

    const envMatch = line.match(VITE_SECRET_PATTERN)
    if (envMatch) {
      matches.push({
        file: normalizePath(filePath),
        line: index + 1,
        type: 'VITE_SECRET',
        token: envMatch[0]
      })
    }

    for (const header of SENSITIVE_HEADERS) {
      if (!line.includes(header)) {
        continue
      }

      matches.push({
        file: normalizePath(filePath),
        line: index + 1,
        type: 'SENSITIVE_HEADER',
        token: header
      })
    }
  }

  return matches
}

async function main() {
  const files = []
  for (const root of ROOTS) {
    const rootFiles = await collectFiles(root)
    files.push(...rootFiles)
  }

  for (const filePath of EXTRA_FILES) {
    if (shouldScanFile(filePath)) {
      files.push(filePath)
    }
  }

  const findings = []
  for (const filePath of files) {
    const matches = await findClientExposure(filePath)
    findings.push(...matches)
  }

  if (findings.length === 0) {
    console.log(
      '[client-secrets] OK: sin secretos VITE ni headers sensibles en frontend (.env.example/src/tests).'
    )
    return
  }

  console.error('[client-secrets] ERROR: se detectaron exposiciones sensibles en frontend.')
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} [${finding.type}] ${finding.token}`)
  }
  process.exit(1)
}

await main()
