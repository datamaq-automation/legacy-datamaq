import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TARGET_DIRS = ['src', 'tests', 'docs', 'scripts']
const FILE_RE = /\.(ts|tsx|js|jsx|vue|mjs|cjs|json|md|env)$/i
const BLOCK_PATTERNS = [
  /VITE_SKIP_ORIGIN_VERIFY\s*=\s*true/i,
  /ORIGIN_VERIFY_DISABLED\s*=\s*true/i,
  /origin\s*verify\s*:\s*false/i
]

function collectFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry === 'coverage') {
        continue
      }
      files.push(...collectFiles(full))
      continue
    }
    if (FILE_RE.test(entry)) {
      files.push(full)
    }
  }
  return files
}

const matches = []
for (const relDir of TARGET_DIRS) {
  const absDir = path.join(ROOT, relDir)
  try {
    const files = collectFiles(absDir)
    for (const file of files) {
      const content = readFileSync(file, 'utf8')
      for (const pattern of BLOCK_PATTERNS) {
        if (pattern.test(content)) {
          matches.push({ file, pattern: String(pattern) })
        }
      }
    }
  } catch {
    // ignore missing optional directories
  }
}

if (matches.length > 0) {
  for (const match of matches) {
    console.error(`[security:origin-verify] disallowed pattern in ${path.relative(ROOT, match.file)} ${match.pattern}`)
  }
  process.exit(1)
}

console.log('[security:origin-verify] no disallowed origin-verify bypass found')
