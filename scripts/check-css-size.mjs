import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DIST_DIR = path.join(ROOT, 'dist')
const MAX_KB = Number(process.env.CSS_MAX_KB ?? 1024)

function collectCssFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      files.push(...collectCssFiles(full))
      continue
    }
    if (/\.css$/i.test(entry)) {
      files.push(full)
    }
  }
  return files
}

let totalBytes = 0
const cssFiles = collectCssFiles(DIST_DIR)
for (const file of cssFiles) {
  totalBytes += statSync(file).size
}

const totalKb = Math.round((totalBytes / 1024) * 100) / 100
console.log(`[css] files=${cssFiles.length} total=${totalKb}KB limit=${MAX_KB}KB`)

if (totalKb > MAX_KB) {
  console.error(`[css] CSS budget exceeded: ${totalKb}KB > ${MAX_KB}KB`)
  process.exit(1)
}

console.log('[css] budget passed')
