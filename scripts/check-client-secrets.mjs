import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TARGET_DIRS = ['src', 'tests', 'docs', 'scripts', '.env', '.env.example']
const FILE_RE = /\.(ts|tsx|js|jsx|vue|mjs|cjs|json|md|env|txt)$/i

const PATTERNS = [
  /AKIA[0-9A-Z]{16}/g,
  /AIza[0-9A-Za-z\-_]{35}/g,
  /(?:xox[baprs]-)[0-9A-Za-z-]{10,}/g,
  /(?:ghp|github_pat)_[0-9A-Za-z_]{20,}/g,
  /-----BEGIN (?:RSA|EC|OPENSSH|PRIVATE) KEY-----/g
]

function collectFiles(targetPath) {
  const files = []
  const stat = statSync(targetPath)
  if (stat.isDirectory()) {
    for (const entry of readdirSync(targetPath)) {
      const full = path.join(targetPath, entry)
      const childStat = statSync(full)
      if (childStat.isDirectory()) {
        if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry === 'coverage') {
          continue
        }
        files.push(...collectFiles(full))
      } else if (FILE_RE.test(entry)) {
        files.push(full)
      }
    }
  } else if (FILE_RE.test(path.basename(targetPath))) {
    files.push(targetPath)
  }
  return files
}

const findings = []
for (const rel of TARGET_DIRS) {
  const abs = path.join(ROOT, rel)
  try {
    const files = collectFiles(abs)
    for (const file of files) {
      const content = readFileSync(file, 'utf8')
      for (const pattern of PATTERNS) {
        if (pattern.test(content)) {
          findings.push({ file, pattern: String(pattern) })
          break
        }
      }
    }
  } catch {
    // optional path
  }
}

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`[security:client-secrets] possible secret in ${path.relative(ROOT, finding.file)} (${finding.pattern})`)
  }
  process.exit(1)
}

console.log('[security:client-secrets] no obvious client secrets found')
