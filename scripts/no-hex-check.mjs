import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TARGET_DIR = path.join(ROOT, 'src')
const FILE_RE = /\.(css|scss|vue|ts|js)$/i
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g

function collectFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      files.push(...collectFiles(full))
      continue
    }
    if (FILE_RE.test(entry)) {
      files.push(full)
    }
  }
  return files
}

const findings = []
for (const file of collectFiles(TARGET_DIR)) {
  const content = readFileSync(file, 'utf8')
  const matches = content.match(HEX_RE) ?? []
  for (const match of matches) {
    findings.push({ file: path.relative(ROOT, file), value: match })
  }
}

if (findings.length > 0) {
  console.log(`[colors] found ${findings.length} hex occurrences (informational)`)
} else {
  console.log('[colors] no hex colors found')
}
