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
const TOKENS = ['VITE_ORIGIN_VERIFY_SECRET', 'X-Origin-Verify']

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

async function findLeaks(filePath) {
  const content = await readFile(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  const matches = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? ''
    for (const token of TOKENS) {
      if (!line.includes(token)) {
        continue
      }

      matches.push({
        file: normalizePath(filePath),
        line: index + 1,
        token
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

  const allMatches = []
  for (const filePath of files) {
    const leaks = await findLeaks(filePath)
    allMatches.push(...leaks)
  }

  if (allMatches.length === 0) {
    console.log(
      '[origin-verify] OK: no hay referencias a VITE_ORIGIN_VERIFY_SECRET ni X-Origin-Verify en frontend.'
    )
    return
  }

  console.error(
    '[origin-verify] ERROR: se detectaron referencias prohibidas (VITE_ORIGIN_VERIFY_SECRET/X-Origin-Verify).'
  )
  for (const match of allMatches) {
    console.error(`- ${match.file}:${match.line} -> ${match.token}`)
  }
  process.exit(1)
}

await main()
